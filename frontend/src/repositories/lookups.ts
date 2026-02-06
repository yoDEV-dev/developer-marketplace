import { query } from "@/lib/db";

export interface TechTag {
  id: string;
  name: string;
  category: string | null;
}

export interface Specialization {
  id: string;
  name: string;
}

export interface Industry {
  id: string;
  name: string;
}

export interface ProjectType {
  id: string;
  name: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Country {
  code: string;
  name: string;
  flag_emoji: string | null;
  region: string | null;
  is_latam: boolean;
}

export async function getTechTags(): Promise<TechTag[]> {
  return query<TechTag>(
    "SELECT id, name, category FROM tech_tags WHERE is_active = true ORDER BY category, name",
  );
}

export async function getSpecializations(): Promise<Specialization[]> {
  return query<Specialization>(
    "SELECT id, name FROM specializations WHERE is_active = true ORDER BY display_order",
  );
}

export async function getIndustries(): Promise<Industry[]> {
  return query<Industry>(
    "SELECT id, name FROM industries WHERE is_active = true ORDER BY display_order",
  );
}

export async function getProjectTypes(): Promise<ProjectType[]> {
  return query<ProjectType>(
    "SELECT id, name FROM project_types WHERE is_active = true ORDER BY display_order",
  );
}

export async function getCurrencies(): Promise<Currency[]> {
  return query<Currency>(
    "SELECT code, name, symbol FROM currencies WHERE is_active = true ORDER BY code",
  );
}

export async function getCountries(): Promise<Country[]> {
  return query<Country>(
    "SELECT code, name, flag_emoji, region, is_latam FROM countries ORDER BY is_latam DESC, name",
  );
}

export interface AiTool {
  id: string;
  name: string;
  category: string | null;
}

export async function getAiTools(): Promise<AiTool[]> {
  return query<AiTool>(
    "SELECT id, name, category FROM ai_tools WHERE is_active = true ORDER BY display_order, name",
  );
}
