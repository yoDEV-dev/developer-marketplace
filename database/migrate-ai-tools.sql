-- Migration: Add AI Tools tables and seed data
-- Run on existing Railway DB that already has the base schema

-- Create tables (IF NOT EXISTS for idempotency)
CREATE TABLE IF NOT EXISTS ai_tools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(80) NOT NULL UNIQUE,
    category        VARCHAR(40),
    icon_url        VARCHAR(500),
    is_active       BOOLEAN DEFAULT TRUE,
    display_order   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS developer_ai_tools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id    UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
    ai_tool_id      UUID NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
    expertise_level VARCHAR(20) NOT NULL DEFAULT 'daily_user',
    display_order   INTEGER DEFAULT 0,
    UNIQUE(developer_id, ai_tool_id)
);

CREATE INDEX IF NOT EXISTS idx_dev_ai_tools_developer ON developer_ai_tools(developer_id);

-- Seed AI tools (skip if already seeded)
INSERT INTO ai_tools (name, category, display_order) VALUES
    ('GitHub Copilot', 'Code Assistant', 1),
    ('Cursor', 'Code Assistant', 2),
    ('Claude Code', 'Code Assistant', 3),
    ('Windsurf', 'Code Assistant', 4),
    ('Tabnine', 'Code Assistant', 5),
    ('Amazon CodeWhisperer', 'Code Assistant', 6),
    ('Codeium', 'Code Assistant', 7),
    ('ChatGPT', 'Chat', 10),
    ('Claude', 'Chat', 11),
    ('Gemini', 'Chat', 12),
    ('Perplexity', 'Chat', 13),
    ('Grok', 'Chat', 14),
    ('Midjourney', 'Image', 20),
    ('DALL-E', 'Image', 21),
    ('Stable Diffusion', 'Image', 22),
    ('Adobe Firefly', 'Image', 23),
    ('v0', 'Design', 30),
    ('Bolt', 'Design', 31),
    ('Lovable', 'Design', 32),
    ('Devin', 'DevOps', 40),
    ('Hugging Face', 'ML Platform', 50),
    ('Weights & Biases', 'ML Platform', 51),
    ('Jasper', 'Writing', 60),
    ('Copy.ai', 'Writing', 61),
    ('Grammarly AI', 'Writing', 62)
ON CONFLICT (name) DO NOTHING;

-- Add AI tools for existing mock developers
-- Mateo Silva (BR) - Full-Stack: uses Copilot, Claude Code, ChatGPT, v0
INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'building_with', 0
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Mateo Silva' AND at.name = 'GitHub Copilot'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'building_with', 1
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Mateo Silva' AND at.name = 'Claude Code'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'power_user', 2
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Mateo Silva' AND at.name = 'ChatGPT'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'daily_user', 3
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Mateo Silva' AND at.name = 'v0'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

-- Valentina Restrepo (CO) - Frontend: uses Cursor, Claude, v0, Midjourney
INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'building_with', 0
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Valentina Restrepo' AND at.name = 'Cursor'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'power_user', 1
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Valentina Restrepo' AND at.name = 'Claude'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'daily_user', 2
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Valentina Restrepo' AND at.name = 'v0'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'daily_user', 3
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Valentina Restrepo' AND at.name = 'Midjourney'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

-- Santiago Morales (CL) - Backend: uses Claude Code, GitHub Copilot, Perplexity
INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'building_with', 0
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Santiago Morales' AND at.name = 'Claude Code'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'power_user', 1
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Santiago Morales' AND at.name = 'GitHub Copilot'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'daily_user', 2
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Santiago Morales' AND at.name = 'Perplexity'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

-- Camila Herrera (MX) - Mobile: uses GitHub Copilot, ChatGPT, Gemini
INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'power_user', 0
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Camila Herrera' AND at.name = 'GitHub Copilot'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'daily_user', 1
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Camila Herrera' AND at.name = 'ChatGPT'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'daily_user', 2
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Camila Herrera' AND at.name = 'Gemini'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

-- Lucas Fernandez (AR) - DevOps: uses Claude Code, Cursor, Devin
INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'building_with', 0
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Lucas Fernandez' AND at.name = 'Claude Code'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'power_user', 1
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Lucas Fernandez' AND at.name = 'Cursor'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'daily_user', 2
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Lucas Fernandez' AND at.name = 'Devin'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

-- Isabella Torres (PE) - AI/ML: uses Claude, Hugging Face, Weights & Biases, ChatGPT, Claude Code
INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'building_with', 0
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Isabella Torres' AND at.name = 'Claude'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'building_with', 1
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Isabella Torres' AND at.name = 'Hugging Face'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'power_user', 2
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Isabella Torres' AND at.name = 'Weights & Biases'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'power_user', 3
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Isabella Torres' AND at.name = 'ChatGPT'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;

INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
SELECT dp.id, at.id, 'building_with', 4
FROM developer_profiles dp, ai_tools at
WHERE dp.display_name = 'Isabella Torres' AND at.name = 'Claude Code'
ON CONFLICT (developer_id, ai_tool_id) DO NOTHING;
