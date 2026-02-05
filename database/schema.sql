-- ============================================================
-- yoDEV Developer Marketplace — Database Schema
-- Version: 1.0 (Draft)
-- Date: February 5, 2026
-- ============================================================
-- Notes:
--   - Designed for PostgreSQL (compatible with Supabase)
--   - Uses UUID primary keys for distributed-friendly IDs
--   - Supports bilingual profiles (ES/EN)
--   - All timestamps in UTC
-- ============================================================


-- ============================================================
-- LOOKUP / REFERENCE TABLES
-- ============================================================

-- Master list of technology tags (shared across platform)
CREATE TABLE tech_tags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(60) NOT NULL UNIQUE,        -- e.g. "React", "Python"
    category        VARCHAR(40),                         -- e.g. "Frontend", "Backend", "DevOps"
    icon_url        VARCHAR(500),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Specialization areas
CREATE TABLE specializations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL UNIQUE,        -- e.g. "API Development & Integration"
    description     TEXT,
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE
);

-- Industry sectors
CREATE TABLE industries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL UNIQUE,        -- e.g. "Fintech", "Healthcare"
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE
);

-- Project type options
CREATE TABLE project_types (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL UNIQUE,        -- e.g. "MVP / Prototype Development"
    description     TEXT,
    display_order   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE
);

-- Supported currencies
CREATE TABLE currencies (
    code            VARCHAR(3) PRIMARY KEY,              -- e.g. "USD", "CLP"
    name            VARCHAR(50) NOT NULL,
    symbol          VARCHAR(5) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE
);

-- Countries reference
CREATE TABLE countries (
    code            VARCHAR(2) PRIMARY KEY,              -- ISO 3166-1 alpha-2
    name            VARCHAR(100) NOT NULL,
    flag_emoji      VARCHAR(10),
    region          VARCHAR(50),                         -- e.g. "Latin America", "Europe"
    is_latam        BOOLEAN DEFAULT FALSE
);


-- ============================================================
-- CORE PROFILE
-- ============================================================

