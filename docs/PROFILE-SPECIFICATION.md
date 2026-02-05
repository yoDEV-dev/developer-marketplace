# 🛒 yoDEV Developer Marketplace — Profile Specification

> **Purpose:** Define all data points, functions, and UI elements for independent developer profiles in the yoDEV.dev Developer Marketplace.
> **Status:** Draft — Design Phase
> **Last Updated:** February 5, 2026

---

## 1. Identity & Overview

| Field | Type | Required | Notes |
|---|---|---|---|
| Display Name | Text (60 chars) | ✅ | Professional name shown publicly |
| Profile Photo | Image upload | ✅ | Min 200×200px, cropped to circle |
| Banner Image | Image upload | ❌ | Optional header image, 1200×300px |
| Professional Headline | Text (120 chars) | ✅ | One-liner, e.g. "Full-Stack Dev · React & Node.js" |
| Bio / About Me | Rich text (2000 chars) | ✅ | Supports markdown formatting |
| Country | Dropdown | ✅ | Pre-populated LatAm list + international |
| City | Text | ❌ | Free text |
| Timezone | Auto-detected + override | ✅ | Critical for async work coordination |
| Languages Spoken | Multi-select tags | ✅ | Spanish, English, Portuguese, etc. + proficiency level |
| Years of Experience | Dropdown (ranges) | ✅ | 0–1, 1–3, 3–5, 5–10, 10–15, 15+ |
| Availability Status | Select one | ✅ | Available Now · Limited Availability · Booked · Not Taking Work |
| Verification Badges | System-generated | Auto | GitHub linked, LinkedIn verified, yoDEV Active Member |

---

## 2. Skills & Expertise

| Field | Type | Required | Notes |
|---|---|---|---|
| Primary Tech Stack | Multi-select tags (max 10) | ✅ | From master tag list (React, Python, AWS, etc.) |
| Secondary Technologies | Multi-select tags (max 15) | ❌ | Familiar / learning |
| Specialization Areas | Multi-select | ✅ | See list below |
| Industry Experience | Multi-select | ❌ | Fintech, Healthcare, EdTech, Retail, etc. |
| Certifications | Repeatable text + image | ❌ | Name, issuer, year, optional badge image |
| Skill Endorsements | System feature | Auto | Other yoDEV members can endorse skills |

### Specialization Options
- Web Application Development
- Mobile App Development (iOS / Android / Cross-platform)
- API Development & Integration
- Database Design & Architecture
- DevOps & CI/CD
- Cloud Infrastructure (AWS / GCP / Azure)
- UI/UX Design & Implementation
- E-commerce Solutions
- AI / ML Implementation
- Cybersecurity
- Legacy System Modernization
- Blockchain / Web3
- Data Engineering & Analytics
- Technical Consulting
- Other (free text)

---

## 3. Project Types Accepted

> Multi-select checklist — developer chooses which types of work they accept.

- [ ] New Application Build (Greenfield)
- [ ] MVP / Prototype Development
- [ ] Feature Development (on existing codebase)
- [ ] API Development & Integration
- [ ] Database Design & Migration
- [ ] DevOps & Infrastructure Setup
- [ ] Code Review & Auditing
- [ ] Bug Fixing & Debugging
- [ ] Performance Optimization
- [ ] UI/UX Implementation
- [ ] E-commerce Setup & Customization
- [ ] AI/ML Model Integration
- [ ] Mobile App Development
- [ ] Maintenance & Support Contracts
- [ ] Technical Consulting / Advisory
- [ ] Team Augmentation / Staff Extension
- [ ] Custom (free text)

---

## 4. Fee Structure & Pricing

| Field | Type | Required | Notes |
|---|---|---|---|
| Pricing Model | Multi-select | ✅ | See options below |
| Hourly Rate Range | Min / Max number inputs | Conditional | Required if "Hourly" selected |
| Typical Project Budget | Select range | ❌ | Helps clients filter |
| Display Currency | Dropdown | ✅ | USD (default), CLP, ARS, COP, PEN, MXN, BRL, EUR |
| Payment Methods | Multi-select | ❌ | Bank Transfer, PayPal, Wise, Crypto, Payoneer |
| Free Initial Consultation | Toggle | ❌ | Default: Off |
| Open to Negotiation | Toggle | ❌ | Default: On |

### Pricing Model Options
- **Hourly Rate** — billed by the hour
- **Project-Based (Fixed Price)** — flat fee per project
- **Monthly Retainer** — ongoing monthly arrangement
- **Milestone-Based** — payment tied to deliverables
- **Get a Quote** — pricing discussed per engagement
- **Equity / Revenue Share** — open to alternative compensation

### Project Budget Ranges
- Under $500
- $500 – $2,000
- $2,000 – $5,000
- $5,000 – $15,000
- $15,000 – $50,000
- $50,000+
- Flexible / Discuss

---

## 5. Portfolio / Past Projects

> Repeatable card component — developer can add multiple projects.

### Per Project Card:

| Field | Type | Required | Notes |
|---|---|---|---|
| Project Title | Text (100 chars) | ✅ | |
| Client Name | Text | ❌ | Can select "Confidential Client" |
| Thumbnail / Screenshots | Image upload (up to 5) | ✅ | Gallery view on card |
| Description | Rich text (1500 chars) | ✅ | Challenge → Solution → Outcome format encouraged |
| Tech Stack Used | Multi-select tags | ✅ | From master tag list |
| Project Type | Select | ✅ | Links to Section 3 options |
| Duration | Text | ❌ | e.g. "3 months", "Ongoing" |
| Completion Year | Dropdown | ❌ | |
| Live Project URL | URL | ❌ | |
| GitHub Repo | URL | ❌ | Can auto-pull from yoDEV GitHub integration |
| Client Testimonial | Text (500 chars) | ❌ | Quote from client |
| Featured | Toggle | ❌ | Pin up to 3 projects to top of profile |

