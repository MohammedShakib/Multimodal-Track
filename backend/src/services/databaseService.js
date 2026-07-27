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

    CREATE INDEX IF NOT EXISTS board_analyses_created_at_idx
      ON board_analyses (created_at DESC);

    CREATE INDEX IF NOT EXISTS board_analyses_user_email_idx
      ON board_analyses (user_email);
  `);

  initialized = true;
  return { configured: true, initialized: true };
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
