import { createId } from '@src/helpers/id';
import { sha256 } from '@src/helpers/sha256';
import {
  clearSession,
  getSessionUserId,
  saveSession,
} from '@src/services/database/sessionRepository';
import {
  findUserByEmail,
  findUserById,
  insertUser,
  UserRecord,
} from '@src/services/database/userRepository';

/**
 * LOCAL DEMO AUTHENTICATION.
 *
 * Accounts and the session live only in this device's SQLite database.
 * Passwords are salted and hashed so they are not stored in plain text, but
 * this is not secure authentication: there is no server, and anyone with
 * access to the device's data can read or change it. Replace the functions
 * below with calls to a real backend when one is available; the rest of the
 * app only depends on this module's exported API.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Registration extends Credentials {
  name: string;
}

/** An expected failure whose message can be shown to the user. */
export class AuthError extends Error {}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const createSalt = () => createId() + createId();

const hashPassword = (password: string, salt: string) =>
  sha256(`${salt}:${password}`);

const toAuthUser = ({ id, name, email }: UserRecord): AuthUser => ({
  id,
  name,
  email,
});

export const register = async ({
  name,
  email,
  password,
}: Registration): Promise<AuthUser> => {
  const normalizedEmail = normalizeEmail(email);
  if (await findUserByEmail(normalizedEmail)) {
    throw new AuthError('An account with this email already exists.');
  }

  const salt = createSalt();
  const user: UserRecord = {
    id: createId(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password, salt),
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
  };
  await insertUser(user);
  await saveSession(user.id);
  return toAuthUser(user);
};

export const login = async ({
  email,
  password,
}: Credentials): Promise<AuthUser> => {
  const user = await findUserByEmail(normalizeEmail(email));
  if (
    !user ||
    hashPassword(password, user.passwordSalt) !== user.passwordHash
  ) {
    throw new AuthError('Incorrect email or password.');
  }
  await saveSession(user.id);
  return toAuthUser(user);
};

/** Returns the signed-in user from the saved session, if any. */
export const restoreSession = async (): Promise<AuthUser | null> => {
  const userId = await getSessionUserId();
  if (!userId) {
    return null;
  }
  const user = await findUserById(userId);
  if (!user) {
    await clearSession();
    return null;
  }
  return toAuthUser(user);
};

export const logout = (): Promise<void> => clearSession();
