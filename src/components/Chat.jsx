import { useEffect, useMemo, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Hash,
  LogOut,
  Menu,
  MessageCircle,
  Radio,
  RefreshCcw,
  Send,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  Wifi,
  WifiOff
} from 'lucide-react';
import { firestore } from '../lib/firestoreService.js';
import { formatFirebaseError } from '../lib/firebaseErrors.js';

const channelItems = [
  { icon: MessageCircle, label: 'Чаты', active: true },
  { icon: UserRound, label: 'DMs', active: false },
  { icon: Bookmark, label: 'Избранное', active: false },
  { icon: Settings, label: 'Настройки', active: false }
];

const MAX_MESSAGE_LENGTH = 2000;

const formatTime = (createdAt) => {
  const date = createdAt?.toDate?.();

  if (!date) {
    return 'сейчас';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getInitials = (displayName = '') => {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]).join('');
  return initials || 'U';
};

const Avatar = ({ displayName, photoURL }) => {
  if (photoURL) {
    return (
      <img
        alt={displayName || 'Пользователь'}
        className="interactive-lift h-10 w-10 shrink-0 rounded-lg border border-line object-cover"
        referrerPolicy="no-referrer"
        src={photoURL}
      />
    );
  }

  return (
    <div className="interactive-lift flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-sm font-semibold text-teal-700">
      {getInitials(displayName)}
    </div>
  );
};

const ConnectionBadge = ({ hasError, isOnline }) => {
  if (hasError) {
    return (
      <span className="ui-span gap-2 rounded-lg border border-coral-500/30 bg-coral-50 px-3 py-2 text-sm font-medium text-coral-600">
        <WifiOff aria-hidden="true" className="h-4 w-4" />
        есть ошибка
      </span>
    );
  }

  return (
    <span
      className={`ui-span gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
        isOnline ? 'bg-teal-50 text-teal-700' : 'bg-coral-50 text-coral-600'
      }`}
    >
      {isOnline ? (
        <Wifi aria-hidden="true" className="h-4 w-4" />
      ) : (
        <WifiOff aria-hidden="true" className="h-4 w-4" />
      )}
      {isOnline ? 'online' : 'offline'}
    </span>
  );
};

