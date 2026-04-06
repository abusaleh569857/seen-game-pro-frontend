# Seen Game Pro Design System And Implementation Requirements

Last updated: 2026-04-07

## Purpose
This document captures the client-provided design system screenshots and turns them into an implementation-ready specification for the frontend codebase.

This should be treated as the source-of-truth design brief while building the Seen Game Pro website and app screens.

## Recommended Approach
Do not hardcode styles screen-by-screen.

Best professional approach:
1. Create global design tokens first.
2. Build a small reusable component system from those tokens.
3. Build page layouts from reusable primitives instead of custom one-off CSS.
4. Keep one shared visual language across landing, auth, dashboard, quiz, profile, leaderboard, and VIP flows.

### What should be global
Create and maintain these globally in the frontend:
- Global CSS variables for colors, gradients, spacing, radius, borders, and shadows
- Shared typography scale and font-weight rules
- Reusable UI primitives: buttons, inputs, cards, badges, pills, tabs, avatars, progress bars, sidebar items, notification rows
- Shared motion tokens for hover, panel entrance, glow, twinkle, and progress transitions
- Shared shell/layout rules for desktop, tablet, and mobile

### Suggested architecture
Recommended structure for the frontend:
- `app/globals.css`
  - global CSS variables and base typography
- `lib/design-tokens.js` or `lib/designSystem.js`
  - optional JS export for token reuse in components
- `components/ui/`
  - `Button.js`
  - `Input.js`
  - `Card.js`
  - `Badge.js`
  - `LanguagePill.js`
  - `Avatar.js`
  - `ProgressBar.js`
  - `Toggle.js`
  - `SidebarItem.js`
- `components/layout/`
  - `AppShell.js`
  - `PageSection.js`
  - `SurfacePanel.js`
- `components/auth/`
  - auth-specific panels built on top of shared UI primitives
- `docs/design.md`
  - optional future move if documentation grows

For the current project, creating a root-level frontend file named `design.md` is a good start for requirement tracking.

## Core Brand Direction
The product visual identity is:
- premium but playful
- modern gaming UI without looking noisy
- clean app surfaces for the main product screens
- dark-space themed quiz and landing moments
- accent-led gradients for calls to action and VIP states
- strong readability and structured hierarchy

The system mixes:
- light neutral app surfaces for forms, panels, dashboards
- dark purple/blue gradients for quiz, landing, and hero areas
- bright semantic feedback colors
- subtle glow, layered shadow, and animated dots/stars for motion depth

## Font System
Primary typeface:
- `Plus Jakarta Sans`, sans-serif

### Font usage rules
- Use this as the main font across all screens and languages
- Desktop minimum body size: `14px`
- Mobile minimum body size: `12px`
- Supported weights seen in the design system:
  - `400` Regular
  - `500` Medium
  - `600` SemiBold
  - `700` Bold
  - `800` ExtraBold

## Color Tokens
These values were readable from the provided screenshots and should become CSS variables.

### Brand palette
- `--accent-dark: #3B1F8A`
- `--accent: #6047EA`
- `--accent-2: #4B7BEE`
- `--accent-bg: rgba(96,71,234,0.08)`
- `--accent-border: rgba(96,71,234,0.22)`
- `--accent-light: #A78BFA`
- `--accent-muted: #CAB5F0`

### VIP palette
- `--vip: #7C3AED`
- `--vip-2: #C026D3`
- `--vip-bg: #F5F3FF`

### Semantic palette
- `--green: #16A34A`
- `--green-bg: #DCFCE7`
- `--red: #DC2626`
- `--red-bg: #FEE2E2`
- `--amber: #D97706`
- `--amber-bg: #FCD34D`
- `--teal: #0D9488`
- `--teal-bg: #CCFBF1`

### Light surfaces
- `--bg: #F0F2F8`
- `--surface: #FFFFFF`
- `--surface-2: #F8F9FB`
- `--surface-3: #F1F3F7`
- `--border: #E2E8F0`
- `--border-2: #F1F5F9`

### Dark surfaces for quiz and landing
- `--dark-1: #08081A`
- `--dark-2: #0E0830`
- `--dark-3: #180A50`
- `--dark-4: #1A0A40`
- `--card-dark: #070426`

### Text colors
Important design note from screenshot:
- Use `#0F172A` as primary text
- Use `#555C68` for both secondary and muted text
- Avoid introducing random extra muted grays unless necessary

Tokens:
- `--text-1: #0F172A`
- `--text-2: #555C68`
- `--text-3: #555C68`
- `--text-inverse: #FFFFFF`

## Gradient System
Use named gradients instead of random per-screen gradients.

