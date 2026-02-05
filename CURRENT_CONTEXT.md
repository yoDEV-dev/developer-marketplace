# yoDEV Developer Marketplace — Current Context

> Last updated: 2026-02-05 | All phases complete (1-8)

## Project Overview

Professional marketplace connecting Latin American developers with global clients. Built as a companion to the main yoDEV Discourse community site.

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.1.6 + React 19 | App Router, `[locale]` dynamic routing |
| Styling | Tailwind CSS v4 | `@theme inline` custom design tokens |
| i18n | next-intl (en/es/pt) | `localePrefix: "as-needed"` |
| Database | PostgreSQL (raw SQL via `pg`) | Schema: `database/schema.sql` (780 lines, 25+ tables) |
| Auth | Custom OIDC bridge → Discourse SSO | `arctic` v3 OIDC client + `jose` encrypted cookies |
| Sessions | Encrypted JWE cookie | `yodev_session`, A256GCM, 7-day TTL |
| Validation | Zod | All Server Action inputs |
| Mutations | Server Actions | Profile edits, future: time entries, inquiries |
| Queries | API Routes + Server Components | Search endpoints use URL params; pages call repos |
| File Storage | Cloudflare R2 (planned) | S3-compatible, for photos/portfolios/CVs |
| Deploy | Railway | PostgreSQL + Next.js |

## Dependencies (added beyond scaffolding)

`pg`, `@types/pg`, `arctic`, `jose`, `zod`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`

## Environment Variables

```
DATABASE_URL          # PostgreSQL connection string
SESSION_SECRET        # 32+ char secret for JWE encryption
OIDC_ISSUER           # discourse-oidc-bridge URL (e.g. https://auth.yodev.dev)
OIDC_CLIENT_ID        # OIDC client ID
OIDC_CLIENT_SECRET    # OIDC client secret
OIDC_REDIRECT_URI     # e.g. https://marketplace.yodev.dev/api/auth/callback

# Phase 4 (not yet implemented):
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL
```

## File Structure (backend files created so far)

```
frontend/src/
  lib/
    db.ts              # pg Pool + query/queryOne helpers
    auth.ts            # arctic OIDC client (Authorization Code + PKCE)
    session.ts         # Encrypted cookie sessions (jose JWE)
    validation.ts      # Zod schemas for profile, inquiries, reviews
    r2.ts              # S3 client for Cloudflare R2
    upload.ts          # Image resize (sharp) + upload helpers
  repositories/
    developers.ts      # searchDevelopers(filters), getDeveloperById(id)
    lookups.ts         # getTechTags, getSpecializations, getCountries, etc.
    profile.ts         # getEditableProfile, getProfileSkills, etc.
    inquiries.ts       # createInquiry, getInquiriesForDeveloper, updateInquiryStatus
    reviews.ts         # createReview, getReviewsForDeveloper, getReviewSummary
    time-entries.ts    # logTimeEntry, startTimer, stopTimer, getActiveTimer, weeklySummary
    analytics.ts       # getDashboardStats, recordProfileView, getWeeklyViews
    messages.ts        # getConversationsForUser, getMessages, sendMessage, markConversationRead, getOrCreateConversation
    bookmarks.ts       # saveDeveloper, unsaveDeveloper, toggleBookmark, getBookmarkedIds, getSavedDevelopers
  actions/
    profile.ts         # 7 Server Actions: updateBasicInfo, updatePricing, etc.
    inquiries.ts       # submitInquiry, changeInquiryStatus
    reviews.ts         # submitReview
    time-entries.ts    # submitTimeEntry, startTimer, stopTimer
    messages.ts        # sendMessage, markRead
    bookmarks.ts       # toggleBookmark
  app/api/
    auth/login/        # Initiates OIDC flow (PKCE)
    auth/callback/     # Exchanges code → creates session + DB row on first login
    auth/logout/       # Clears session cookie
    auth/me/           # Returns current user JSON
    developers/        # GET search/filter endpoint
    developers/[id]/   # GET single profile
    lookups/           # GET reference data (1hr cache)
    upload/            # POST file upload (profile photos, banners, portfolios, CVs)