CREATE TABLE developer_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE,            -- FK to main yoDEV user table

    -- Identity
    display_name            VARCHAR(60) NOT NULL,
    headline                VARCHAR(120) NOT NULL,
    bio                     TEXT,                            -- Rich text / markdown, max ~2000 chars
    bio_es                  TEXT,                            -- Spanish version (bilingual toggle)
    profile_photo_url       VARCHAR(500),
    banner_image_url        VARCHAR(500),

    -- Location & Language
    country_code            VARCHAR(2) REFERENCES countries(code),
    city                    VARCHAR(100),
    timezone                VARCHAR(50),                     -- e.g. "America/Santiago"

    -- Experience
    years_experience        VARCHAR(10),                     -- "0-1","1-3","3-5","5-10","10-15","15+"

    -- Availability
    availability_status     VARCHAR(20) NOT NULL DEFAULT 'available',
        -- ENUM: 'available', 'limited', 'booked', 'not_taking_work'

    -- Pricing
    pricing_currency        VARCHAR(3) DEFAULT 'USD' REFERENCES currencies(code),
    hourly_rate_min         DECIMAL(10,2),
    hourly_rate_max         DECIMAL(10,2),
    project_budget_range    VARCHAR(30),                     -- e.g. "$5,000 – $15,000"
    free_consultation       BOOLEAN DEFAULT FALSE,
    open_to_negotiation     BOOLEAN DEFAULT TRUE,

    -- Work Preferences
    work_arrangement        VARCHAR(20)[] DEFAULT '{}',      -- Array: 'remote','hybrid','onsite'
    time_overlap_note       VARCHAR(200),
    preferred_duration      VARCHAR(20)[] DEFAULT '{}',      -- Array: 'short','medium','long','any'
    team_preference         VARCHAR(20)[] DEFAULT '{}',      -- Array: 'solo','small','large','any'
    open_to_subcontracting  BOOLEAN DEFAULT FALSE,
    open_to_being_subbed    BOOLEAN DEFAULT FALSE,
    nda_willing             BOOLEAN DEFAULT TRUE,
    contract_openness       VARCHAR(20)[] DEFAULT '{freelance}',
        -- Array: 'freelance','contract_to_hire','fulltime'

    -- LatAm Specific
    tax_invoice_type        VARCHAR(50),                     -- e.g. "Boleta de Honorarios"
    can_invoice_usd         BOOLEAN DEFAULT FALSE,
    bilingual_profile       BOOLEAN DEFAULT FALSE,

    -- Contact & Links
    calendar_url            VARCHAR(500),                    -- Calendly, Cal.com, etc.
    website_url             VARCHAR(500),
    github_url              VARCHAR(500),
    linkedin_url            VARCHAR(500),
    stackoverflow_url       VARCHAR(500),
    twitter_url             VARCHAR(500),
    cv_pdf_url              VARCHAR(500),

    -- Platform Metrics (system-managed)
    avg_rating              DECIMAL(2,1) DEFAULT 0.0,
    total_reviews           INTEGER DEFAULT 0,
    repeat_client_pct       DECIMAL(5,2) DEFAULT 0.0,
    avg_response_hours      DECIMAL(6,1),
    completion_rate         DECIMAL(5,2) DEFAULT 100.0,
    profile_views_total     INTEGER DEFAULT 0,
    community_karma         INTEGER DEFAULT 0,               -- From yoDEV platform activity
    profile_completion_pct  INTEGER DEFAULT 0,
    is_verified             BOOLEAN DEFAULT FALSE,
    is_featured             BOOLEAN DEFAULT FALSE,
    is_published            BOOLEAN DEFAULT FALSE,           -- Draft vs live

    -- Timestamps
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),
    last_active_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Index for search & filtering
CREATE INDEX idx_profiles_country ON developer_profiles(country_code);
CREATE INDEX idx_profiles_availability ON developer_profiles(availability_status);
CREATE INDEX idx_profiles_rating ON developer_profiles(avg_rating DESC);
CREATE INDEX idx_profiles_published ON developer_profiles(is_published);
CREATE INDEX idx_profiles_hourly_rate ON developer_profiles(hourly_rate_min, hourly_rate_max);


-- ============================================================
-- SKILLS & EXPERTISE (Junction Tables)
-- ============================================================

-- Developer ↔ Tech Tags (primary + secondary)
CREATE TABLE developer_skills (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    tech_tag_id     UUID NOT NULL REFERENCES tech_tags(id) ON DELETE CASCADE,
    skill_level     VARCHAR(10) DEFAULT 'primary',       -- 'primary', 'secondary'
    endorsement_count INTEGER DEFAULT 0,
    display_order   INTEGER DEFAULT 0,
    UNIQUE(developer_id, tech_tag_id)
);

-- Developer ↔ Specializations
CREATE TABLE developer_specializations (
    developer_id        UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    specialization_id   UUID NOT NULL REFERENCES specializations(id) ON DELETE CASCADE,
    PRIMARY KEY (developer_id, specialization_id)
);

-- Developer ↔ Industries
CREATE TABLE developer_industries (
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    industry_id     UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
    PRIMARY KEY (developer_id, industry_id)
);

-- Developer ↔ Project Types Accepted
CREATE TABLE developer_project_types (
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    project_type_id UUID NOT NULL REFERENCES project_types(id) ON DELETE CASCADE,
    PRIMARY KEY (developer_id, project_type_id)
);

-- Developer ↔ Pricing Models
CREATE TABLE developer_pricing_models (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    model_type      VARCHAR(30) NOT NULL,
        -- 'hourly','project_based','monthly_retainer','milestone','get_a_quote','equity_rev_share'
    UNIQUE(developer_id, model_type)
);

