# Pulse Chat

[![CI](https://github.com/StepanDrogin/chat/actions/workflows/ci.yml/badge.svg)](https://github.com/StepanDrogin/chat/actions/workflows/ci.yml)
[![Deploy GitHub Pages](https://github.com/StepanDrogin/chat/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/StepanDrogin/chat/actions/workflows/deploy-pages.yml)

Pulse Chat is a compact realtime web chat built on React, Vite, Tailwind CSS and Firebase. The project is prepared for static hosting and automatic deployment through GitHub Actions.

## What Is Inside

- Google sign-in through Firebase Authentication.
- Realtime messages from Firestore collection `messages`.
- Responsive chat UI for desktop and mobile screens.
- Loading, empty, offline and Firebase error states.
- Vite production build with GitHub Pages base-path support.
- CI/CD workflows, dependency update automation and PR checklist.

## Stack

| Area | Tooling |
| --- | --- |
| UI | React 18, Tailwind CSS, lucide-react |
| Build | Vite |
| Backend | Firebase Auth, Firestore |
| CI/CD | GitHub Actions, GitHub Pages |
| Dependency updates | Dependabot |

## Quick Start

```bash
npm ci
npm run dev
```

Open the app at [http://localhost:5173](http://localhost:5173).

Firebase OAuth may reject `127.0.0.1` unless that exact host is added in Firebase Authorized domains, so use `localhost` locally.

## Scripts

```bash
npm run dev          # local Vite dev server
npm run build        # production build into dist/
npm run preview      # serve the production build locally
npm run audit:prod   # audit production dependencies
npm run check        # production audit + build
```

`npm run build` also creates `dist/404.html` for GitHub Pages fallback behavior.

## Environment

The app can run with the original Firebase project config baked into the source. For a production setup, prefer repository variables or a local `.env` file based on `.env.example`:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Optional:

```bash
VITE_BASE_PATH=/chat/
```

Use `VITE_BASE_PATH=/` for a custom domain or a root GitHub Pages repository like `username.github.io`. For this repository, the deploy workflow auto-resolves `/chat/` when the variable is not set.

## Firebase Setup

Enable these Firebase services:

1. Authentication -> Sign-in method -> Google.
2. Firestore Database.
3. Authentication -> Settings -> Authorized domains:
   - `localhost`
   - `stepandrogin.github.io`
   - your custom domain, if used

The chat reads and writes documents in the `messages` collection ordered by `createdAt`.

Recommended Firestore rules are stored in `firestore.rules`:

```bash
firebase deploy --only firestore:rules --project chat-fddc5
```

You can also paste the same rules manually in Firebase Console:

`Firestore Database -> Rules -> Publish`

Tune rules to your real moderation and retention requirements before production use.

## CI/CD

The repository has two GitHub Actions workflows:

| Workflow | Trigger | What It Does |
| --- | --- | --- |
| `CI` | pull requests, non-main pushes, manual run | `npm ci`, production audit, production build |
| `Deploy GitHub Pages` | push to `main`, manual run | quality gate, build, upload `dist`, publish to GitHub Pages |

To enable deployment:

1. Push this repository to GitHub.
2. Open repository Settings -> Pages.
3. Set Build and deployment -> Source to `GitHub Actions`.
4. Push to `main` or run `Deploy GitHub Pages` manually.

Expected default site URL:

```text
https://stepandrogin.github.io/chat/
```

If you deploy behind a custom domain, add repository variable `VITE_BASE_PATH` with value `/`.

## Project Structure

```text
.github/workflows/       CI and GitHub Pages deployment
public/                  static manifest, favicon and robots.txt
scripts/postbuild.mjs    post-build static hosting helpers
src/components/          UI surfaces
src/lib/                 Firebase app, auth and Firestore services
src/index.css            Tailwind layers and UI primitives
tailwind.config.js       design tokens
vite.config.js           Vite config with deploy base path
```

## Deployment Notes

- `dist/` is generated output and is ignored by Git.
- GitHub Pages deploys the uploaded artifact, not committed build files.
- Firebase web API keys are public identifiers, but prefer GitHub repository variables for environment-specific projects.
- Google sign-in will fail on deployed domains until the domain is added to Firebase Authorized domains.
