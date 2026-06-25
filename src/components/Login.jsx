import {
  AlertTriangle,
  ArrowRight,
  LockKeyhole,
  MessageCircle,
  Radio,
  Sparkles
} from 'lucide-react';

const previewMessages = [
  {
    author: 'Анна',
    text: 'Запустили релиз, чат уже пишет в Firestore.',
    tone: 'incoming'
  },
  {
    author: 'Вы',
    text: 'Отлично. Проверяю свежий экран и мобильный вид.',
    tone: 'own'
  },
  {
    author: 'Миша',
    text: 'Вижу новые сообщения в общей комнате.',
    tone: 'incoming'
  }
];

const Login = ({ authError, hasFirebaseConfig, isSigningIn, onLogin }) => {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="grid min-h-screen lg:grid-cols-[minmax(360px,460px)_1fr]">
        <aside className="flex min-h-screen flex-col justify-between border-r border-line bg-panel px-6 py-7 sm:px-8">
          <div>
            <div className="motion-panel mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 animate-float-soft items-center justify-center rounded-lg bg-teal-600 text-white shadow-message">
                  <MessageCircle aria-hidden="true" className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="ui-title text-2xl">Pulse Chat</h1>
                  <p className="mt-1 text-sm text-muted">Realtime Firebase chat</p>
                </div>
              </div>
              <span className="ui-span gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                <span aria-hidden="true" className="ui-span relative h-2 w-2 rounded-full bg-teal-500">
                  <span className="ui-span absolute inset-0 rounded-full bg-teal-500 animate-pulse-ring" />
                </span>
                live
              </span>
            </div>

            <section className="surface-panel motion-panel rounded-lg p-6" style={{ animationDelay: '80ms' }}>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-coral-50 text-coral-600">
                <LockKeyhole aria-hidden="true" className="h-6 w-6" />
              </div>
              <h2 className="ui-title text-3xl">Вход в чат</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Авторизуйтесь через Google, чтобы открыть общую комнату.
              </p>

              {!hasFirebaseConfig ? (
                <div className="motion-panel mt-5 flex gap-3 rounded-lg border border-coral-500/30 bg-coral-50 p-4 text-sm leading-6 text-coral-600">
                  <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>Firebase-конфиг не найден. Добавьте переменные VITE_FIREBASE_*.</p>
                </div>
              ) : null}

              {authError ? (
                <div className="motion-panel mt-5 flex gap-3 rounded-lg border border-coral-500/30 bg-coral-50 p-4 text-sm leading-6 text-coral-600">
                  <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>{authError}</p>
                </div>
              ) : null}

              <button
                className="ui-button interactive-lift mt-6 w-full bg-teal-600 px-5 py-3 text-white shadow-message hover:bg-teal-700"
                disabled={isSigningIn}
                onClick={onLogin}
                type="button"
              >
                <Sparkles aria-hidden="true" className="h-5 w-5" />
                {isSigningIn ? 'Открываем Google' : 'Войти через Google'}
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </button>

              <p className="mt-5 text-xs leading-5 text-muted">
                Pulse Chat использует публичный Google-профиль для имени и аватара.
              </p>
            </section>
          </div>
        </aside>

        <section className="hidden min-h-screen px-8 py-7 lg:flex">
          <div className="surface-panel motion-panel flex min-h-0 w-full flex-col overflow-hidden rounded-lg" style={{ animationDelay: '120ms' }}>
            <header className="flex items-center justify-between border-b border-line px-7 py-5">
              <div>
                <h2 className="ui-title text-xl"># general</h2>
                <p className="mt-1 text-sm text-muted">Публичная комната проекта</p>
              </div>
              <span className="ui-span gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700">
                <Radio aria-hidden="true" className="h-4 w-4" />
                online
              </span>
            </header>

            <div className="grid flex-1 grid-cols-[1fr_280px]">
              <div className="space-y-7 px-8 py-8">
                {previewMessages.map((message, index) => (
                  <article
                    className={`motion-panel flex ${message.tone === 'own' ? 'justify-end' : 'justify-start'}`}
                    key={`${message.author}-${message.text}`}
                    style={{ animationDelay: `${180 + index * 90}ms` }}
                  >
                    <div
                      className={`interactive-lift max-w-md rounded-lg px-5 py-4 ${
                        message.tone === 'own'
                          ? 'bg-teal-600 text-white shadow-message'
                          : 'border border-line bg-white text-ink'
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold ${
                          message.tone === 'own' ? 'text-teal-50' : 'text-teal-700'
                        }`}
                      >
                        {message.author}
                      </p>
                      <p className="mt-2 text-sm leading-6">{message.text}</p>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="border-l border-line bg-white/70 px-6 py-7">
                <h3 className="ui-title text-lg">Статус</h3>
                <div className="mt-5 space-y-4 text-sm text-muted">
                  <div className="interactive-lift rounded-lg border border-line bg-white p-4">
                    <p className="font-semibold text-ink">Комната</p>
                    <p className="mt-1 leading-6">general</p>
                  </div>
                  <div className="interactive-lift rounded-lg border border-line bg-white p-4">
                    <p className="font-semibold text-ink">Статус</p>
                    <p className="mt-1 leading-6">online</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
