"use server";

import { revalidatePath } from "next/cache";
import { query, queryOne, pool } from "@/lib/db";
import { requireSession } from "@/lib/session";
import {
  basicInfoSchema,
  pricingSchema,
  workPreferencesSchema,
  socialLinksSchema,
  skillsSchema,
  aiToolsSchema,
  latamSchema,
} from "@/lib/validation";

export type ActionResult = {
  success: boolean;
  error?: string;
};

// ── Basic Info ─────────────────────────────────────────────

export async function updateBasicInfo(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = basicInfoSchema.safeParse({
    displayName: formData.get("displayName"),
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    bioEs: formData.get("bioEs"),
    countryCode: formData.get("countryCode"),
    city: formData.get("city"),
    timezone: formData.get("timezone"),
    yearsExperience: formData.get("yearsExperience"),
    availabilityStatus: formData.get("availabilityStatus"),
    bilingualProfile: formData.get("bilingualProfile") === "on",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const d = parsed.data;
  await query(
    `UPDATE developer_profiles SET
      display_name = $1, headline = $2, bio = $3, bio_es = $4,
      country_code = NULLIF($5, ''), city = NULLIF($6, ''),
      timezone = NULLIF($7, ''), years_experience = NULLIF($8, ''),
      availability_status = $9, bilingual_profile = $10
     WHERE id = $11`,
    [
      d.displayName,
      d.headline,
      d.bio || null,
      d.bioEs || null,
      d.countryCode,
      d.city,
      d.timezone,
      d.yearsExperience,
      d.availabilityStatus,
      d.bilingualProfile,
      session.profileId,
    ],
  );

  revalidatePath("/[locale]/(marketplace)/profile/edit", "page");
  return { success: true };
}

// ── Pricing ────────────────────────────────────────────────

export async function updatePricing(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = pricingSchema.safeParse({
    pricingCurrency: formData.get("pricingCurrency"),
    hourlyRateMin: formData.get("hourlyRateMin") || undefined,
    hourlyRateMax: formData.get("hourlyRateMax") || undefined,
    projectBudgetRange: formData.get("projectBudgetRange"),
    freeConsultation: formData.get("freeConsultation") === "on",
    openToNegotiation: formData.get("openToNegotiation") === "on",
    pricingModels: formData.getAll("pricingModels"),
    paymentMethods: formData.getAll("paymentMethods"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const d = parsed.data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE developer_profiles SET
        pricing_currency = $1, hourly_rate_min = $2, hourly_rate_max = $3,
        project_budget_range = NULLIF($4, ''), free_consultation = $5,
        open_to_negotiation = $6
       WHERE id = $7`,
      [
        d.pricingCurrency,
        d.hourlyRateMin || null,
        d.hourlyRateMax || null,
        d.projectBudgetRange,
        d.freeConsultation,
        d.openToNegotiation,
        session.profileId,
      ],
    );

    // Replace pricing models
    await client.query(
      "DELETE FROM developer_pricing_models WHERE developer_id = $1",
      [session.profileId],
    );
    for (const model of d.pricingModels) {
      await client.query(
        "INSERT INTO developer_pricing_models (developer_id, model_type) VALUES ($1, $2)",
        [session.profileId, model],
      );
    }

    // Replace payment methods
    await client.query(
      "DELETE FROM developer_payment_methods WHERE developer_id = $1",
      [session.profileId],
    );
    for (const method of d.paymentMethods) {
      await client.query(
        "INSERT INTO developer_payment_methods (developer_id, method) VALUES ($1, $2)",
        [session.profileId, method],
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("updatePricing error:", err);
    return { success: false, error: "Failed to update pricing" };
  } finally {
    client.release();
  }

  revalidatePath("/[locale]/(marketplace)/profile/edit", "page");
  return { success: true };
}

// ── Work Preferences ───────────────────────────────────────

export async function updateWorkPreferences(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = workPreferencesSchema.safeParse({
    workArrangement: formData.getAll("workArrangement"),
    timeOverlapNote: formData.get("timeOverlapNote"),
    preferredDuration: formData.getAll("preferredDuration"),
    teamPreference: formData.getAll("teamPreference"),
    openToSubcontracting: formData.get("openToSubcontracting") === "on",
    openToBeingSubbed: formData.get("openToBeingSubbed") === "on",
    ndaWilling: formData.get("ndaWilling") === "on",
    contractOpenness: formData.getAll("contractOpenness"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const d = parsed.data;
  await query(
    `UPDATE developer_profiles SET
      work_arrangement = $1, time_overlap_note = NULLIF($2, ''),
      preferred_duration = $3, team_preference = $4,
      open_to_subcontracting = $5, open_to_being_subbed = $6,
      nda_willing = $7, contract_openness = $8
     WHERE id = $9`,
    [
      d.workArrangement,
      d.timeOverlapNote,
      d.preferredDuration,
      d.teamPreference,
      d.openToSubcontracting,
      d.openToBeingSubbed,
      d.ndaWilling,
      d.contractOpenness,
      session.profileId,
    ],
  );

  revalidatePath("/[locale]/(marketplace)/profile/edit", "page");
  return { success: true };
}

// ── Social Links ───────────────────────────────────────────

export async function updateSocialLinks(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = socialLinksSchema.safeParse({
    calendarUrl: formData.get("calendarUrl"),
    websiteUrl: formData.get("websiteUrl"),
    githubUrl: formData.get("githubUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    stackoverflowUrl: formData.get("stackoverflowUrl"),
    twitterUrl: formData.get("twitterUrl"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const d = parsed.data;
  await query(
    `UPDATE developer_profiles SET
      calendar_url = NULLIF($1, ''), website_url = NULLIF($2, ''),
      github_url = NULLIF($3, ''), linkedin_url = NULLIF($4, ''),
      stackoverflow_url = NULLIF($5, ''), twitter_url = NULLIF($6, '')
     WHERE id = $7`,
    [
      d.calendarUrl,
      d.websiteUrl,
      d.githubUrl,
      d.linkedinUrl,
      d.stackoverflowUrl,
      d.twitterUrl,
      session.profileId,
    ],
  );

  revalidatePath("/[locale]/(marketplace)/profile/edit", "page");
  return { success: true };
}

// ── Skills ─────────────────────────────────────────────────

export async function updateSkills(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const rawSkills = formData.get("skills");
  let skillsData: { techTagId: string; skillLevel: string }[];
  try {
    skillsData = JSON.parse(rawSkills as string);
  } catch {
    return { success: false, error: "Invalid skills data" };
  }

  const parsed = skillsSchema.safeParse({ skills: skillsData });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM developer_skills WHERE developer_id = $1",
      [session.profileId],
    );
    for (let i = 0; i < parsed.data.skills.length; i++) {
      const skill = parsed.data.skills[i];
      await client.query(
        `INSERT INTO developer_skills (developer_id, tech_tag_id, skill_level, display_order)
         VALUES ($1, $2, $3, $4)`,
        [session.profileId, skill.techTagId, skill.skillLevel, i],
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("updateSkills error:", err);
    return { success: false, error: "Failed to update skills" };
  } finally {
    client.release();
  }

  revalidatePath("/[locale]/(marketplace)/profile/edit", "page");
  return { success: true };
}

// ── AI Tools ──────────────────────────────────────────────

export async function updateAiTools(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const rawTools = formData.get("aiTools");
  let toolsData: { aiToolId: string; expertiseLevel: string }[];
  try {
    toolsData = JSON.parse(rawTools as string);
  } catch {
    return { success: false, error: "Invalid AI tools data" };
  }

  const parsed = aiToolsSchema.safeParse({ aiTools: toolsData });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM developer_ai_tools WHERE developer_id = $1",
      [session.profileId],
    );
    for (let i = 0; i < parsed.data.aiTools.length; i++) {
      const tool = parsed.data.aiTools[i];
      await client.query(
        `INSERT INTO developer_ai_tools (developer_id, ai_tool_id, expertise_level, display_order)
         VALUES ($1, $2, $3, $4)`,
        [session.profileId, tool.aiToolId, tool.expertiseLevel, i],
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("updateAiTools error:", err);
    return { success: false, error: "Failed to update AI tools" };
  } finally {
    client.release();
  }

  revalidatePath("/[locale]/(marketplace)/profile/edit", "page");
  return { success: true };
}

// ── LatAm ──────────────────────────────────────────────────

export async function updateLatam(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = latamSchema.safeParse({
    taxInvoiceType: formData.get("taxInvoiceType"),
    canInvoiceUsd: formData.get("canInvoiceUsd") === "on",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const d = parsed.data;
  await query(
    `UPDATE developer_profiles SET
      tax_invoice_type = NULLIF($1, ''), can_invoice_usd = $2
     WHERE id = $3`,
    [d.taxInvoiceType, d.canInvoiceUsd, session.profileId],
  );

  revalidatePath("/[locale]/(marketplace)/profile/edit", "page");
  return { success: true };
}

// ── Toggle Published ───────────────────────────────────────

export async function togglePublished(): Promise<ActionResult> {
  const session = await requireSession();

  // First recalculate profile completion
  await queryOne<{ calculate_profile_completion: number }>(
    `SELECT calculate_profile_completion($1)`,
    [session.profileId],
  );

  const result = await queryOne<{ is_published: boolean }>(
    `UPDATE developer_profiles
     SET is_published = NOT is_published,
         profile_completion_pct = calculate_profile_completion($1)
     WHERE id = $1
     RETURNING is_published`,
    [session.profileId],
  );

  revalidatePath("/[locale]/(marketplace)/profile/edit", "page");
  return { success: true };
}
