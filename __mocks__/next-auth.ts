/**
 * Mock for next-auth module
 */

export class AuthError extends Error {
  type: string;

  constructor(message?: string) {
    super(message);
    this.type = 'AuthError';
  }
}

export const signIn = jest.fn();
export const signOut = jest.fn();
export const auth = jest.fn();

export default {
  AuthError,
  signIn,
  signOut,
  auth,
};
