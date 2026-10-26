import * as authService from '@src/services/authService';
import { AuthError } from '@src/services/authService';
import * as sessionRepository from '@src/services/database/sessionRepository';
import * as userRepository from '@src/services/database/userRepository';
import { UserRecord } from '@src/services/database/userRepository';

jest.mock('@src/services/database/userRepository');
jest.mock('@src/services/database/sessionRepository');

const users = jest.mocked(userRepository);
const session = jest.mocked(sessionRepository);

describe('authService (local demo auth)', () => {
  let stored: UserRecord[];

  beforeEach(() => {
    stored = [];
    users.findUserByEmail.mockImplementation(
      async email => stored.find(user => user.email === email) ?? null,
    );
    users.findUserById.mockImplementation(
      async id => stored.find(user => user.id === id) ?? null,
    );
    users.insertUser.mockImplementation(async user => {
      stored.push(user);
    });
    session.saveSession.mockResolvedValue();
    session.clearSession.mockResolvedValue();
  });

  test('register hashes the password, normalizes email and saves the session', async () => {
    const user = await authService.register({
      name: ' Ada ',
      email: ' Ada@Example.com ',
      password: 'secret1',
    });

    expect(user).toEqual({
      id: stored[0].id,
      name: 'Ada',
      email: 'ada@example.com',
    });
    expect(stored[0].passwordHash).not.toContain('secret1');
    expect(stored[0].passwordHash).toHaveLength(64);
    expect(session.saveSession).toHaveBeenCalledWith(stored[0].id);
  });

  test('register rejects a duplicate email', async () => {
    await authService.register({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'secret1',
    });
    await expect(
      authService.register({
        name: 'Other',
        email: 'ADA@example.com',
        password: 'secret2',
      }),
    ).rejects.toBeInstanceOf(AuthError);
  });

  test('login accepts the right password and rejects a wrong one', async () => {
    await authService.register({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'secret1',
    });
    session.saveSession.mockClear();

    await expect(
      authService.login({ email: 'ada@example.com', password: 'wrong!' }),
    ).rejects.toThrow('Incorrect email or password.');
    expect(session.saveSession).not.toHaveBeenCalled();

    const user = await authService.login({
      email: 'ADA@example.com',
      password: 'secret1',
    });
    expect(user.email).toBe('ada@example.com');
    expect(session.saveSession).toHaveBeenCalledWith(user.id);
  });

  test('restoreSession returns the saved user, or clears a stale session', async () => {
    const user = await authService.register({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'secret1',
    });

    session.getSessionUserId.mockResolvedValue(user.id);
    await expect(authService.restoreSession()).resolves.toEqual(user);

    session.getSessionUserId.mockResolvedValue('deleted-user');
    await expect(authService.restoreSession()).resolves.toBeNull();
    expect(session.clearSession).toHaveBeenCalled();

    session.getSessionUserId.mockResolvedValue(null);
    await expect(authService.restoreSession()).resolves.toBeNull();
  });
});