const MessageRow = ({ message, user }) => {
  const isOwn = message.uid === user.uid;
  const displayName = message.displayName || 'Пользователь';
  const authorName = isOwn ? 'Вы' : displayName;
  const avatarName = isOwn ? user.displayName || 'Вы' : displayName;
  const avatarUrl = isOwn ? user.photoURL : message.photoURL;

  return (
    <article className="motion-panel flex items-start justify-start gap-3">
      <Avatar displayName={avatarName} photoURL={avatarUrl} />

      <div className="flex max-w-[min(78vw,560px)] flex-col items-start">
        <div className="mb-2 flex min-h-10 items-center gap-3">
          <p className="text-sm font-semibold text-ink">{authorName}</p>
          <time className="text-xs text-muted">{formatTime(message.createdAt)}</time>
        </div>

        <div
          className={`interactive-lift rounded-lg px-5 py-4 text-sm leading-6 ${
            isOwn
              ? 'bg-teal-600 text-white shadow-message'
              : 'border border-line bg-white text-ink'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
      </div>
    </article>
  );
};

const Chat = ({ authError, isSigningOut, onLogout, user }) => {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState('');
  const [composerValue, setComposerValue] = useState('');
  const [sendError, setSendError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const bottomRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!firestore) {
      setMessages([]);
      setMessagesLoading(false);
      setMessagesError('Firebase не настроен. Проверьте переменные окружения VITE_FIREBASE_*.');
      return undefined;
    }

    const messagesQuery = query(
      collection(firestore, 'messages'),
      orderBy('createdAt', 'asc'),
      limitToLast(100)
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              createdAt: data.createdAt,
              displayName: data.displayName || 'Пользователь',
              photoURL: data.photoURL || '',
              text: data.text || '',
              uid: data.uid || ''
            };
          })
        );
        setMessagesError('');
        setMessagesLoading(false);
      },
      (error) => {
        setMessagesError(formatFirebaseError(error));
        setMessagesLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  const visibleError = authError || messagesError || sendError;
  const remainingCharacters = MAX_MESSAGE_LENGTH - composerValue.length;
  const canSend = composerValue.trim().length > 0 && remainingCharacters >= 0 && !isSending && !messagesError;

  const memberCount = useMemo(() => {
    const ids = new Set(messages.map((message) => message.uid).filter(Boolean));
    if (user.uid) {
      ids.add(user.uid);
    }
    return ids.size;
  }, [messages, user.uid]);

  const submitMessage = async () => {
    const text = composerValue.trim();

    if (!text || !firestore || !user) {
      return;
    }

    if (text.length > MAX_MESSAGE_LENGTH) {
      setSendError(`Сообщение длиннее ${MAX_MESSAGE_LENGTH} символов.`);
      return;
    }

    setIsSending(true);
    setSendError('');

    try {
      await addDoc(collection(firestore, 'messages'), {
        createdAt: serverTimestamp(),
        displayName: user.displayName || 'Пользователь',
        photoURL: user.photoURL || '',
        text,
        uid: user.uid
      });
      setComposerValue('');
    } catch (error) {
      setSendError(formatFirebaseError(error));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void submitMessage();
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  };

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr_320px]">
        <aside className="hidden border-r border-line bg-panel px-5 py-6 lg:block">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 animate-float-soft items-center justify-center rounded-lg bg-teal-600 text-white shadow-message">
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
              </div>
              <h1 className="ui-title text-xl">Pulse Chat</h1>
            </div>
            <button
              aria-label="Открыть меню"
              className="ui-button interactive-lift h-9 w-9 border border-line bg-white text-muted hover:text-ink"
              type="button"
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-2">
            {channelItems.map(({ active, icon: Icon, label }) => (
              <button
                className={`ui-button interactive-lift w-full justify-start px-3 py-3 ${
                  active
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-muted hover:bg-slate-50 hover:text-ink'
                }`}
                key={label}
                type="button"
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>

          <section className="surface-panel mt-8 rounded-lg bg-white p-4">
            <h2 className="ui-title text-sm">Профиль</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar displayName={user.displayName || 'Вы'} photoURL={user.photoURL} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {user.displayName || 'Пользователь'}
                </p>
                <p className="truncate text-xs text-muted">{user.email || 'Google account'}</p>
              </div>
            </div>
          </section>
        </aside>

        <section className="flex min-h-screen min-w-0 flex-col">
          <header className="sticky top-0 z-10 flex min-h-[76px] items-center justify-between border-b border-line bg-panel/95 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Hash aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="ui-title truncate text-xl">general</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                  <span className="ui-span gap-1">
                    <Radio aria-hidden="true" className="h-3.5 w-3.5 text-teal-600" />
                    {memberCount} участников
                  </span>
                  <span className="ui-span hidden sm:inline-flex">общая комната</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ConnectionBadge hasError={Boolean(visibleError)} isOnline={isOnline} />
              <button
                className="ui-button interactive-lift border border-line bg-white px-3 py-2 text-muted hover:text-ink"
                disabled={isSigningOut}
                onClick={onLogout}
                type="button"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                <span className="ui-span hidden sm:inline-flex">
                  {isSigningOut ? 'Выходим' : 'Выйти'}
                </span>
              </button>
            </div>
          </header>

          {visibleError ? (
            <div className="motion-panel border-b border-coral-500/30 bg-coral-50 px-4 py-3 text-sm text-coral-600 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="leading-6">{visibleError}</p>
                </div>
                <button
                  className="ui-button interactive-lift shrink-0 border border-coral-500/30 bg-white px-3 py-2 text-coral-600 hover:bg-coral-50"
                  onClick={() => window.location.reload()}
                  type="button"
                >
                  <RefreshCcw aria-hidden="true" className="h-4 w-4" />
                  <span className="ui-span hidden sm:inline-flex">Повторить</span>
                </button>
              </div>
            </div>
          ) : null}

          <div aria-live="polite" className="scrollbar-soft flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            {messagesLoading ? (
              <div className="flex min-h-[48vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <Radio aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <h3 className="ui-title text-lg">Загружаем сообщения</h3>
                  <p className="mt-2 text-sm text-muted">Подключаемся к Firestore.</p>
                </div>
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-6">
                {messages.map((message) => (
                  <MessageRow key={message.id} message={message} user={user} />
                ))}
                <div ref={bottomRef} />
              </div>
            ) : (
              <div className="flex min-h-[48vh] items-center justify-center">
                <div className="max-w-sm text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 animate-float-soft items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <MessageCircle aria-hidden="true" className="h-7 w-7" />
                  </div>
                  <h3 className="ui-title text-xl">Сообщений пока нет</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    В комнате пока тихо.
                  </p>
                </div>
              </div>
            )}
          </div>

          <form className="border-t border-line bg-panel p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-5 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]" onSubmit={handleSubmit}>
            <div className="composer-shell flex items-end gap-3 rounded-lg p-3">
              <div className="min-w-0 flex-1">
                <textarea
                  className="max-h-36 min-h-12 w-full resize-none border-0 bg-transparent px-2 py-3 text-sm leading-6 text-ink outline-none placeholder:text-muted"
                  disabled={Boolean(messagesError)}
                  maxLength={MAX_MESSAGE_LENGTH}
                  onChange={(event) => {
                    setComposerValue(event.target.value);
                    if (sendError) {
                      setSendError('');
                    }
                  }}
                  onKeyDown={handleComposerKeyDown}
                  placeholder="Сообщение в #general"
                  rows={1}
                  value={composerValue}
                />
                <div className="flex items-center justify-between px-2 pb-1">
                  <span className="ui-span text-[11px] font-medium text-muted">
                    {isOnline ? 'online' : 'offline'}
                  </span>
                  <span
                    className={`ui-span text-[11px] font-medium ${
                      remainingCharacters < 120 ? 'text-coral-600' : 'text-muted'
                    }`}
                  >
                    {composerValue.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
              </div>
              <button
                className="ui-button interactive-lift shrink-0 bg-teal-600 px-4 py-3 text-white shadow-message hover:bg-teal-700"
                disabled={!canSend}
                type="submit"
              >
                <Send aria-hidden="true" className="h-5 w-5" />
                <span className="ui-span hidden sm:inline-flex">
                  {isSending ? 'Отправка' : 'Отправить'}
                </span>
              </button>
            </div>
          </form>
        </section>

        <aside className="hidden border-l border-line bg-panel px-6 py-6 xl:block">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="ui-title text-lg">Комната</h2>
              <span className="ui-span rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">
                #general
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Общий канал для коротких сообщений проекта.
            </p>
          </section>

          <section className="mt-7 space-y-3">
            <div className="interactive-lift rounded-lg border border-line bg-white p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck aria-hidden="true" className="h-5 w-5 text-teal-600" />
                <h3 className="ui-title text-sm">Сессия</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                {user.displayName || 'Пользователь'} в комнате.
              </p>
            </div>
            <div className="interactive-lift rounded-lg border border-line bg-white p-4">
              <div className="flex items-center gap-3">
                <UsersRound aria-hidden="true" className="h-5 w-5 text-teal-600" />
                <h3 className="ui-title text-sm">Участники</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                Сейчас в ленте видно {memberCount} уникальных профилей.
              </p>
            </div>
            <div className="interactive-lift rounded-lg border border-line bg-white p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-teal-600" />
                <h3 className="ui-title text-sm">Соединение</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{isOnline ? 'online' : 'offline'}</p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default Chat;