-- Developer ↔ Payment Methods
CREATE TABLE developer_payment_methods (
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    method          VARCHAR(30) NOT NULL,
        -- 'bank_transfer','paypal','wise','crypto','payoneer','other'
    PRIMARY KEY (developer_id, method)
);

-- Developer ↔ Languages Spoken
CREATE TABLE developer_languages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    language        VARCHAR(30) NOT NULL,                -- e.g. "Spanish", "English"
    proficiency     VARCHAR(20) DEFAULT 'fluent',        -- 'native','fluent','conversational','basic'
    UNIQUE(developer_id, language)
);

-- Developer ↔ Regional Experience
CREATE TABLE developer_regional_experience (
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    country_code    VARCHAR(2) NOT NULL REFERENCES countries(code),
    PRIMARY KEY (developer_id, country_code)
);

-- Skill Endorsements
CREATE TABLE skill_endorsements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    tech_tag_id     UUID NOT NULL REFERENCES tech_tags(id) ON DELETE CASCADE,
    endorsed_by     UUID NOT NULL,                       -- FK to yoDEV user
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(developer_id, tech_tag_id, endorsed_by)
);

-- Certifications
CREATE TABLE developer_certifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL,
    issuer          VARCHAR(100),
    year_obtained   INTEGER,
    badge_image_url VARCHAR(500),
    verification_url VARCHAR(500),
    display_order   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- PORTFOLIO / PAST PROJECTS
-- ============================================================

CREATE TABLE portfolio_projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,

    title           VARCHAR(100) NOT NULL,
    client_name     VARCHAR(100),                        -- NULL = confidential
    is_confidential BOOLEAN DEFAULT FALSE,
    description     TEXT NOT NULL,
    description_es  TEXT,                                -- Bilingual support

    project_type_id UUID REFERENCES project_types(id),
    duration        VARCHAR(50),                         -- e.g. "3 months"
    completion_year INTEGER,

    live_url        VARCHAR(500),
    github_url      VARCHAR(500),

    client_testimonial      TEXT,
    client_testimonial_name VARCHAR(100),

    is_featured     BOOLEAN DEFAULT FALSE,               -- Max 3 pinned
    display_order   INTEGER DEFAULT 0,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio project screenshots/images
CREATE TABLE portfolio_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES portfolio_projects(id) ON DELETE CASCADE,
    image_url       VARCHAR(500) NOT NULL,
    alt_text        VARCHAR(200),
    is_thumbnail    BOOLEAN DEFAULT FALSE,
    display_order   INTEGER DEFAULT 0
);

-- Portfolio project ↔ Tech Tags
CREATE TABLE portfolio_tech_tags (
    project_id      UUID NOT NULL REFERENCES portfolio_projects(id) ON DELETE CASCADE,
    tech_tag_id     UUID NOT NULL REFERENCES tech_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tech_tag_id)
);


-- ============================================================
-- INQUIRIES & HIRING FLOW
-- (Defined before reviews since reviews reference inquiries)
-- ============================================================

