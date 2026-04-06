# Seen Game Pro Project Context

Last updated: 2026-04-07

## Repositories
- Frontend: D:\1_Technical Stack\seen-game-pro\seen-game-pro-frontend
- Backend: D:\1_Technical Stack\seen-game-pro\seen-game-pro-backend

## High-Level Product Direction
The project is being aligned to a client-provided Figma/design-system direction for the full Seen Game Pro product.

Target product areas include:
- Landing / marketing pages
- Auth screens
- Dashboard / app shell
- Leaderboards
- Friend rankings
- 1v1 challenges
- Tournaments
- Notifications
- Joker / quiz arena flows
- VIP / upgrade flows
- Language switching UI

Important design principle:
- We should not style every screen manually in isolation.
- Best approach is token-first design implementation: global tokens -> shared UI primitives -> page shells -> screen-specific composition.

## Design Documentation Added
A new frontend design requirements file was created:
- `design.md`

Path:
- `D:\1_Technical Stack\seen-game-pro\seen-game-pro-frontend\design.md`

What it contains:
- color tokens
- gradient system
- typography scale
- spacing system
- radius system
- shadow/elevation system
- reusable component requirements
- layout patterns for desktop/mobile/dark quiz arena
- motion/interaction rules
- responsive rules
- implementation order recommendation

## Current Auth Architecture
- Existing auth architecture is backend-issued JWT access token + refresh token.
- Frontend stores `accessToken`, `refreshToken`, and `user` in cookies.
- Email/password auth remains active.
- Social login was implemented to fit the same backend JWT flow instead of using Firebase/Auth.js sessions.

## Social Auth Implementation Summary

### Backend
Implemented production-style provider-token-to-backend-JWT bridge.

Added / updated:
- `POST /api/auth/social`
- social auth controller logic
- provider verification service
- schema guard for user table social columns

Backend behavior:
- verifies Google access token
- verifies Facebook access token
- finds user by provider id first
- if not found, tries email match
- if still not found, creates new local user record
- issues normal backend access token + refresh token
- keeps existing email/password auth intact

Database/schema support added:
- `google_id`
- `facebook_id`
- `avatar_url`
- unique indexes for provider ids

Facebook-specific backend improvement:
- login can still work even if Meta does not return email
- backend generates provider-scoped fallback email if necessary

### Frontend
Implemented browser SDK/token-based social auth wiring.

Added / updated:
- `lib/socialAuth.js`
- social thunk in `store/slices/authSlice.js`
- social button wiring in login/register pages
- loading/disabled support in `components/auth/SocialAuthButton.js`
- frontend env template updates
- stronger SDK loading strategy
- COOP header adjustment to reduce popup warnings

## Credentials / Env Setup Context

### Backend `.env`
Required variables:
- `GOOGLE_CLIENT_ID`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`

### Frontend `.env.local`
Required variables:
- `NEXT_PUBLIC_API_URL=/backend-api`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_FACEBOOK_APP_ID`

Important notes:
- Google credentials should come from Google Cloud Console OAuth web client
- Facebook credentials should come from Meta for Developers app dashboard
- `FACEBOOK_APP_SECRET` must never go to frontend
- Firebase was not used in the final social auth implementation

## Provider / Auth Debugging History
These issues were already investigated during this thread:

### Google
- initially Google SDK load was failing in browser
- frontend SDK load flow was hardened
- COOP popup warnings were reduced via Next config
- warning `Cross-Origin-Opener-Policy policy would block the window.closed call` was identified as mostly browser/dev warning noise, not the main auth blocker

### Facebook
- frontend `email` scope caused app/setup blocking issues
- frontend was changed to request `public_profile` only
- backend was changed to tolerate missing email

### Common blocker found earlier
If backend says `Google login is not configured on the server`, usually that means:
- backend `.env` values were missing earlier, or
- backend dev server needs restart to load new env vars

## Frontend Auth UI / Page Work Done

### Login page
- `app/login/page.js` was fixed after accidental TypeScript syntax appeared in a `.js` file
- file was cleaned back to valid JavaScript
- hydration mismatch in the login visual panel was fixed by removing random-on-render behavior and making animated dots deterministic

### Register page
A lot of iterative visual refactoring happened on the register flow.

Goals from the user:
- closer match to provided Figma/auth screenshots
- better responsive behavior across desktop/laptop/tablet/mobile
- premium left visual panel
- only Google social signup on register page
- proper password/confirm-password eye toggles
- cleaner alignment and width control