### Required gradients
- `--gradient-brand: linear-gradient(135deg, #6047EA, #4B7BEE)`
- `--gradient-dark-space: linear-gradient(145deg, #08081A, #1B0A50)`
- `--gradient-banner: linear-gradient(135deg, #3B1F8A, #6047EA, #4B7BEE)`
- `--gradient-vip: linear-gradient(135deg, #7C3AED, #C026D3)`
- `--gradient-qeem: linear-gradient(135deg, #D97706, #FCD34D)`
- `--gradient-hero-accent: linear-gradient(135deg, #A78BFA, #60A5FA, #34D399)`

## Typography Scale
The screenshots define a clear content hierarchy.

### Display / Hero
- `72px`
- weight `800`
- tracking `-2px`
- use for landing hero only

### Heading 1
- `34px`
- weight `800`
- tracking about `-0.6px`
- use for major page titles and hero cards

### Heading 2
- `26px`
- weight `800`
- tracking about `-0.5px`
- use for section titles

### Heading 3
- `22px`
- weight `800`
- tracking about `-0.3px`
- use for banner titles and large cards

### Heading 4
- `18px`
- weight `800`
- tracking `-0.2px`
- use for panel titles and section subtitles

### Body Large
- `16px`
- weight `500`
- line-height `1.6`
- use for subtext and descriptions

### Body Base
- `15px`
- weight `500`
- line-height `1.5`
- use as the default app body size

### Label / UI
- `13px`
- weight `700`
- use for buttons, pills, nav items, badges

### Caption / Eyebrow
- `12px`
- weight `700`
- uppercase / spaced where needed
- use for section labels, timestamps, small metadata

## Spatial System
The design system clearly uses a spacing scale. Use tokenized spacing only.

### Spacing tokens
- `--space-1: 4px`
- `--space-2: 8px`
- `--space-3: 12px`
- `--space-4: 16px`
- `--space-5: 20px`
- `--space-6: 24px`
- `--space-7: 28px`
- `--space-8: 32px`
- `--space-12: 48px`

### Spacing usage intent
- `4px`: micro gaps, tiny dots, icon nudges
- `8px`: tight gaps, inline controls
- `12px`: chips, labels, row gaps
- `16px`: cards, list items
- `20px`: section spacing inside cards
- `24px`: standard content padding
- `28px`: hero/internal large padding
- `32px`: modal padding
- `48px`: landing section padding

## Border Radius System
Use consistent radius tokens.

### Radius tokens
- `--r-xs: 6px`
- `--r-sm: 8px`
- `--r-md: 12px`
- `--r-lg: 16px`
- `--r-xl: 20px`
- `--r-2xl: 24px`
- `--r-pill: 9999px`
- `--r-circle: 50%`

### Intended usage
- `6px`: tiny badges
- `8px`: compact sidebar items
- `12px`: inputs and default buttons
- `16px`: most cards
- `20px`: hero cards, larger banners
- `24px`: modals and large panels
- `pill`: language chips, counters, status chips

## Shadow / Elevation System
The screenshots define five practical shadow levels.

### Shadows
- `--sh-none: none`
- `--sh-sm: 0 1px 3px rgba(15,23,42,0.05), 0 2px 10px rgba(15,23,42,0.06)`
- `--sh-md: 0 2px 6px rgba(15,23,42,0.05), 0 8px 28px rgba(15,23,42,0.08)`
- `--sh-lg: 0 4px 14px rgba(15,23,42,0.07), 0 16px 48px rgba(15,23,42,0.10)`
- `--sh-btn: 0 4px 14px rgba(96,71,234,0.38)`
- `--sh-hero: 0 8px 32px rgba(96,71,234,0.42)`

### Usage
- `sm`: cards, panel rows
- `md`: payment cards, modals, promoted cards
- `lg`: full-screen overlays and hero containers
- `btn`: primary CTA buttons
- `hero`: gradient hero banners and accent-heavy cards

## Component Requirements
Build these as reusable components before building many screens.

### Buttons
Required button variants:
- Primary gradient CTA
- Secondary white surface button
- Ghost dark button for dark panels
- Status CTA variants: decline, accept, VIP upgrade
- Icon-only buttons

Button rules:
- Default radius: `12px`
- Label weight: `700` or `800`
- Primary CTA should use brand gradient and button shadow
- Hover should lift slightly and keep strong contrast

### Badges and chips
Required variants:
- Tinted chips
- Solid chips
- Language pills
- Status chips for challenge, success, error, pending, secure, VIP
- Count chips like unread/live/new/popular

### Inputs
Required states:
- default
- focus
- error
- valid
- disabled if needed later

Input rules:
- Desktop minimum input text `15px`
- Mobile minimum input text `14px`
- Border `1.5px solid var(--border)`
- Focus ring should use accent border and a subtle shadow/glow
- Support left icons and right utility icons like eye toggle

### Avatars
Required sizes shown:
- XS `28px`
- SM `36px`
- MD `44px`
- LG `56px`
- XL `72px`

### Cards
Required reusable cards:
- `SurfaceCardSm`
- `SurfaceCardMd`
- `SurfaceCardLg`
- Stat cards
- Rank cards
- Notification cards
- Joker cards
- Payment or feature promo cards

