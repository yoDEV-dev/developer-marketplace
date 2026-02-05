import { query, queryOne } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────

export interface DeveloperSearchFilters {
  techTags?: string[];
  availability?: string;
  rateMin?: number;
  rateMax?: number;
  country?: string;
  experience?: string;
  verified?: boolean;
  hasPortfolio?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
  q?: string;
}

export interface DeveloperListItem {
  id: string;
  display_name: string;
  headline: string;
  profile_photo_url: string | null;
  availability_status: string;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  avg_rating: number;
  total_reviews: number;
  is_verified: boolean;
  country_name: string | null;
  flag_emoji: string | null;
  skills: string[];
}

export interface DeveloperProfile {
  id: string;
  user_id: string;
  display_name: string;
  headline: string;
  bio: string | null;
  bio_es: string | null;
  profile_photo_url: string | null;
  banner_image_url: string | null;
  country_code: string | null;
  country_name: string | null;
  flag_emoji: string | null;
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
  nda_willing: boolean;
  contract_openness: string[];
  calendar_url: string | null;
  website_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  stackoverflow_url: string | null;
  twitter_url: string | null;
  cv_pdf_url: string | null;
  avg_rating: number;
  total_reviews: number;
  avg_response_hours: number | null;
  completion_rate: number;
  profile_views_total: number;
  is_verified: boolean;
  is_featured: boolean;
  created_at: string;
  last_active_at: string;
  // Related data
  skills: DeveloperSkill[];
  languages: DeveloperLanguage[];
  specializations: string[];
  certifications: DeveloperCertification[];
  portfolio: PortfolioProject[];
  reviews: DeveloperReview[];
  pricing_models: string[];
  payment_methods: string[];
}

export interface DeveloperSkill {
  name: string;
  category: string | null;
  skill_level: string;
  endorsement_count: number;
}

export interface DeveloperLanguage {
  language: string;
  proficiency: string;
}

export interface DeveloperCertification {
  id: string;
  name: string;
  issuer: string | null;
  year_obtained: number | null;
  badge_image_url: string | null;
  verification_url: string | null;
}

export interface PortfolioProject {
  id: string;
  title: string;
  client_name: string | null;
  is_confidential: boolean;
  description: string;
  description_es: string | null;
  duration: string | null;
  completion_year: number | null;
  live_url: string | null;
  github_url: string | null;
  client_testimonial: string | null;
  client_testimonial_name: string | null;
  is_featured: boolean;
  tech_tags: string[];
  images: PortfolioImage[];
}

export interface PortfolioImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_thumbnail: boolean;
}

export interface DeveloperReview {
  id: string;
  rating_overall: number;
  rating_communication: number | null;
  rating_quality: number | null;
  rating_timeliness: number | null;
  rating_value: number | null;
  review_text: string | null;
  reviewer_name: string | null;
  is_anonymous: boolean;
  is_verified: boolean;
  created_at: string;
}

// ── Search ─────────────────────────────────────────────────

function getSortClause(sort?: string): string {
  switch (sort) {
    case "rating":
      return "dp.avg_rating DESC, dp.total_reviews DESC";
    case "rate_low":
      return "dp.hourly_rate_min ASC NULLS LAST";
    case "rate_high":
      return "dp.hourly_rate_max DESC NULLS LAST";
    case "newest":
      return "dp.created_at DESC";
    case "active":
      return "dp.last_active_at DESC";
    default:
      return "dp.is_featured DESC, dp.avg_rating DESC, dp.total_reviews DESC";
  }
}

