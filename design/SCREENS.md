# yoDEV Marketplace — Design Screens

Design screens exported from Google Stitch. Mobile-first (430px max-width), iOS-style navigation.

## Design System

| Token | Value |
|-------|-------|
| Primary | `#6c47c2` (Purple) |
| Accent Teal | `#14B8A6` |
| Background Light | `#f7f6f8` |
| Background Dark | `#17141e` |
| Font | Inter |
| Border Radius | 1rem default |

## Screen Inventory

### Client-Facing

| # | Screen | File | Description |
|---|--------|------|-------------|
| 01 | Directory Search | `01-directory-search.html` | Developer card grid with search, filters, sort |
| 02 | Full Profile | `02-profile-full.html` | Hero, stats, sticky tabs, bio, expertise |
| 03 | Portfolio & Reviews | `03-portfolio-reviews.html` | Masonry portfolio grid, ratings breakdown |
| 04 | Request Quote | `04-request-quote.html` | Bottom sheet modal with project form |
| 05 | Pricing & Preferences | `05-pricing-preferences.html` | Pricing models, work preferences, project types |
| 06 | Search Filters | `06-search-filters.html` | Full filter sidebar/drawer |

### Messaging

| # | Screen | File | Description |
|---|--------|------|-------------|
| 07 | Messages Inbox | `07-messages-inbox.html` | Conversation list with online indicators |
| 08 | Chat Conversation | `08-chat-conversation.html` | Message bubbles, attachments, input bar |

### Developer Dashboard

| # | Screen | File | Description |
|---|--------|------|-------------|
| 09 | Dashboard Overview | `09-dashboard-overview.html` | Stats, active projects, deadlines, quick actions |
| 10 | Projects List | `10-projects-list.html` | Active/Pending/Completed tabs, project cards |
| 11 | Log Hours | `11-log-hours.html` | Timer, manual entry, weekly summary |

## Components Identified

### Navigation
- Bottom tab bar (Browse, Projects, Messages, Profile)
- Sticky header with back button
- Sticky section tabs

### Cards
- Developer card (directory)
- Project card (dashboard)
- Review card
- Portfolio project card

### Forms
- Search bar with filter button
- Filter chips (horizontal scroll)
- Budget slider
- Timeline chip selector
- Rich text textarea
- Timer display (HH:MM:SS)

### Modals
- Bottom sheet (Request Quote)
- Filter drawer

### Status Indicators
- Availability badge (green/yellow/gray)
- Online status dot
- Rating stars
- Progress bars
