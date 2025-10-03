
// Defines custom error types for the application.

import { getAuth } from 'firebase/auth';
import { auth } from './auth';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

// A custom error class for Firestore permission errors.
// This class is designed to be thrown in the development environment
// to provide a rich, contextual error message in the Next.js error overlay.
export class FirestorePermissionError extends Error {
  public readonly name = 'FirestorePermissionError';
  public readonly details: object;

  constructor(context: SecurityRuleContext) {
    const user = auth.currentUser;
    const authContext = user
      ? {
          uid: user.uid,
          token: {
            name: user.displayName,
            picture: user.photoURL,
            email: user.email,
            email_verified: user.emailVerified,
            phone_number: user.phoneNumber,
            firebase: {
                identities: user.providerData.reduce((acc, p) => ({ ...acc, [p.providerId]: [p.uid] }), {}),
                sign_in_provider: user.providerData[0]?.providerId || 'custom',
            },
          },
        }
      : null;

    const errorDetails = {
      auth: authContext,
      method: context.operation,
      path: `/databases/(default)/documents/${context.path}`,
      ...(context.requestResourceData && { resource: { data: context.requestResourceData } }),
    };

    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(errorDetails, null, 2)}`;
    
    super(message);
    this.details = errorDetails;

    // This is necessary for custom errors to work correctly with instanceof.
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