export async function searchDevelopers(filters: DeveloperSearchFilters) {
  const conditions: string[] = ["dp.is_published = true"];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters.q) {
    conditions.push(
      `(dp.display_name ILIKE $${paramIndex} OR dp.headline ILIKE $${paramIndex})`,
    );
    params.push(`%${filters.q}%`);
    paramIndex++;
  }

  if (filters.techTags?.length) {
    conditions.push(
      `EXISTS (
        SELECT 1 FROM developer_skills ds
        JOIN tech_tags tt ON ds.tech_tag_id = tt.id
        WHERE ds.developer_id = dp.id AND tt.name = ANY($${paramIndex})
      )`,
    );
    params.push(filters.techTags);
    paramIndex++;
  }

  if (filters.availability) {
    conditions.push(`dp.availability_status = $${paramIndex}`);
    params.push(filters.availability);
    paramIndex++;
  }

  if (filters.rateMin != null) {
    conditions.push(`dp.hourly_rate_max >= $${paramIndex}`);
    params.push(filters.rateMin);
    paramIndex++;
  }

  if (filters.rateMax != null) {
    conditions.push(`dp.hourly_rate_min <= $${paramIndex}`);
    params.push(filters.rateMax);
    paramIndex++;
  }

  if (filters.country) {
    conditions.push(`dp.country_code = $${paramIndex}`);
    params.push(filters.country);
    paramIndex++;
  }

  if (filters.experience) {
    conditions.push(`dp.years_experience = $${paramIndex}`);
    params.push(filters.experience);
    paramIndex++;
  }

  if (filters.verified) {
    conditions.push("dp.is_verified = true");
  }

  if (filters.hasPortfolio) {
    conditions.push(
      "EXISTS (SELECT 1 FROM portfolio_projects pp WHERE pp.developer_id = dp.id)",
    );
  }

  const whereClause = conditions.join(" AND ");
  const orderBy = getSortClause(filters.sort);
  const limit = filters.limit || 20;
  const offset = filters.offset || 0;

  // Count
  const countResult = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM developer_profiles dp WHERE ${whereClause}`,
    params,
  );

  // Profiles
  const rows = await query<
    Omit<DeveloperListItem, "skills" | "country_name" | "flag_emoji"> & {
      country_name: string | null;
      flag_emoji: string | null;
    }
  >(
    `SELECT dp.id, dp.display_name, dp.headline, dp.profile_photo_url,
            dp.availability_status, dp.hourly_rate_min, dp.hourly_rate_max,
            dp.avg_rating, dp.total_reviews, dp.is_verified,
            c.name as country_name, c.flag_emoji
     FROM developer_profiles dp
     LEFT JOIN countries c ON dp.country_code = c.code
     WHERE ${whereClause}
     ORDER BY ${orderBy}
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset],
  );

  // Batch fetch skills for returned developers
  const devIds = rows.map((r) => r.id);
  let skillsMap: Record<string, string[]> = {};

  if (devIds.length > 0) {
    const skills = await query<{ developer_id: string; name: string }>(
      `SELECT ds.developer_id, tt.name
       FROM developer_skills ds
       JOIN tech_tags tt ON ds.tech_tag_id = tt.id
       WHERE ds.developer_id = ANY($1)
       ORDER BY ds.skill_level ASC, ds.display_order ASC`,
      [devIds],
    );

    skillsMap = {};
    for (const s of skills) {
      if (!skillsMap[s.developer_id]) skillsMap[s.developer_id] = [];
      skillsMap[s.developer_id].push(s.name);
    }
  }

  return {
    developers: rows.map((dev) => ({
      ...dev,
      skills: skillsMap[dev.id] || [],
    })),
    total: parseInt(countResult?.count || "0"),
  };
}

// ── Get by ID ──────────────────────────────────────────────

