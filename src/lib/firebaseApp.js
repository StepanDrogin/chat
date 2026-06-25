import { initializeApp, getApps } from 'firebase/app';

const fallbackConfig = {
  apiKey: 'AIzaSyBVWjtzmLenPfVW0WMi6l2bjfi2eM0nzxc',
  authDomain: 'chat-fddc5.firebaseapp.com',
  projectId: 'chat-fddc5',
  storageBucket: 'chat-fddc5.appspot.com',
  messagingSenderId: '488830618123',
  appId: '1:488830618123:web:6aa8c8d0480a59f4ed550e'
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

export const firebaseApp = hasFirebaseConfig
  ? getApps()[0] || initializeApp(firebaseConfig)
  : null;
