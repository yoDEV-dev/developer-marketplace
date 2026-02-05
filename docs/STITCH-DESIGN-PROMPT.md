# Google Stitch Design Prompt — yoDEV Developer Marketplace

> Copy this prompt into Google Stitch to generate the initial design mockups.

---

## Project: yoDEV Developer Marketplace

Design a professional developer marketplace for Latin American independent developers. Create both the **Developer Profile Card** (directory listing) and **Full Profile Page** views.

### Design Style
- Modern, clean SaaS aesthetic
- Primary brand colors: Deep purple (#6B46C1) with teal accents (#14B8A6)
- White/light gray backgrounds with subtle shadows
- Professional but approachable — not corporate-stiff
- San Francisco / Inter font family feel

---

### 1. DEVELOPER CARD (Directory Grid View)

Compact card (~320px wide) containing:
- **Circular profile photo** (top, 80px diameter)
- **Country flag icon** (small, beside name)
- **Display name** (bold, 18px)
- **Professional headline** (muted text, 14px, max 2 lines)
- **Availability badge** (colored pill: green "Available Now", yellow "Limited", gray "Booked")
- **3-5 skill tags** (small rounded pills, purple tint)
- **Star rating** with review count (e.g., ★ 4.8 (23))
- **Hourly rate range** (e.g., "$45-65/hr" or "Project-based")
- **"View Profile" button** (secondary style)

Show as a responsive grid (3-4 cards per row desktop, 1-2 mobile).

---

### 2. DIRECTORY PAGE (Search & Filter)

- **Header**: Search bar with placeholder "Search developers by skill, name, or keyword..."
- **Filter sidebar** (left, collapsible on mobile):
  - Skills/Tech stack (tag selector)
  - Availability status
  - Country/Region
  - Hourly rate slider (min-max)
  - Years of experience
  - Language
  - Project types accepted
  - "Verified only" toggle
  - "Has portfolio" toggle
  - Clear filters button
- **Sort dropdown** (top right of grid): Relevance, Rating, Rate, Response Time
- **Results count**: "Showing 47 developers"
- **Grid of Developer Cards**
- **Pagination** or infinite scroll indicator

---

### 3. FULL PROFILE PAGE

Single-page scrollable layout with sticky left/top navigation.

**A. Hero Section**
- Banner image area (1200×300, with gradient overlay if no image)
- Large circular profile photo (120px, overlapping banner)
- Display name (large, bold)
- Professional headline
- Location: City, Country with flag icon
- Timezone badge
- Verification badges row (GitHub linked, LinkedIn verified, yoDEV Member)
- Availability status badge (prominent)
- **Primary CTA buttons**: "Request a Quote" (filled) + "Message" (outline) + "Book a Call" (outline)
- Social links icons row (GitHub, LinkedIn, Website, Twitter)

**B. Sticky Section Navigation**
Horizontal tabs or pill nav:
`Overview | Skills | Portfolio | Reviews | Pricing | Preferences`

**C. Overview Section**
- Bio/About Me (rich text area, ~2000 chars displayed)
- Quick stats row: Years Experience | Projects Completed | Response Time | Repeat Clients %
- Languages spoken with proficiency indicators

**D. Skills & Expertise Section**
- **Primary Tech Stack**: Large skill tags (max 10)
- **Secondary Technologies**: Smaller tags (max 15)
- **Specializations**: List with icons (Web Apps, Mobile, DevOps, etc.)
- **Industry Experience**: Horizontal tag list (Fintech, Healthcare, etc.)
- **Certifications**: Card per cert with badge image, name, issuer, year
- **Endorsements count** per skill (from other yoDEV members)

**E. Portfolio Section**
- Grid/masonry of **Project Cards** (user can feature up to 3 pinned)
- Each project card shows:
  - Thumbnail image (with gallery dot indicators)
  - Project title
  - Client name or "Confidential Client"
  - Tech stack tags (3-5)
  - Project type badge
  - Brief description excerpt
  - "View Details" expands to modal or inline expansion with:
    - Full screenshot gallery (swipeable)
    - Full description
    - Duration, Year
    - Live URL button, GitHub repo button
    - Client testimonial quote block

**F. Reviews Section**
- **Summary stats**: Overall rating (large), breakdown bars for Communication, Code Quality, Timeliness, Value
- **Review cards** (chronological):
  - Star rating
  - Written review text
  - Reviewer name (or "Anonymous")
  - Project reference link (optional)
  - Date
- "Load more reviews" if >5

**G. Pricing Section**
- Pricing models accepted (pills: Hourly, Project-Based, Retainer, etc.)
- Hourly rate range display (e.g., "$45 – $65 USD/hr")
- Typical project budget range
- Currency preference
- Payment methods icons
- "Free initial consultation" badge if enabled
- "Open to negotiation" indicator

**H. Work Preferences Section**
- Work arrangement: Remote/Hybrid/On-site icons
- Time overlap requirements
- Preferred project duration
- Team size preference
- Open to subcontracting indicators
- NDA willingness
- Contract openness (Freelance, Contract-to-Hire, Full-Time Open)

**I. Project Types Accepted**
- Visual checklist or icon grid of accepted project types (Greenfield, MVP, Feature Dev, API, DevOps, Bug Fixing, etc.)

**J. Floating/Sticky CTA**
On mobile: sticky bottom bar with "Hire Me" button
On desktop: sticky sidebar or floating card with rate + availability + CTA

---

### 4. INQUIRY MODAL/FORM

When "Request a Quote" clicked:
- Project description textarea
- Project type selector
- Estimated budget range
- Desired timeline
- Attachment upload option
- Submit button

---

### 5. MOBILE CONSIDERATIONS

- Collapsible accordion sections
- Swipeable portfolio gallery
- Bottom sheet for inquiry form
- Sticky "Hire Me" button bar
- Tab navigation becomes horizontal scroll

---

### Additional UI Elements to Include

- **Empty states**: "No portfolio items yet", "No reviews yet"
- **Loading skeleton** states for cards
- **Bookmark/Save icon** on profile
- **Share profile** button
- **Report profile** link (footer)
- **Profile completion progress** indicator (developer dashboard view)

---

**Do NOT include**: Functional dropdowns, form validation states, actual data entry flows, admin interfaces, or backend logic. Focus on the visual design system, layout, and component styling.