### Sidebar items
Need reusable sidebar row with:
- icon
- label
- optional badge/chip
- active state
- hover state

### Progress bars and toggles
Need:
- accent progress
- gold progress
- green progress
- toggle switch with on/off labels

## Domain-Specific Product UI Requirements
From the screenshots, the product includes these main areas and should keep one unified system across them.

### Product modules implied by the design system
- Landing / marketing pages
- Auth screens
- Dashboard and app shell
- Leaderboards
- Friend rankings
- Challenge / 1v1 flows
- Tournaments
- Notifications center
- Joker inventory / quiz arena dock
- VIP hub / upgrades
- Language switcher

## Layout Patterns
The screenshots define recurring shells.

### Desktop shell
- App width target: around `1440px` canvas
- Sidebar: `260px` sticky
- Topbar: `60px` sticky
- Main content padding: `24px` horizontal and vertical rhythm
- Content grid pattern often uses `2-column` or `3-column` splits

### Mobile shell
- Width base: `360px`
- Topbar: around `54px` sticky
- Bottom nav or safe area space when needed
- Content padding: `24px` horizontal on primary screens
- Mobile body minimum font around `12px` to `14px`

### Dark quiz arena pattern
- Background uses dark-space gradient
- Decorative radial glow and pseudo-elements are allowed
- Star field / floating particles should be subtle, not noisy
- Bottom joker dock uses glassy/dark elevated styling
- Timer and answer areas should feel game-like but still readable

## Motion And Interaction Requirements
The screenshots include specific interaction guidance.

### Transition rules
- Standard transition: around `150ms`
- Button hover: slight translateY lift around `-2px`
- Category cards can use spring-like interaction
- Joker cards can scale slightly on hover
- Modals can use scale/opacity entrance
- Drawers can use translateX + fade

### Animation rules
- Live pulse: scale `1 -> 0.7`, opacity `1 -> 0.3`, looping softly
- Star twinkle: opacity pulse with staggered timing
- Timer ring: SVG stroke animation if used
- Progress bars: width transition around `.6s ease`
- Countdown: JS interval stepping can be used if needed
- Backdrop blur for overlays/modals should stay around `10px` to `20px`

## Register / Auth-Specific Guidance
Based on the recent auth design work and screenshots, auth pages should follow these rules:
- Register page left visual panel should use the shared premium purple space look
- Keep floating animated dots/stars subtle and deterministic enough to avoid hydration mismatch
- Use relevant icons, not placeholder letters
- Keep only Google sign-up on register if the design calls for it
- Form card should feel clean, premium, and centered with controlled width
- Use language pills matching the design system
- Auth layouts must be responsive and should not rely on brittle one-screen clipping behavior

## Responsive Requirements
The frontend should be designed intentionally for these breakpoints.

### Mobile
- `320px - 639px`
- Single-column layout
- Compact spacing
- Reduced card padding
- Mobile hero/promo sections may collapse above the form or content

### Tablet
- `640px - 1023px`
- Single-column or soft two-zone layout depending on screen
- Larger spacing than mobile
- Cards can become wider and more breathable

### Laptop
- `1024px - 1439px`
- Two-column app/auth layouts become active
- Left visual panels can be narrower than desktop
- Form widths should remain controlled, not stretched full width

### Desktop
- `1440px+`
- Full app shell and wider feature grids
- Left side visual panels can expand
- More whitespace is allowed without losing hierarchy

### Responsive implementation rules
- Use consistent breakpoints throughout the app
- Scale type, padding, and panel widths by breakpoint
- Avoid arbitrary per-page breakpoint values unless necessary
- Prefer reusable utility classes or token-driven sizes
- Do not force zero-scroll on every device; instead prevent accidental clipping and support graceful overflow where needed

## Implementation Order
Recommended order for building the website from this design system:
1. Add global tokens to `app/globals.css`
2. Set up font and base text styles
3. Create reusable `ui` primitives
4. Create shared app shell and auth shell layouts
5. Refactor auth pages to fully use tokenized components
6. Build landing page sections from the same tokens
7. Build dashboard, leaderboard, notification, tournament, and quiz screens on top of the shared system
8. Only after that add minor per-screen polish

## Non-Negotiable Consistency Rules
- Do not invent new random colors if a token exists
- Do not use different gray text colors when `#555C68` is the approved secondary/muted text
- Do not mix too many radius values outside the defined radius scale
- Do not build each page with one-off gradients
- Do not introduce multiple unrelated typefaces
- Prefer reusable UI primitives over page-specific controls
- Motion should support the interface, not distract from it

## Practical Next Step For This Project
Best next move:
- keep this `design.md` as the requirements/source file
- then extract the tokens into `app/globals.css`
- then create a small `components/ui` library
- then refactor current auth pages to use those shared tokens/components cleanly

That will be much more scalable than styling every page manually from scratch.
