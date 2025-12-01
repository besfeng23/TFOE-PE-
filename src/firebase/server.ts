import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebaseAdmin() {
  if (!getApps().length) {
    // When running in a Google Cloud environment, the SDK can automatically
    // detect the service account credentials.
    const app = initializeApp({
        credential: credential.applicationDefault()
    });
    return getAdminSdks(app);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getAdminSdks(getApp());
}

export function getAdminSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    firestore: getFirestore(firebaseApp),
  };
}
