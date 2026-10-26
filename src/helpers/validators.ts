export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Each validator returns an error message, or undefined when valid. */

export const validateName = (name: string): string | undefined =>
  name.trim() ? undefined : 'Please enter your name.';

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Please enter your email.';
  }
  return EMAIL_PATTERN.test(email.trim())
    ? undefined
    : 'Please enter a valid email address.';
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Please enter your password.';
  }
  return password.length >= MIN_PASSWORD_LENGTH
    ? undefined
    : `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
};

export const validatePasswordConfirmation = (
  password: string,
  confirmation: string,
): string | undefined => {
  if (!confirmation) {
    return 'Please confirm your password.';
  }
  return password === confirmation ? undefined : 'Passwords do not match.';
};