export async function getDeveloperById(
  id: string,
): Promise<DeveloperProfile | null> {
  const profile = await queryOne<
    Omit<
      DeveloperProfile,
      | "skills"
      | "languages"
      | "specializations"
      | "certifications"
      | "portfolio"
      | "reviews"
      | "pricing_models"
      | "payment_methods"
      | "country_name"
      | "flag_emoji"
    > & { country_name: string | null; flag_emoji: string | null }
  >(
    `SELECT dp.*, c.name as country_name, c.flag_emoji
     FROM developer_profiles dp
     LEFT JOIN countries c ON dp.country_code = c.code
     WHERE dp.id = $1 AND dp.is_published = true`,
    [id],
  );

  if (!profile) return null;

  // Fetch all related data in parallel
  const [
    skills,
    languages,
    specializations,
    certifications,
    portfolioProjects,
    reviews,
    pricingModels,
    paymentMethods,
  ] = await Promise.all([
    query<DeveloperSkill>(
      `SELECT tt.name, tt.category, ds.skill_level, ds.endorsement_count
       FROM developer_skills ds
       JOIN tech_tags tt ON ds.tech_tag_id = tt.id
       WHERE ds.developer_id = $1
       ORDER BY ds.skill_level ASC, ds.display_order ASC`,
      [id],
    ),
    query<DeveloperLanguage>(
      `SELECT language, proficiency FROM developer_languages
       WHERE developer_id = $1`,
      [id],
    ),
    query<{ name: string }>(
      `SELECT s.name FROM developer_specializations ds
       JOIN specializations s ON ds.specialization_id = s.id
       WHERE ds.developer_id = $1`,
      [id],
    ),
    query<DeveloperCertification>(
      `SELECT id, name, issuer, year_obtained, badge_image_url, verification_url
       FROM developer_certifications
       WHERE developer_id = $1
       ORDER BY display_order ASC`,
      [id],
    ),
    query<
      Omit<PortfolioProject, "tech_tags" | "images"> & {
        project_id: string;
      }
    >(
      `SELECT id as project_id, id, title, client_name, is_confidential,
              description, description_es, duration, completion_year,
              live_url, github_url, client_testimonial, client_testimonial_name,
              is_featured
       FROM portfolio_projects
       WHERE developer_id = $1
       ORDER BY is_featured DESC, display_order ASC`,
      [id],
    ),
    query<DeveloperReview>(
      `SELECT id, rating_overall, rating_communication, rating_quality,
              rating_timeliness, rating_value, review_text, reviewer_name,
              is_anonymous, is_verified, created_at
       FROM developer_reviews
       WHERE developer_id = $1 AND is_visible = true
       ORDER BY created_at DESC
       LIMIT 10`,
      [id],
    ),
    query<{ model_type: string }>(
      `SELECT model_type FROM developer_pricing_models WHERE developer_id = $1`,
      [id],
    ),
    query<{ method: string }>(
      `SELECT method FROM developer_payment_methods WHERE developer_id = $1`,
      [id],
    ),
  ]);

  // Fetch portfolio images and tech tags
  const projectIds = portfolioProjects.map((p) => p.project_id);
  let portfolioImages: { project_id: string; id: string; image_url: string; alt_text: string | null; is_thumbnail: boolean }[] = [];
  let portfolioTechTags: { project_id: string; name: string }[] = [];

  if (projectIds.length > 0) {
    [portfolioImages, portfolioTechTags] = await Promise.all([
      query<{
        project_id: string;
        id: string;
        image_url: string;
        alt_text: string | null;
        is_thumbnail: boolean;
      }>(
        `SELECT project_id, id, image_url, alt_text, is_thumbnail
         FROM portfolio_images
         WHERE project_id = ANY($1)
         ORDER BY display_order ASC`,
        [projectIds],
      ),
      query<{ project_id: string; name: string }>(
        `SELECT ptt.project_id, tt.name
         FROM portfolio_tech_tags ptt
         JOIN tech_tags tt ON ptt.tech_tag_id = tt.id
         WHERE ptt.project_id = ANY($1)`,
        [projectIds],
      ),
    ]);
  }

  return {
    ...profile,
    skills,
    languages,
    specializations: specializations.map((s) => s.name),
    certifications,
    portfolio: portfolioProjects.map((p) => ({
      ...p,
      tech_tags: portfolioTechTags
        .filter((t) => t.project_id === p.project_id)
        .map((t) => t.name),
      images: portfolioImages
        .filter((i) => i.project_id === p.project_id)
        .map(({ project_id: _, ...img }) => img),
    })),
    reviews,
    pricing_models: pricingModels.map((m) => m.model_type),
    payment_methods: paymentMethods.map((m) => m.method),
  };
}
