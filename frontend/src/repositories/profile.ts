import { query, queryOne } from "@/lib/db";

export interface EditableProfile {
  id: string;
  display_name: string;
  headline: string;
  bio: string | null;
  bio_es: string | null;
  profile_photo_url: string | null;
  banner_image_url: string | null;
  country_code: string | null;
  city: string | null;
  timezone: string | null;
  years_experience: string | null;
  availability_status: string;
  pricing_currency: string | null;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  project_budget_range: string | null;
  free_consultation: boolean;
  open_to_negotiation: boolean;
  work_arrangement: string[];
  time_overlap_note: string | null;
  preferred_duration: string[];
  team_preference: string[];
  open_to_subcontracting: boolean;
  open_to_being_subbed: boolean;
  nda_willing: boolean;
  contract_openness: string[];
  tax_invoice_type: string | null;
  can_invoice_usd: boolean;
  bilingual_profile: boolean;
  calendar_url: string | null;
  website_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  stackoverflow_url: string | null;
  twitter_url: string | null;
  cv_pdf_url: string | null;
  is_published: boolean;
  profile_completion_pct: number;
}

export interface ProfileSkill {
  tech_tag_id: string;
  tech_tag_name: string;
  category: string | null;
  skill_level: string;
}

export async function getEditableProfile(
  profileId: string,
): Promise<EditableProfile | null> {
  return queryOne<EditableProfile>(
    `SELECT id, display_name, headline, bio, bio_es, profile_photo_url,
            banner_image_url, country_code, city, timezone, years_experience,
            availability_status, pricing_currency, hourly_rate_min, hourly_rate_max,
            project_budget_range, free_consultation, open_to_negotiation,
            work_arrangement, time_overlap_note, preferred_duration, team_preference,
            open_to_subcontracting, open_to_being_subbed, nda_willing, contract_openness,
            tax_invoice_type, can_invoice_usd, bilingual_profile,
            calendar_url, website_url, github_url, linkedin_url,
            stackoverflow_url, twitter_url, cv_pdf_url,
            is_published, profile_completion_pct
     FROM developer_profiles WHERE id = $1`,
    [profileId],
  );
}

export async function getProfileSkills(
  profileId: string,
): Promise<ProfileSkill[]> {
  return query<ProfileSkill>(
    `SELECT ds.tech_tag_id, tt.name as tech_tag_name, tt.category, ds.skill_level
     FROM developer_skills ds
     JOIN tech_tags tt ON ds.tech_tag_id = tt.id
     WHERE ds.developer_id = $1
     ORDER BY ds.display_order ASC`,
    [profileId],
  );
}

export async function getProfilePricingModels(
  profileId: string,
): Promise<string[]> {
  const rows = await query<{ model_type: string }>(
    "SELECT model_type FROM developer_pricing_models WHERE developer_id = $1",
    [profileId],
  );
  return rows.map((r) => r.model_type);
}

export async function getProfilePaymentMethods(
  profileId: string,
): Promise<string[]> {
  const rows = await query<{ method: string }>(
    "SELECT method FROM developer_payment_methods WHERE developer_id = $1",
    [profileId],
  );
  return rows.map((r) => r.method);
}
