import { getFirestore } from 'firebase/firestore';
import { firebaseApp, hasFirebaseConfig } from './firebaseApp.js';

export { hasFirebaseConfig };

export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
