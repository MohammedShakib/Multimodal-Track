import pg from 'pg';

const { Pool } = pg;

let pool;
let initialized = false;

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim();
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

function getPool() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: Number(process.env.DATABASE_POOL_SIZE || 5),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false },
    });
  }

  return pool;
}

export async function initializeDatabase() {
  const database = getPool();

  if (!database || initialized) {
    return { configured: Boolean(database), initialized };
  }

  await database.query(`
    CREATE TABLE IF NOT EXISTS board_analyses (
      id BIGSERIAL PRIMARY KEY,
      user_name TEXT,
      user_email TEXT,
      image_filename TEXT,
      image_mime_type TEXT,
      image_size_bytes INTEGER,
      markdown_summary TEXT NOT NULL DEFAULT '',
      code_snippets JSONB NOT NULL DEFAULT '[]'::jsonb,
      flashcards JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS app_users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
      password_hash TEXT,
      avatar_url TEXT,
      source TEXT NOT NULL DEFAULT 'auth',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE app_users
      ADD COLUMN IF NOT EXISTS password_hash TEXT,
      ADD COLUMN IF NOT EXISTS avatar_url TEXT;

    CREATE TABLE IF NOT EXISTS app_sessions (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      token_hash TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL
    );

    CREATE INDEX IF NOT EXISTS board_analyses_created_at_idx
      ON board_analyses (created_at DESC);

    CREATE INDEX IF NOT EXISTS board_analyses_user_email_idx
      ON board_analyses (user_email);

    CREATE INDEX IF NOT EXISTS app_users_last_seen_at_idx
      ON app_users (last_seen_at DESC);

    CREATE INDEX IF NOT EXISTS app_sessions_token_hash_idx
      ON app_sessions (token_hash);

    CREATE INDEX IF NOT EXISTS app_sessions_expires_at_idx
      ON app_sessions (expires_at);
  `);

  initialized = true;
  return { configured: true, initialized: true };
}

export async function saveAppUser({
  name,
  email,
  isSuperAdmin = false,
  source = 'auth',
} = {}) {
  const database = getPool();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!database || !normalizedEmail) {
    return null;
  }

  await initializeDatabase();

  const saved = await database.query(
    `
      INSERT INTO app_users (name, email, is_super_admin, source)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email)
      DO UPDATE SET
        name = COALESCE(NULLIF(EXCLUDED.name, ''), app_users.name),
        is_super_admin = EXCLUDED.is_super_admin,
        source = EXCLUDED.source,
        last_seen_at = NOW()
      RETURNING id, name, email, is_super_admin, avatar_url, source, created_at, last_seen_at;
    `,
    [name?.trim() || null, normalizedEmail, Boolean(isSuperAdmin), source],
  );

  return saved.rows[0];
}

export async function findAppUserByEmail(email) {
  const database = getPool();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!database || !normalizedEmail) {
    return null;
  }

  await initializeDatabase();

  const result = await database.query(
    `
      SELECT
        id,
        name,
        email,
        is_super_admin,
        password_hash,
        avatar_url,
        source,
        created_at,
        last_seen_at
      FROM app_users
      WHERE email = $1
      LIMIT 1;
    `,
    [normalizedEmail],
  );

  return result.rows[0] || null;
}

export async function updateAppUserPassword(userId, passwordHash) {
  const database = getPool();

  if (!database || !userId || !passwordHash) {
    return null;
  }

  await initializeDatabase();

  const result = await database.query(
    `
      UPDATE app_users
      SET password_hash = $2, last_seen_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, is_super_admin, avatar_url, source, created_at, last_seen_at;
    `,
    [userId, passwordHash],
  );

  return result.rows[0] || null;
}

export async function createAppSession({ userId, tokenHash, expiresAt }) {
  const database = getPool();

  if (!database || !userId || !tokenHash || !expiresAt) {
    return null;
  }

  await initializeDatabase();

  const result = await database.query(
    `
      INSERT INTO app_sessions (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, expires_at;
    `,
    [userId, tokenHash, expiresAt],
  );

  return result.rows[0] || null;
}

export async function getUserBySessionHash(tokenHash) {
  const database = getPool();

  if (!database || !tokenHash) {
    return null;
  }

  await initializeDatabase();

  const result = await database.query(
    `
      SELECT
        u.id,
        u.name,
        u.email,
        u.is_super_admin,
        u.avatar_url,
        u.source,
        u.created_at,
        u.last_seen_at,
        s.expires_at AS session_expires_at
      FROM app_sessions s
      JOIN app_users u ON u.id = s.user_id
      WHERE s.token_hash = $1
        AND s.expires_at > NOW()
      LIMIT 1;
    `,
    [tokenHash],
  );

  const user = result.rows[0] || null;

  if (user) {
    await database.query(
      'UPDATE app_sessions SET last_seen_at = NOW() WHERE token_hash = $1;',
      [tokenHash],
    );
    await database.query(
      'UPDATE app_users SET last_seen_at = NOW() WHERE id = $1;',
      [user.id],
    );
  }

  return user;
}

