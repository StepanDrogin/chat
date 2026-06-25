import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp, hasFirebaseConfig } from './firebaseApp.js';

export const auth = firebaseApp ? getAuth(firebaseApp) : null;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { hasFirebaseConfig };

export const subscribeToAuth = (onUser, onError) => {
  if (!auth) {
    return undefined;
  }

  return onAuthStateChanged(auth, onUser, onError);
};

export const loginWithGoogle = () => {
  if (!auth) {
    return Promise.reject(new Error('Firebase Auth is not configured.'));
  }

  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  if (!auth) {
    return Promise.resolve();
  }

  return signOut(auth);
};