```

## UI Components (frontend — all complete with mock data)

```
frontend/src/
  components/
    layout/
      Sidebar.tsx        # Desktop nav + auth state (user info or Sign In)
      TopBar.tsx          # Mobile top bar
      BottomNav.tsx       # Mobile bottom navigation
    developers/
      DeveloperCard.tsx   # Card in search results
      DevelopersContent.tsx # Search results grid
      FilterSidebar.tsx   # URL-param-driven filters (tech, rate, availability...)
      MobileFilterChips.tsx
    profile/
      ProfileHeader.tsx   # Developer public profile header
      ProfileTabs.tsx     # About/Portfolio/Reviews tabs
      AboutSection.tsx, SkillsSection.tsx, PortfolioSection.tsx,
      PricingSection.tsx, ReviewsSection.tsx, ContactSidebar.tsx
      edit/
        BasicInfoForm.tsx        # Name, headline, bio, country, timezone, etc.
        SkillsForm.tsx           # Interactive skill selector (search/add/remove)
        PricingForm.tsx          # Currency, rates, models, payment methods
        WorkPreferencesForm.tsx  # Arrangements, duration, team, contract types
        SocialLinksForm.tsx      # Calendar, website, GitHub, LinkedIn, etc.
        PublishToggle.tsx        # Published/Draft toggle button
    inquiries/
      InquiryForm.tsx          # Modal form for "Request a Quote"
      InquiryInbox.tsx         # Developer's inquiry inbox with status actions
    reviews/
      ReviewForm.tsx           # Modal form for submitting reviews (star ratings)
    dashboard/           # Dashboard page components (mock data)
    messages/            # Messages (ConversationList, ChatWindow, MessagesContent wrapper)
    projects/            # Projects page components (mock data)
    LanguageSelector.tsx # en/es/pt language switcher
```

## Pages

```
/[locale]                          # Landing/home
/[locale]/developers               # Developer search directory
/[locale]/developers/[id]          # Developer public profile
/[locale]/profile/edit             # Profile editing (requires auth)
/[locale]/inquiries                # Developer inquiry inbox
/[locale]/dashboard                # Developer dashboard
/[locale]/messages                 # Messages inbox
/[locale]/projects                 # Projects list
```

## Key Patterns

1. **Mock data fallback**: Pages check `process.env.DATABASE_URL`, try DB queries, catch falls back to hardcoded mock data. This lets the frontend work without a database during development.

2. **Snake_case → camelCase mapping**: DB uses snake_case (`display_name`, `profile_photo_url`), components use camelCase (`name`, `photoUrl`). Mapping happens in page-level server components.

3. **FilterSidebar URL params**: All filters update URL search params via `useSearchParams` + `router.push("?params")`. Server component reads params and passes to `searchDevelopers()`.

4. **Server Actions with useActionState**: Profile edit forms use React 19's `useActionState` hook with Server Actions that return `{ success: boolean; error?: string }`.

5. **Transactional writes**: `updatePricing` and `updateSkills` use `pool.connect()` + BEGIN/COMMIT/ROLLBACK for multi-table operations.

6. **Session auth**: `requireSession()` redirects to login if no session. Used in profile edit page and all mutation Server Actions.

## Auth Flow

1. User clicks "Sign In" → `/api/auth/login`
2. Login route generates PKCE verifier+challenge, stores in short-lived cookies
3. Redirects to OIDC bridge `/authorize` endpoint
4. Bridge redirects to Discourse SSO, user authenticates
5. Discourse returns to bridge, bridge issues authorization code
6. Bridge redirects to `/api/auth/callback` with code
7. Callback exchanges code for tokens, decodes ID token (RS256 JWT)
8. First login: creates `developer_profiles` row from OIDC claims
9. Creates encrypted session cookie, redirects to `/en/dashboard`

**OIDC Bridge**: Express.js app at https://github.com/yoDEV-dev/discourse-oidc-bridge
- Endpoints: `/.well-known/openid-configuration`, `/authorize`, `/token`, `/userinfo`
- Claims: sub, name, email, preferred_username, picture

## Implementation Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | DONE | DB connection, auth (OIDC + session), nav auth state |
| 2 | DONE | Developer search repo, lookups, API routes, FilterSidebar wired to URL params |
| 3 | DONE | Profile editing (Zod validation, 7 Server Actions, 5 form components) |
| 4 | DONE | File uploads to Cloudflare R2 (lib/r2.ts, lib/upload.ts, api/upload, PhotoUpload component) |
| 5 | DONE | Inquiries & Reviews (repos, actions, InquiryForm modal, InquiryInbox, ReviewForm, /inquiries page) |
| 6 | DONE | Time Tracking & Dashboard (repos, actions, live timer, manual entry, real stats with mock fallback) |
| 7 | DONE | Messages (conversations, messages tables, repos, actions, polling refresh, conversation selection via URL params) |
| 8 | DONE | Polish (bookmarks repo+action, unread badges in nav, loading/error/not-found boundaries, OG metadata on profiles) |

## Known Issues / Notes

- `arctic` v3: `decodeIdToken` is exported from `"arctic"` (not `"arctic/oidc"`)
- `useTransition` callbacks must return void — wrap async Server Action calls in `async () => { await action(); }`
- Build passes cleanly with `npm run build`
- No database connected yet in dev — all pages use mock data fallback