Current direction:
- register page uses `RegisterVisualPanel` directly
- `AuthShowcase` was intentionally removed from active usage to avoid duplicate responsibility and drift
- left panel uses relevant icons instead of placeholder letters
- static dotted background texture was removed from the auth visual direction where requested
- shared floating/framer-motion dot treatment is the preferred animated effect
- register form width, left panel width, and card spacing were tuned responsively

Important caveat:
- many register-page refinements happened iteratively and visually; if future work continues there, inspect the latest live file state first before changing layout again

## Register Page / Visual Component History
Files involved over the thread:
- `app/register/page.js`
- `components/auth/RegisterVisualPanel.js`
- `components/auth/AnimatedDotBackground.js`
- `components/auth/AuthShowcase.js` (later removed / retired)

What was attempted / changed over time:
- moved animation into shared background component
- added floating animated dots to register visuals
- aligned register visuals with login-style animated background approach
- refactored register left panel into a dedicated `RegisterVisualPanel`
- removed the need for a separate `AuthShowcase` abstraction
- tuned layout for mobile/tablet/laptop/desktop breakpoints
- added eye toggle to password field as well as confirm-password field
- kept only Google signup button on register page

## Design-System Extraction From Screenshots
The screenshots provided by the user were analyzed and converted into implementation requirements.

Key extracted themes:
- font: `Plus Jakarta Sans`
- tokenized accent and VIP color system
- neutral light app surfaces
- dark-space gradients for landing/quiz areas
- semantic success/error/warning/info colors
- explicit spacing scale
- explicit radius scale
- explicit shadow/elevation scale
- reusable button/input/card/badge/avatar/sidebar/progress patterns
- motion guidance for hover, glow, pulse, twinkle, progress fill

## Best Implementation Strategy Going Forward
Recommended build order:
1. move design tokens into `app/globals.css`
2. optionally add a token export file such as `lib/designSystem.js`
3. build reusable `components/ui` primitives first
4. build shared layout shells
5. refactor auth screens to fully use shared primitives/tokens
6. build remaining landing/app/dashboard screens on top of the same system

Reason:
- this will prevent style drift
- this will make future pages faster to build
- this will keep the final product much closer to the client design system

## Important Files Changed In This Overall Session

### Backend
- `src/controllers/auth.controller.js`
- `src/routes/auth.routes.js`
- `src/app.js`
- `src/services/social-auth.service.js`
- `src/services/auth-schema.service.js`
- `.env.example`

### Frontend
- `app/login/page.js`
- `app/register/page.js`
- `app/layout.js`
- `next.config.js`
- `store/slices/authSlice.js`
- `lib/socialAuth.js`
- `components/auth/SocialAuthButton.js`
- `components/auth/LoginVisualPanel.js`
- `components/auth/RegisterVisualPanel.js`
- `components/auth/AnimatedDotBackground.js`
- `.env.local`
- `.env.local.example`
- `design.md`
- `context.md`

## Verification Already Done
- frontend `npm run build` passed multiple times after auth/social and auth-page UI changes
- backend changed JS files passed syntax verification earlier

## Current Practical Reality
- social auth code path is implemented, but real live success still depends on correct provider console setup and env-loaded dev servers
- register page has gone through multiple rounds of visual tuning; treat current file state as the source of truth and refine carefully
- `design.md` should now be treated as the design requirement base before larger UI/system refactors

## Recommended Next Work
Most professional next step:
1. extract tokens from `design.md` into global CSS variables
2. create shared `components/ui` primitives
3. then refactor auth pages cleanly using those tokens/components
4. after that, build landing/dashboard/etc using the same system

## Handoff Prompt For A New Thread / New Account
Use this if continuing elsewhere:

Frontend path:
`D:\1_Technical Stack\seen-game-pro\seen-game-pro-frontend`

Backend path:
`D:\1_Technical Stack\seen-game-pro\seen-game-pro-backend`

Context:
- Frontend uses Next.js App Router + Redux Toolkit
- Backend uses JWT access/refresh token auth
- Email/password auth already exists
- Social auth was implemented with backend provider-token verification and JWT issuance
- Backend has `/api/auth/social` and social provider schema support
- Frontend has real Google/Facebook social auth wiring in code
- Register page and auth visuals were iteratively refactored multiple times
- `design.md` now contains the extracted Seen Game Pro design-system requirements from the client screenshots
- Next best step is to implement global design tokens + shared UI primitives based on `design.md`
- Inspect current frontend files before editing because auth/register visuals changed across several iterations
