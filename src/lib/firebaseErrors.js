const firebaseErrorMessages = {
  'auth/popup-closed-by-user': 'Окно входа было закрыто до завершения авторизации.',
  'auth/popup-blocked': 'Браузер заблокировал окно входа. Разрешите всплывающее окно и повторите.',
  'auth/unauthorized-domain':
    'Домен деплоя не добавлен в Firebase Authentication -> Settings -> Authorized domains.',
  'auth/network-request-failed': 'Firebase Auth недоступен. Проверьте сеть и повторите вход.',
  'auth/operation-not-allowed': 'Google-вход не включен в настройках Firebase Authentication.',
  'permission-denied':
    'Firestore отклонил запрос. Проверьте правила доступа к коллекции messages.',
  unauthenticated: 'Для отправки сообщений нужно войти через Google.',
  unavailable: 'Firestore временно недоступен. Повторите действие позже.',
  'failed-precondition':
    'Firestore вернул ошибку индекса или конфигурации. Проверьте настройки проекта Firebase.'
};

export const formatFirebaseError = (error) => {
  if (!error) {
    return 'Произошла неизвестная ошибка Firebase.';
  }

  const code = error.code || '';
  return firebaseErrorMessages[code] || error.message || `Firebase вернул ошибку ${code}.`;
};