export async function deleteAppSession(tokenHash) {
  const database = getPool();

  if (!database || !tokenHash) {
    return false;
  }

  await initializeDatabase();
  await database.query('DELETE FROM app_sessions WHERE token_hash = $1', [
    tokenHash,
  ]);
  return true;
}

export async function getDatabaseStatus() {
  const database = getPool();

  if (!database) {
    return { configured: false, connected: false };
  }

  try {
    await database.query('SELECT 1');
    return { configured: true, connected: true };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      error: error.message,
    };
  }
}

export async function saveBoardAnalysis({ file, result, user }) {
  const database = getPool();

  if (!database) {
    return null;
  }

  await initializeDatabase();

  if (user?.email) {
    await saveAppUser({
      name: user.name,
      email: user.email,
      source: 'analysis',
    });
  }

  const saved = await database.query(
    `
      INSERT INTO board_analyses (
        user_name,
        user_email,
        image_filename,
        image_mime_type,
        image_size_bytes,
        markdown_summary,
        code_snippets,
        flashcards
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)
      RETURNING id, created_at;
    `,
    [
      user?.name || null,
      user?.email || null,
      file?.originalname || null,
      file?.mimetype || null,
      file?.size || null,
      result.markdown_summary || '',
      JSON.stringify(result.code_snippets || []),
      JSON.stringify(result.flashcards || []),
    ],
  );

  return saved.rows[0];
}

export async function getRecentBoardAnalyses({ userEmail, limit = 20 } = {}) {
  const database = getPool();

  if (!database) {
    return [];
  }

  await initializeDatabase();

  const boundedLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const params = [];
  let whereClause = '';

  if (userEmail) {
    params.push(userEmail);
    whereClause = 'WHERE user_email = $1';
  }

  params.push(boundedLimit);
  const limitParam = params.length;

  const result = await database.query(
    `
      SELECT
        id,
        user_name,
        user_email,
        image_filename,
        image_mime_type,
        image_size_bytes,
        markdown_summary,
        code_snippets,
        flashcards,
        created_at
      FROM board_analyses
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${limitParam};
    `,
    params,
  );

  return result.rows;
}

// Super Admin helpers

export async function getAdminStats() {
  const database = getPool();

  if (!database) {
    return {
      configured: false,
      totalAnalyses: 0,
      uniqueUsers: 0,
      totalImageSizeBytes: 0,
      latestActivity: null,
    };
  }

  await initializeDatabase();

  try {
    const result = await database.query(`
      WITH user_stats AS (
        SELECT COUNT(*)::int AS unique_users
        FROM app_users
        WHERE is_super_admin = FALSE
      )
      SELECT
        COUNT(*)::int                         AS total_analyses,
        (SELECT unique_users FROM user_stats) AS unique_users,
        COALESCE(SUM(image_size_bytes), 0)    AS total_image_size_bytes,
        MAX(created_at)                       AS latest_activity
      FROM board_analyses;
    `);

    const row = result.rows[0];
    return {
      configured: true,
      totalAnalyses: row.total_analyses,
      uniqueUsers: row.unique_users,
      totalImageSizeBytes: Number(row.total_image_size_bytes),
      latestActivity: row.latest_activity,
    };
  } catch {
    return { configured: true, error: 'Failed to fetch stats' };
  }
}

export async function getAllUsers() {
  const database = getPool();

  if (!database) return [];

  await initializeDatabase();

  try {
    const result = await database.query(`
      WITH user_emails AS (
        SELECT email
        FROM app_users
        WHERE is_super_admin = FALSE
        UNION
        SELECT user_email AS email
        FROM board_analyses
        WHERE user_email IS NOT NULL
      )
      SELECT
        e.email,
        COALESCE(MAX(u.name), MAX(a.user_name), split_part(e.email, '@', 1)) AS name,
        COUNT(a.id)::int                                                     AS total_analyses,
        MIN(a.created_at)                                                     AS first_active,
        COALESCE(MAX(a.created_at), MAX(u.last_seen_at))                      AS last_active,
        MAX(u.created_at)                                                     AS registered_at,
        MAX(u.last_seen_at)                                                   AS last_seen_at
      FROM user_emails e
      LEFT JOIN app_users u ON u.email = e.email
      LEFT JOIN board_analyses a ON a.user_email = e.email
      GROUP BY e.email
      ORDER BY last_active DESC NULLS LAST;
    `);
    return result.rows;
  } catch {
    return [];
  }
}

export async function deleteUser(email) {
  const database = getPool();

  if (!database) return false;

  await initializeDatabase();

  try {
    await database.query('DELETE FROM app_users WHERE email = $1', [email]);
    await database.query(
      'DELETE FROM board_analyses WHERE user_email = $1',
      [email],
    );
    return true;
  } catch {
    return false;
  }
}

export async function addUser({ name, email }) {
  const database = getPool();

  if (!database) return null;

  try {
    return await saveAppUser({ name, email, source: 'admin' });
  } catch {
    return null;
  }
}
