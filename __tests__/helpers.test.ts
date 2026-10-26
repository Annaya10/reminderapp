import { sha256 } from '@src/helpers/sha256';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '@src/helpers/validators';
import { matchesFilter } from '@src/modules/reminders/helpers';
import { Reminder } from '@src/modules/reminders/types';

describe('sha256', () => {
  test('matches standard test vectors', () => {
    expect(sha256('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
    expect(sha256('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(
      sha256('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'),
    ).toBe('248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1');
  });

  test('matches Node crypto for non-ASCII and long input', () => {
    const { createHash } = require('crypto');
    const samples = ['é', 'Привет', '🔔 reminder', 'x'.repeat(1000)];
    samples.forEach(sample => {
      expect(sha256(sample)).toBe(
        createHash('sha256').update(sample, 'utf8').digest('hex'),
      );
    });
  });
});

describe('validators', () => {
  test('email', () => {
    expect(validateEmail('')).toBeDefined();
    expect(validateEmail('not-an-email')).toBeDefined();
    expect(validateEmail(' user@example.com ')).toBeUndefined();
  });

  test('password and confirmation', () => {
    expect(validatePassword('12345')).toBeDefined();
    expect(validatePassword('123456')).toBeUndefined();
    expect(validatePasswordConfirmation('secret1', 'secret2')).toBeDefined();
    expect(validatePasswordConfirmation('secret1', 'secret1')).toBeUndefined();
  });
});

describe('reminder filters', () => {
  const now = new Date(2026, 9, 9, 12, 0);
  const at = (date: Date): Reminder => ({
    id: date.toISOString(),
    title: 't',
    description: '',
    coordinate: [0, 0],
    radius: 100,
    remindAt: date.toISOString(),
    createdAt: now.toISOString(),
    isCompleted: false,
  });

  test('today includes earlier and later times on the same day', () => {
    expect(matchesFilter(at(new Date(2026, 9, 9, 8, 0)), 'today', now)).toBe(
      true,
    );
    expect(matchesFilter(at(new Date(2026, 9, 9, 23, 30)), 'today', now)).toBe(
      true,
    );
    expect(matchesFilter(at(new Date(2026, 9, 10, 0, 0)), 'today', now)).toBe(
      false,
    );
  });

  test('upcoming includes only later days', () => {
    expect(
      matchesFilter(at(new Date(2026, 9, 9, 23, 30)), 'upcoming', now),
    ).toBe(false);
    expect(
      matchesFilter(at(new Date(2026, 9, 10, 0, 0)), 'upcoming', now),
    ).toBe(true);
    expect(matchesFilter(at(new Date(2026, 9, 8, 9, 0)), 'upcoming', now)).toBe(
      false,
    );
  });
});
