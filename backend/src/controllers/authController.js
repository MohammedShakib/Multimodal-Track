import crypto from 'crypto';
import {
  createAppSession,
  deleteAppSession,
  findAppUserByEmail,
  getUserBySessionHash,
  saveAppUser,
  updateAppUserPassword,
} from '../services/databaseService.js';
import {
  buildExpiredSessionCookie,
  buildSessionCookie,
  readCookie,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from '../utils/sessionCookies.js';

const SUPER_ADMIN_USERNAME = process.env.SUPER_ADMIN_USERNAME || 'sadmin';
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'sadmin';
const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL || 'sadmin@multimodal.local';

function publicUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isSuperAdmin: Boolean(user.is_super_admin),
    avatarUrl: user.avatar_url || null,
  };
}

function tokenHash(token) {
  if (!token) return '';
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 120000, 32, 'sha256')
    .toString('hex');

  return `pbkdf2_sha256$120000$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;

  const [scheme, iterations, salt, hash] = storedHash.split('$');
  if (scheme !== 'pbkdf2_sha256' || !iterations || !salt || !hash) {
    return false;
  }

  const candidate = crypto
    .pbkdf2Sync(password, salt, Number(iterations), 32, 'sha256')
    .toString('hex');

  return (
    candidate.length === hash.length &&
    crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash))
  );
}

function normalizeEmail(email) {
  return email?.trim().toLowerCase() || '';
}

async function startSession(req, res, user) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  await createAppSession({
    userId: user.id,
    tokenHash: tokenHash(token),
    expiresAt,
  });
  res.setHeader('Set-Cookie', buildSessionCookie(req, token));
}

export async function signUp(req, res, next) {
  try {
    const name = req.body.name?.trim();
    const email = normalizeEmail(req.body.email);
    const password = req.body.password || '';

    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required.');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters.');
      error.statusCode = 400;
      throw error;
    }

    const existing = await findAppUserByEmail(email);
    if (existing?.password_hash) {
      const error = new Error('This email already has an account.');
      error.statusCode = 409;
      throw error;
    }

    const saved = await saveAppUser({ name, email, source: 'auth' });
    const user = await updateAppUserPassword(
      saved.id,
      createPasswordHash(password),
    );

    await startSession(req, res, user);

    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function signIn(req, res, next) {
  try {
    const emailInput = req.body.email?.trim() || '';
    const password = req.body.password || '';

    if (emailInput === SUPER_ADMIN_USERNAME && password === SUPER_ADMIN_PASSWORD) {
      const admin = await saveAppUser({
        name: 'Super Admin',
        email: SUPER_ADMIN_EMAIL,
        isSuperAdmin: true,
        source: 'super_admin',
      });
      await startSession(req, res, admin);
      res.json({ user: publicUser(admin) });
      return;
    }

    const email = normalizeEmail(emailInput);
    if (!email || !password) {
      const error = new Error('Email and password are required.');
      error.statusCode = 400;
      throw error;
    }

    let user = await findAppUserByEmail(email);

    if (!user) {
      const saved = await saveAppUser({
        name: email.split('@')[0] || 'Student',
        email,
        source: 'auth',
      });
      user = await updateAppUserPassword(saved.id, createPasswordHash(password));
    } else if (!user.password_hash) {
      user = await updateAppUserPassword(user.id, createPasswordHash(password));
    } else if (!verifyPassword(password, user.password_hash)) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    await startSession(req, res, user);

    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const token = readCookie(req, SESSION_COOKIE_NAME);
    const user = await getUserBySessionHash(tokenHash(token));

    res.json({
      authenticated: Boolean(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const token = readCookie(req, SESSION_COOKIE_NAME);

    if (token) {
      await deleteAppSession(tokenHash(token));
    }

    res.setHeader('Set-Cookie', buildExpiredSessionCookie(req));
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function getRequestUser(req) {
  const token = readCookie(req, SESSION_COOKIE_NAME);
  return getUserBySessionHash(tokenHash(token));
}