CREATE TABLE inquiries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    client_user_id  UUID NOT NULL,                       -- FK to yoDEV user

    -- Inquiry Details
    subject         VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    project_type_id UUID REFERENCES project_types(id),
    budget_range    VARCHAR(30),
    timeline        VARCHAR(100),

    -- Status Tracking
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
        -- 'pending','viewed','responded','in_discussion','accepted','declined','completed','cancelled'

    responded_at    TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_developer ON inquiries(developer_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_client ON inquiries(client_user_id);


-- ============================================================
-- REVIEWS & RATINGS
-- ============================================================

CREATE TABLE developer_reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    reviewer_id     UUID,                                -- FK to yoDEV user (NULL if external)

    -- Ratings (1-5 scale)
    rating_overall      SMALLINT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
    rating_communication SMALLINT CHECK (rating_communication BETWEEN 1 AND 5),
    rating_quality      SMALLINT CHECK (rating_quality BETWEEN 1 AND 5),
    rating_timeliness   SMALLINT CHECK (rating_timeliness BETWEEN 1 AND 5),
    rating_value        SMALLINT CHECK (rating_value BETWEEN 1 AND 5),

    -- Content
    review_text         TEXT,
    reviewer_name       VARCHAR(100),                    -- Display name (can be anonymous)
    is_anonymous        BOOLEAN DEFAULT FALSE,

    -- Linking
    portfolio_project_id UUID REFERENCES portfolio_projects(id),
    inquiry_id          UUID REFERENCES inquiries(id),

    -- Moderation
    is_verified         BOOLEAN DEFAULT FALSE,           -- Platform-verified engagement
    is_visible          BOOLEAN DEFAULT TRUE,
    flagged             BOOLEAN DEFAULT FALSE,

    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_developer ON developer_reviews(developer_id);
CREATE INDEX idx_reviews_rating ON developer_reviews(rating_overall);


-- ============================================================
-- SOCIAL LINKS (flexible key-value)
-- ============================================================

CREATE TABLE developer_social_links (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    platform        VARCHAR(30) NOT NULL,                -- 'github','linkedin','website','twitter','stackoverflow','other'
    label           VARCHAR(50),                         -- Custom label for 'other' type
    url             VARCHAR(500) NOT NULL,
    display_order   INTEGER DEFAULT 0,
    UNIQUE(developer_id, platform, url)
);


-- ============================================================
-- ANALYTICS / PROFILE VIEWS
-- ============================================================

CREATE TABLE profile_view_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    viewer_user_id  UUID,                                -- NULL if anonymous visitor
    source          VARCHAR(30),                         -- 'directory','search','direct_link','referral'
    viewed_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Daily aggregated stats (for dashboard charts)
CREATE TABLE profile_stats_daily (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    stat_date       DATE NOT NULL,
    profile_views   INTEGER DEFAULT 0,
    search_appearances INTEGER DEFAULT 0,
    inquiry_count   INTEGER DEFAULT 0,
    cta_clicks      INTEGER DEFAULT 0,
    UNIQUE(developer_id, stat_date)
);

CREATE INDEX idx_stats_developer_date ON profile_stats_daily(developer_id, stat_date DESC);


-- ============================================================
-- TIME TRACKING / HOURS LOGGING
-- ============================================================

CREATE TABLE time_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    inquiry_id      UUID REFERENCES inquiries(id),           -- Optional link to engagement

    -- Project context (manual if no inquiry linked)
    project_name    VARCHAR(150),
    client_name     VARCHAR(100),

    -- Time details
    entry_date      DATE NOT NULL,
    hours           DECIMAL(5,2) NOT NULL,                   -- e.g. 2.5 hours
    description     TEXT,                                     -- What was worked on

    -- Billing info
    hourly_rate     DECIMAL(10,2),                           -- Rate at time of entry
    currency        VARCHAR(3) DEFAULT 'USD',
    is_billable     BOOLEAN DEFAULT TRUE,
    is_invoiced     BOOLEAN DEFAULT FALSE,

    -- Timer tracking (for live timer feature)
    timer_started_at TIMESTAMPTZ,                            -- When timer was started
    timer_stopped_at TIMESTAMPTZ,                            -- When timer was stopped

    -- Metadata
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_time_entries_developer ON time_entries(developer_id);
CREATE INDEX idx_time_entries_date ON time_entries(developer_id, entry_date DESC);
CREATE INDEX idx_time_entries_inquiry ON time_entries(inquiry_id);

-- Weekly time summary view (for dashboard)
CREATE TABLE time_summary_weekly (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    week_start      DATE NOT NULL,                           -- Monday of the week
    total_hours     DECIMAL(6,2) DEFAULT 0,
    billable_hours  DECIMAL(6,2) DEFAULT 0,
    total_earnings  DECIMAL(12,2) DEFAULT 0,
    projects_count  INTEGER DEFAULT 0,
    UNIQUE(developer_id, week_start)
);

CREATE INDEX idx_time_summary_developer ON time_summary_weekly(developer_id, week_start DESC);

-- Trigger to update time_entries updated_at
CREATE TRIGGER trg_time_entry_updated
    BEFORE UPDATE ON time_entries
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- BOOKMARKS / SAVED DEVELOPERS
-- ============================================================

CREATE TABLE saved_developers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,                       -- Client who saved
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    note            VARCHAR(200),                        -- Optional private note
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, developer_id)
);