---

## 6. Reviews & Reputation

### Client Reviews (per engagement):

| Field | Type | Notes |
|---|---|---|
| Overall Rating | 1–5 stars | Required from reviewer |
| Communication | 1–5 stars | |
| Code Quality | 1–5 stars | |
| Timeliness | 1–5 stars | |
| Value for Money | 1–5 stars | |
| Written Review | Text (1000 chars) | Optional |
| Client Name | Text | Can be anonymous |
| Project Reference | Link to portfolio card | Optional |

### Platform Reputation Metrics (system-generated):

| Metric | Source | Visibility |
|---|---|---|
| Average Rating | Aggregated from reviews | Public |
| Total Reviews Count | System count | Public |
| Repeat Client % | System calculated | Public |
| Average Response Time | Measured from inquiries | Public |
| Profile Completion Score | System calculated | Developer only |
| yoDEV Community Karma | Platform activity score | Public |
| Completion Rate | Projects completed vs abandoned | Public |
| Member Since | Registration date | Public |
| Dispute History | Admin records | Admin only |

---

## 7. Work Preferences

| Field | Type | Required | Notes |
|---|---|---|---|
| Work Arrangement | Multi-select | ✅ | Remote Only · Hybrid · On-site Available |
| Time Overlap Requirement | Text | ❌ | e.g. "Min 4hrs overlap with EST" |
| Preferred Project Duration | Multi-select | ❌ | Short (<1 month) · Medium (1–6 months) · Long (6+ months) · Any |
| Team Preference | Multi-select | ❌ | Solo · Small Team (2–5) · Larger Teams · Any |
| Open to Subcontracting | Toggle | ❌ | Willing to work under another dev/agency |
| Open to Being Subcontracted | Toggle | ❌ | Willing to bring in other devs |
| NDA Willingness | Toggle | ❌ | Default: Yes |
| Contract Openness | Multi-select | ❌ | Freelance Only · Contract-to-Hire · Full-Time Open |

---

## 8. LatAm-Specific Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Tax/Invoice Type | Select | ❌ | Boleta de Honorarios (CL), Monotributo (AR), RUT (CO), RFC (MX), RUC (PE), MEI/CNPJ (BR), Other |
| Can Invoice in USD | Toggle | ❌ | Important for international clients |
| Bilingual Profile | Toggle | ❌ | Enables ES + EN profile versions |
| Regional Experience | Multi-select | ❌ | Countries where dev has client experience |

---

## 9. Contact & Actions (UI Elements)

### Primary CTAs
- 🟢 **"Hire Me" / "Request a Quote"** — opens inquiry form
- 💬 **"Message"** — integrates with yoDEV chat system
- 📅 **"Book a Call"** — links to external calendar (Calendly, Cal.com, etc.)

### Secondary Actions
- ⭐ Save / Bookmark Developer
- 🔗 Share Profile (generates public link)
- 📄 Download CV (optional PDF upload)
- 🚩 Report Profile

### Social Links
- GitHub profile
- LinkedIn profile
- Personal website / portfolio
- Stack Overflow
- Twitter / X
- Other (custom label + URL)

---

## 10. Search & Discovery (Directory Features)

### Filters Available to Clients:
- Skills / Tech stack
- Specialization area
- Country / Region
- Availability status
- Pricing model
- Budget range / Hourly rate range
- Minimum rating
- Years of experience
- Language
- Project type
- Verified profiles only
- Has portfolio items

### Sort Options:
- Relevance (AI-matched)
- Rating (highest first)
- Rate (low to high / high to low)
- Response time (fastest first)
- Recently active
- Newest profiles

### AI-Powered Features (Future):
- Project brief → developer matching
- "Developers like this" recommendations
- Smart search with natural language queries

---

## 11. Platform Functions & Workflows

### Inquiry / Hiring Flow:
1. Client browses directory or posts a project brief
2. Client clicks "Hire Me" or "Request a Quote" on a profile
3. Inquiry form: project description, budget range, timeline, project type
4. Developer receives notification (email + in-platform)
5. Developer responds / schedules call / sends proposal
6. Both parties agree on terms (off-platform or future escrow)
7. On completion, client is prompted to leave a review

### Developer Dashboard:
- Profile views (daily/weekly/monthly)
- Inquiry count & conversion rate
- Search appearances
- Profile completion checklist
- Earnings tracker (self-reported, future: integrated)
- Active engagements list

### Admin / Moderation:
- Profile approval queue (optional)
- Flagged profiles review
- Dispute resolution interface
- Featured developer selection (editorial picks)
- Verification badge management

---

## Appendix: Design Notes

### Profile Card (Directory View):
A compact card showing: photo, name, headline, top 3 skills (tags), availability badge, rating, hourly rate (if shown), country flag, "View Profile" button.

### Full Profile View:
Single-page scrollable layout with anchored navigation:
Overview → Skills → Portfolio → Reviews → Pricing → Preferences → Contact

### Mobile Considerations:
- Collapsible sections
- Swipeable portfolio gallery
- Sticky "Hire Me" CTA button
- Bottom sheet for inquiry form
