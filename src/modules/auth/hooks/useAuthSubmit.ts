import { useCallback, useState } from 'react';

import { AuthError } from '@src/services/authService';

const UNEXPECTED_ERROR = 'Something went wrong. Please try again.';

/** Runs an auth action, tracking loading and a user-facing error message. */
export const useAuthSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = useCallback(async (action: () => Promise<void>) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await action();
    } catch (error) {
      if (!(error instanceof AuthError)) {
        console.error('[Auth] request failed', error);
      }
      setFormError(
        error instanceof AuthError ? error.message : UNEXPECTED_ERROR,
      );
      setIsSubmitting(false);
    }
    // On success the navigator switches to the main app and unmounts this screen.
  }, []);

  return {
    isSubmitting,
    formError,
    submit,
    clearFormError: () => setFormError(null),
  };
};