-- ============================================================
-- MODERATION / REPORTS
-- ============================================================

CREATE TABLE profile_reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    reported_by     UUID NOT NULL,
    reason          VARCHAR(30) NOT NULL,                 -- 'spam','fake','inappropriate','other'
    details         TEXT,
    status          VARCHAR(20) DEFAULT 'pending',        -- 'pending','reviewed','resolved','dismissed'
    reviewed_by     UUID,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- MESSAGING / CONVERSATIONS
-- ============================================================

CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id      UUID REFERENCES inquiries(id),           -- Optional link to inquiry
    subject         VARCHAR(200),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL,                           -- developer_profiles.id or client user_id
    display_name    VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(500),
    last_read_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL,                           -- user_id of the sender
    body            TEXT NOT NULL,
    is_system       BOOLEAN DEFAULT FALSE,                   -- System-generated messages
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id);

CREATE TRIGGER trg_conversation_updated
    BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- HELPER FUNCTION: Update profile completion percentage
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_profile_completion(dev_id UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    total INTEGER := 0;
BEGIN
    -- Required fields (weighted higher)
    total := total + 15;
    IF EXISTS (SELECT 1 FROM developer_profiles WHERE id = dev_id AND display_name IS NOT NULL) THEN
        score := score + 15;
    END IF;

    total := total + 10;
    IF EXISTS (SELECT 1 FROM developer_profiles WHERE id = dev_id AND headline IS NOT NULL) THEN
        score := score + 10;
    END IF;

    total := total + 10;
    IF EXISTS (SELECT 1 FROM developer_profiles WHERE id = dev_id AND bio IS NOT NULL AND LENGTH(bio) > 50) THEN
        score := score + 10;
    END IF;

    total := total + 10;
    IF EXISTS (SELECT 1 FROM developer_profiles WHERE id = dev_id AND profile_photo_url IS NOT NULL) THEN
        score := score + 10;
    END IF;

    -- Skills
    total := total + 10;
    IF EXISTS (SELECT 1 FROM developer_skills WHERE developer_id = dev_id LIMIT 1) THEN
        score := score + 10;
    END IF;

    -- Specializations
    total := total + 5;
    IF EXISTS (SELECT 1 FROM developer_specializations WHERE developer_id = dev_id LIMIT 1) THEN
        score := score + 5;
    END IF;

    -- Portfolio
    total := total + 15;
    IF EXISTS (SELECT 1 FROM portfolio_projects WHERE developer_id = dev_id LIMIT 1) THEN
        score := score + 15;
    END IF;

    -- Pricing
    total := total + 10;
    IF EXISTS (SELECT 1 FROM developer_pricing_models WHERE developer_id = dev_id LIMIT 1) THEN
        score := score + 10;
    END IF;

    -- Languages
    total := total + 5;
    IF EXISTS (SELECT 1 FROM developer_languages WHERE developer_id = dev_id LIMIT 1) THEN
        score := score + 5;
    END IF;

    -- Social links
    total := total + 5;
    IF EXISTS (SELECT 1 FROM developer_social_links WHERE developer_id = dev_id LIMIT 1) THEN
        score := score + 5;
    END IF;

    -- Calendar link
    total := total + 5;
    IF EXISTS (SELECT 1 FROM developer_profiles WHERE id = dev_id AND calendar_url IS NOT NULL) THEN
        score := score + 5;
    END IF;

    RETURN ROUND((score::DECIMAL / total) * 100);
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TRIGGER: Auto-update updated_at timestamps
-- ============================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profile_updated
    BEFORE UPDATE ON developer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_portfolio_updated
    BEFORE UPDATE ON portfolio_projects
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_inquiry_updated
    BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- SEED DATA: LatAm Countries
-- ============================================================

INSERT INTO countries (code, name, flag_emoji, region, is_latam) VALUES
    ('CL', 'Chile',      '🇨🇱', 'Latin America', TRUE),
    ('AR', 'Argentina',  '🇦🇷', 'Latin America', TRUE),
    ('CO', 'Colombia',   '🇨🇴', 'Latin America', TRUE),
    ('PE', 'Peru',       '🇵🇪', 'Latin America', TRUE),
    ('MX', 'Mexico',     '🇲🇽', 'Latin America', TRUE),
    ('BR', 'Brazil',     '🇧🇷', 'Latin America', TRUE),
    ('UY', 'Uruguay',    '🇺🇾', 'Latin America', TRUE),
    ('EC', 'Ecuador',    '🇪🇨', 'Latin America', TRUE),
    ('BO', 'Bolivia',    '🇧🇴', 'Latin America', TRUE),
    ('PY', 'Paraguay',   '🇵🇾', 'Latin America', TRUE),
    ('VE', 'Venezuela',  '🇻🇪', 'Latin America', TRUE),
    ('CR', 'Costa Rica', '🇨🇷', 'Latin America', TRUE),
    ('PA', 'Panama',     '🇵🇦', 'Latin America', TRUE),
    ('US', 'United States', '🇺🇸', 'North America', FALSE),
    ('CA', 'Canada',     '🇨🇦', 'North America', FALSE),
    ('GB', 'United Kingdom', '🇬🇧', 'Europe', FALSE),
    ('DE', 'Germany',    '🇩🇪', 'Europe', FALSE),
    ('ES', 'Spain',      '🇪🇸', 'Europe', FALSE),
    ('FR', 'France',     '🇫🇷', 'Europe', FALSE);

-- Seed currencies
INSERT INTO currencies (code, name, symbol) VALUES
    ('USD', 'US Dollar',        '$'),
    ('CLP', 'Chilean Peso',     '$'),
    ('ARS', 'Argentine Peso',   '$'),
    ('COP', 'Colombian Peso',   '$'),
    ('PEN', 'Peruvian Sol',     'S/'),
    ('MXN', 'Mexican Peso',     '$'),
    ('BRL', 'Brazilian Real',   'R$'),
    ('EUR', 'Euro',             '€'),
    ('GBP', 'British Pound',    '£'),
    ('CAD', 'Canadian Dollar',  '$');


-- ============================================================
-- SEED DATA: Specializations
-- ============================================================

INSERT INTO specializations (name, display_order) VALUES
    ('Web Application Development', 1),
    ('Mobile App Development (iOS / Android / Cross-platform)', 2),
    ('API Development & Integration', 3),
    ('Database Design & Architecture', 4),
    ('DevOps & CI/CD', 5),
    ('Cloud Infrastructure (AWS / GCP / Azure)', 6),
    ('UI/UX Design & Implementation', 7),
    ('E-commerce Solutions', 8),
    ('AI / ML Implementation', 9),
    ('Cybersecurity', 10),
    ('Legacy System Modernization', 11),
    ('Blockchain / Web3', 12),
    ('Data Engineering & Analytics', 13),
    ('Technical Consulting', 14);


-- ============================================================
-- SEED DATA: Project Types
-- ============================================================

INSERT INTO project_types (name, display_order) VALUES
    ('New Application Build (Greenfield)', 1),
    ('MVP / Prototype Development', 2),
    ('Feature Development (on existing codebase)', 3),
    ('API Development & Integration', 4),
    ('Database Design & Migration', 5),
    ('DevOps & Infrastructure Setup', 6),
    ('Code Review & Auditing', 7),
    ('Bug Fixing & Debugging', 8),
    ('Performance Optimization', 9),
    ('UI/UX Implementation', 10),
    ('E-commerce Setup & Customization', 11),
    ('AI/ML Model Integration', 12),
    ('Mobile App Development', 13),
    ('Maintenance & Support Contracts', 14),
    ('Technical Consulting / Advisory', 15),
    ('Team Augmentation / Staff Extension', 16);


-- ============================================================
-- SEED DATA: Industries
-- ============================================================

INSERT INTO industries (name, display_order) VALUES
    ('Fintech', 1),
    ('Healthcare', 2),
    ('EdTech', 3),
    ('Retail / E-commerce', 4),
    ('SaaS / B2B', 5),
    ('Real Estate / PropTech', 6),
    ('Logistics / Supply Chain', 7),
    ('Media / Entertainment', 8),
    ('Travel / Hospitality', 9),
    ('Government / Public Sector', 10),
    ('Non-profit / NGO', 11),
    ('Manufacturing', 12),
    ('Agriculture / AgTech', 13),
    ('Energy / CleanTech', 14),
    ('Telecommunications', 15);


-- ============================================================
-- SEED DATA: Common Tech Tags
-- ============================================================

INSERT INTO tech_tags (name, category) VALUES
    -- Frontend
    ('React', 'Frontend'),
    ('Vue.js', 'Frontend'),
    ('Angular', 'Frontend'),
    ('Next.js', 'Frontend'),
    ('Svelte', 'Frontend'),
    ('TypeScript', 'Frontend'),
    ('JavaScript', 'Frontend'),
    ('HTML/CSS', 'Frontend'),
    ('Tailwind CSS', 'Frontend'),
    ('Bootstrap', 'Frontend'),

    -- Backend
    ('Node.js', 'Backend'),
    ('Python', 'Backend'),
    ('Django', 'Backend'),
    ('FastAPI', 'Backend'),
    ('Ruby on Rails', 'Backend'),
    ('PHP', 'Backend'),
    ('Laravel', 'Backend'),
    ('Java', 'Backend'),
    ('Spring Boot', 'Backend'),
    ('Go', 'Backend'),
    ('Rust', 'Backend'),
    ('.NET / C#', 'Backend'),

    -- Mobile
    ('React Native', 'Mobile'),
    ('Flutter', 'Mobile'),
    ('iOS / Swift', 'Mobile'),
    ('Android / Kotlin', 'Mobile'),

    -- Database
    ('PostgreSQL', 'Database'),
    ('MySQL', 'Database'),
    ('MongoDB', 'Database'),
    ('Redis', 'Database'),
    ('Elasticsearch', 'Database'),
    ('Firebase', 'Database'),
    ('Supabase', 'Database'),

    -- Cloud & DevOps
    ('AWS', 'Cloud'),
    ('Google Cloud', 'Cloud'),
    ('Azure', 'Cloud'),
    ('Docker', 'DevOps'),
    ('Kubernetes', 'DevOps'),
    ('Terraform', 'DevOps'),
    ('CI/CD', 'DevOps'),
    ('GitHub Actions', 'DevOps'),

    -- AI/ML
    ('Machine Learning', 'AI/ML'),
    ('OpenAI / GPT', 'AI/ML'),
    ('TensorFlow', 'AI/ML'),
    ('PyTorch', 'AI/ML'),
    ('LangChain', 'AI/ML'),

    -- Other
    ('GraphQL', 'API'),
    ('REST API', 'API'),
    ('Stripe', 'Payments'),
    ('Shopify', 'E-commerce'),
    ('WordPress', 'CMS'),
    ('Webflow', 'No-Code');
