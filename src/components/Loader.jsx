import { MessageCircle } from 'lucide-react';

const Loader = ({ label = 'Загружаем чат' }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <section className="surface-panel flex w-full max-w-sm flex-col items-center rounded-lg px-8 py-10 text-center">
        <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-teal-600 text-white">
          <span className="ui-span absolute inline-flex h-full w-full animate-ping rounded-lg bg-teal-500 opacity-25" />
          <MessageCircle aria-hidden="true" className="relative h-7 w-7" />
        </div>
        <h1 className="ui-title text-xl">{label}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Проверяем авторизацию и соединение с Firebase.
        </p>
      </section>
    </main>
  );
};

export default Loader;
