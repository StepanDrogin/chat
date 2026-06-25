import { lazy, Suspense, useEffect, useState } from 'react';
import Loader from './components/Loader.jsx';
import Login from './components/Login.jsx';
import { formatFirebaseError } from './lib/firebaseErrors.js';

const Chat = lazy(() => import('./components/Chat.jsx'));

const App = () => {
  const [authService, setAuthService] = useState(null);
  const [hasFirebaseConfig, setHasFirebaseConfig] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authAction, setAuthAction] = useState('');

  useEffect(() => {
    let isMounted = true;
    let unsubscribe;

    const initAuth = async () => {
      try {
        const service = await import('./lib/authService.js');

        if (!isMounted) {
          return;
        }

        setAuthService(service);
        setHasFirebaseConfig(service.hasFirebaseConfig);

        if (!service.auth) {
          setAuthLoading(false);
          return;
        }

        unsubscribe = service.subscribeToAuth(
          (currentUser) => {
            setUser(currentUser);
            setAuthError('');
            setAuthLoading(false);
          },
          (error) => {
            setAuthError(formatFirebaseError(error));
            setAuthLoading(false);
          }
        );
      } catch (error) {
        if (isMounted) {
          setAuthError(formatFirebaseError(error));
          setAuthLoading(false);
        }
      }
    };

    void initAuth();

    return () => {
      isMounted = false;

      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const ensureAuthService = async () => {
    if (authService) {
      return authService;
    }

    const service = await import('./lib/authService.js');
    setAuthService(service);
    setHasFirebaseConfig(service.hasFirebaseConfig);
    return service;
  };

  const handleLogin = async () => {
    setAuthAction('login');
    setAuthError('');

    try {
      const service = await ensureAuthService();

      if (!service.auth) {
        setAuthError('Firebase не настроен. Проверьте переменные окружения VITE_FIREBASE_*.');
        setAuthLoading(false);
        return;
      }

      await service.loginWithGoogle();
    } catch (error) {
      setAuthError(formatFirebaseError(error));
    } finally {
      setAuthAction('');
    }
  };

  const handleLogout = async () => {
    setAuthAction('logout');
    setAuthError('');

    try {
      const service = await ensureAuthService();

      if (service.auth) {
        await service.logout();
      }
    } catch (error) {
      setAuthError(formatFirebaseError(error));
    } finally {
      setAuthAction('');
    }
  };

  if (authLoading) {
    return <Loader label="Подключаем Pulse Chat" />;
  }

  if (!user) {
    return (
      <Login
        authError={authError}
        hasFirebaseConfig={hasFirebaseConfig}
        isSigningIn={authAction === 'login'}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <Suspense fallback={<Loader label="Загружаем комнату" />}>
      <Chat
        authError={authError}
        isSigningOut={authAction === 'logout'}
        onLogout={handleLogout}
        user={user}
      />
    </Suspense>
  );
};

export default App;
