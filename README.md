# 🎮 Seen Game Pro - AI-Powered Quiz and Monetization Platform

🌐 **Visit live website:** https://seen-pro-game-frontend.vercel.app/

A production-oriented **full-stack web application** built with **Next.js + Express + MySQL** for multilingual quiz gameplay, joker economy, leaderboard competition, and Tap-based package purchases.

---

## 🔗 Navigation

- [⚙️ Setup and Run](#-setup-and-run)
- [🏗️ Architecture Overview](#-architecture-overview)
- [🌐 API Overview](#-api-overview)
- [🛠️ Technical Decisions](#-technical-decisions)
- [🚧 Challenges Faced](#-challenges-faced)
- [✅ Current Completion Snapshot](#-current-completion-snapshot)
- [🧭 User Flow (Quick Manual)](#-user-flow-quick-manual)
- [📸 Screenshots](#-screenshots)

---

## ⚙️ Setup and Run

Follow these steps to run the full project locally (frontend + backend).

### 1. Prerequisites

Before you begin, make sure these are installed:

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **MySQL 8+**
- (Optional) **Git**

### 2. Installation Steps

Clone and install dependencies for both apps:

```bash
# Clone
git clone <your-repo-url>

# Go to project root
cd seen-game-pro

# Frontend deps
cd seen-game-pro-frontend
npm install

# Backend deps
cd ../seen-game-pro-backend
npm install
```

### 3. Environment Variables

This project requires separate environment files for frontend and backend.

#### Frontend (`seen-game-pro-frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_FACEBOOK_APP_ID=
```

#### Backend (`seen-game-pro-backend/.env`)

```env
PORT=5000
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your-db-password
DB_NAME=seen_game_pro
DB_SSL=false

JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-secret

GOOGLE_CLIENT_ID=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

TAP_SECRET_KEY=
BASE_URL=http://localhost:5000

GEMINI_API_KEY=
```

### 4. How to Run the Project

Run backend and frontend in separate terminals:

```bash
# Terminal 1 (Backend)
cd seen-game-pro-backend
npm run dev
```

```bash
# Terminal 2 (Frontend)
cd seen-game-pro-frontend
npm run dev
```

Open:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

## 🏗️ Architecture Overview

### 1. Folder Structure

The codebase is split into two deployable apps.

#### Frontend (`seen-game-pro-frontend`)

```text
seen-game-pro-frontend/
|-- app/
|   |-- favicon.ico -> Browser tab icon for the Next.js app.
|   |-- globals.css -> Global styles, design tokens, and utility-level app styling.
|   |-- layout.js -> Root layout wrapper that mounts providers and shared app shell behavior.
|   |-- page.js -> Landing/home page entry route.
|   |-- admin/
|   |   |-- page.js -> Admin dashboard landing page.
|   |   |-- ai-generator/
|   |   |   `-- page.js -> Admin UI for AI-based question generation.
|   |   |-- questions/
|   |   |   `-- page.js -> Admin question management page (view/edit/delete flow).
|   |   `-- users/
|   |       `-- page.js -> Admin user management page (ban/unban and controls).
|   |-- categories/
|   |   `-- page.js -> Quiz category grid page.
|   |-- leaderboard/
|   |   `-- page.js -> Global leaderboard and ranking views.
|   |-- login/
|   |   `-- page.js -> Login page with standard and social auth entry points.
|   |-- payment/
|   |   |-- page.js -> Tap payment gateway UI and payment method flow.
|   |   |-- failed/
|   |   |   `-- page.js -> Payment failure result page.
|   |   `-- success/
|   |       `-- page.js -> Payment success result page.
|   |-- play/
|   |   |-- active/
|   |   |   `-- page.js -> Active quiz gameplay screen.
|   |   `-- [categoryId]/
|   |       `-- page.js -> Category-scoped quiz route and game initialization screen.
|   |-- profile/
|   |   `-- page.js -> User profile, stats, and history area.
|   |-- register/
|   |   `-- page.js -> User registration page with social signup options.
|   |-- result/
|   |   `-- page.js -> Quiz result summary page (score/streak/accuracy details).
|   `-- shop/
|       `-- page.js -> Shop page for package and joker purchase flow.
|-- components/
|   |-- AppBottomNav.js -> Mobile bottom navigation for key app routes.
|   |-- AppShell.js -> Main authenticated layout container.
|   |-- AppSidebar.js -> Desktop/mobile sidebar navigation with active-state logic.
|   |-- JokerDock.js -> Joker purchase/use modal UI and interaction logic.
|   |-- LanguageSync.js -> Keeps selected language synced with i18n state.
|   |-- Navbar.js -> Top navigation/header controls and quick actions.
|   |-- PackageCard.js -> Reusable pricing/package presentation card.
|   |-- PageHeader.js -> Reusable internal page header block.
|   |-- ProtectedRoute.js -> Route guard wrapper for authenticated page access.
|   |-- TimerBar.js -> Quiz timer/progress visual component.
|   |-- auth/
|   |   |-- AnimatedDotBackground.js -> Auth-page animated decorative background.
|   |   |-- LanguageTabs.js -> Language tab switcher for auth screens.
|   |   |-- LoginVisualPanel.js -> Left visual/info panel for login layout.
|   |   |-- RegisterVisualPanel.js -> Left visual/info panel for register layout.
|   |   `-- SocialAuthButton.js -> Shared social login/signup button component.
|   |-- landing/
|   |   |-- CategoriesSection.js -> Landing categories feature section.
|   |   |-- CtaSection.js -> Landing call-to-action section.
|   |   |-- FeaturesSection.js -> Landing product feature highlights section.
|   |   |-- Footer.js -> Landing/footer links and branding section.
|   |   |-- HeroSection.js -> Landing hero section with primary messaging.
|   |   `-- PricingSection.js -> Landing pricing/package section.
|   `-- ui/
|       |-- Badge.js -> Reusable badge primitive.
|       |-- Button.js -> Reusable button primitive.
|       `-- Input.js -> Reusable input field primitive.
|-- lib/
|   |-- api.js -> Axios client setup and authenticated API request helpers.
|   |-- auth.js -> Auth helper utilities for token/session checks.
|   |-- i18n-client.js -> Client i18n initialization and runtime bindings.
|   |-- i18n-settings.js -> Locale normalization and locale-path settings.
|   |-- i18n.js -> Translation hooks/helpers used by components.
|   |-- languages.js -> Supported language metadata and RTL helpers.
|   |-- socialAuth.js -> Google/Facebook SDK and provider login flow helpers.
|   `-- utils.js -> Generic shared utility functions.
|-- providers/
|   |-- I18nProvider.js -> Top-level i18n provider wrapper.
|   `-- ReduxProvider.js -> Top-level Redux provider wrapper.
|-- store/
|   |-- index.js -> Redux store configuration and middleware setup.
|   `-- slices/
|       |-- adminSlice.js -> Admin state and async actions.
|       |-- authSlice.js -> Auth/session state and login/logout/social thunks.
|       |-- quizSlice.js -> Quiz gameplay and language state management.
|       `-- shopSlice.js -> Shop/packages/payment-related state.
`-- public/
    `-- locales/
        |-- ar/common.json -> Arabic translation dictionary.
        |-- en/common.json -> English translation dictionary.
        |-- es/common.json -> Spanish translation dictionary.
        `-- fr/common.json -> French translation dictionary.
```

#### Backend (`seen-game-pro-backend`)

```text
seen-game-pro-backend/
|-- src/
|   |-- app.js -> Express app bootstrap, middleware pipeline, and route registration.
|   |-- config/
|   |   `-- db.js -> MySQL pool/connection configuration and DB access export.
|   |-- controllers/
|   |   |-- admin.controller.js -> Admin analytics and user moderation logic.
|   |   |-- auth.controller.js -> Register/login/refresh/logout/social auth handlers.
|   |   |-- joker.controller.js -> Joker inventory, usage, and purchase handling.
|   |   |-- leaderboard.controller.js -> Leaderboard query, ranking, and summary logic.
|   |   |-- payment.controller.js -> Package listing, Tap charge creation, callback/webhook processing.
|   |   |-- question.controller.js -> Category fetch and AI question generation/CRUD for admin.
|   |   `-- quiz.controller.js -> Quiz start, answer checking, submit, history, and stats logic.
|   |-- middleware/
|   |   |-- auth.js -> JWT access-token verification middleware.
|   |   `-- isAdmin.js -> Admin role authorization middleware.
|   |-- routes/
|   |   |-- admin.routes.js -> Admin-protected route map.
|   |   |-- auth.routes.js -> Authentication route map.
|   |   |-- joker.routes.js -> Joker module route map.
|   |   |-- leaderboard.routes.js -> Leaderboard route map.
|   |   |-- payment.routes.js -> Payment module route map.
|   |   |-- question.routes.js -> Question/category/admin generation route map.
|   |   `-- quiz.routes.js -> Quiz gameplay route map.
|   `-- services/
|       |-- auth-schema.service.js -> Startup DB schema guard/migration helper for auth/language/quiz fields.
|       `-- social-auth.service.js -> Provider token verification and social profile mapping service.
`-- scripts/
    |-- check-leaderboard-db.js -> Script to validate leaderboard DB behavior.
    |-- debug-raw.js -> Raw debugging utility for backend data checks.
    |-- doctor.js -> Project health-check helper script.
    |-- exhaust-test.js -> Stress/exhaustive test utility script.
    |-- list-models.js -> Lists available AI model options used in generation tooling.
    |-- seed-questions.js -> Seeds questions into DB for development/testing.
    |-- test-models.js -> Quick model connectivity/behavior validation script.
    |-- test-v1.js -> Legacy/targeted backend API test script.
    `-- verify-schema.js -> Verifies required DB schema columns/constraints.
```

### 2. State Management Approach

Frontend uses **Redux Toolkit** with domain-based slices:

- **`authSlice`**: authentication state, social login integration, user session data.
- **`quizSlice`**: active quiz state, selected language, gameplay flow.
- **`shopSlice`**: packages, purchase state, qeem-related UI data.
- **`adminSlice`**: admin panel data for users/questions/stats.

Why this approach:
- predictable state transitions,
- scalable feature isolation,
- easy async side-effect handling with thunks.

### 3. Internationalization (i18n)

- Implemented with **i18next + react-i18next**.
- Supported languages: **Arabic, English, French, Spanish**.
- Translation files are JSON-based under `public/locales/<lang>/common.json`.
- Language selection is connected with UI and shared app state.
- Arabic language uses RTL-friendly layout behavior where applicable.

---

## 🌐 API Overview

Base URL: `http://localhost:5000/api`

- **Auth**
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/social`
  - `POST /auth/refresh`
  - `POST /auth/logout`
- **Quiz**
  - `GET /quiz/start`
  - `POST /quiz/answer-check`
  - `POST /quiz/submit`
  - `GET /quiz/history`
  - `GET /quiz/stats`
- **Questions/Admin Generation**
  - `GET /questions/categories`
  - `POST /questions/generate` (admin)
  - `GET /questions` (admin)
  - `PUT /questions/:id` (admin)
  - `DELETE /questions/:id` (admin)
- **Payment**
  - `GET /payment/packages`
  - `POST /payment/create`
  - `GET /payment/callback`
  - `POST /payment/webhook`
- **Joker**
  - `GET /joker/inventory`
  - `POST /joker/use`
  - `POST /joker/buy`
- **Leaderboard**
  - `GET /leaderboard`
- **Admin**
  - `GET /admin/users`
  - `PATCH /admin/users/:id/ban`
  - `GET /admin/stats`

---

## 🛠️ Technical Decisions

### 1. Libraries and Patterns

- **Next.js (App Router)** for frontend routing and modular page composition.
- **Redux Toolkit** for scalable state management.
- **Tailwind CSS** for responsive utility-first UI implementation.
- **Express + MySQL2** for backend API and relational data persistence.
- **JWT (access + refresh)** for secure session architecture.
- **Helmet + Rate Limiting + CORS** for baseline API security hardening.
- **Tap Payment API** for real-money package purchase flow.
- **Gemini API integration** for admin-side AI question generation.

### 2. Trade-offs Made

- Payment flow is integrated in code, but full production behavior depends on valid Tap credentials/webhooks.
- AI question generation endpoint is implemented, but depends on a valid Gemini API key.
- Some social-login success conditions depend on provider app console configuration (Google/Facebook).

### 3. Future Improvements

- Add automated test coverage (unit + integration + e2e).
- Add observability (structured logging, request tracing, error dashboards).
- Add stronger anti-cheat and gameplay anomaly detection.
- Add CI/CD checks (lint, test, build, migration verification).

## 🚧 Challenges Faced

### 1. Social Auth Environment Consistency

- **Problem:** Social login can fail when provider IDs or backend env values are missing or stale after changes.
- **Solution:** Backend token verification + schema guards were implemented, and env templates were standardized.

### 2. Multilingual and RTL Consistency

- **Problem:** Hardcoded strings, mixed-language rendering, or missing RTL handling can create inconsistent UX.
- **Solution:** JSON-driven i18n flow and RTL-aware rendering were aligned across major pages.

### 3. Payment Reliability in Dev vs Production

- **Problem:** Local development callbacks can differ from production behavior if `BASE_URL` / webhook endpoints are misconfigured.
- **Solution:** Callback + webhook handlers were implemented with transaction state checks and controlled redirects.

## ✅ Current Completion Snapshot

- Landing, auth, categories, active quiz, result, leaderboard, profile, shop, and joker flows are implemented.
- Admin pages (users/questions/AI generation) and related backend endpoints are implemented.
- Tap payment and AI generation are code-complete but require real credentials/config to be fully production-operational.

## 🧭 User Flow (Quick Manual)

1. User lands on the home page and chooses language.
2. User logs in/registers (email-password or social provider).
3. User enters app shell and navigates via sidebar/bottom-nav.
4. User opens category grid and starts quiz.
5. During quiz, user can use jokers (or purchase if inventory is empty).
6. User submits quiz and sees result/stats.
7. User visits leaderboard to compare ranking.
8. User visits shop, selects package, and proceeds to Tap payment.
9. On successful payment, Qeem balance updates and user returns to app flow.

## 📸 Screenshots

Available sample assets in this repository:

- Landing: `images/landing-page.png`
- Logo: `images/logo.svg`
- Main illustration: `images/main.svg`

You can add more page screenshots under `images/` and list them here for client/demo docs.

---

**Developed by Abusaleh Alam Khan (Seen Game Pro Project)**  
