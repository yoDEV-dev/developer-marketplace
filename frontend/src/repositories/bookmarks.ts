import { query, queryOne } from "@/lib/db";

export interface SavedDeveloper {
  id: string;
  developer_id: string;
  display_name: string;
  headline: string | null;
  profile_photo_url: string | null;
  country_name: string | null;
  avg_rating: number;
  total_reviews: number;
  note: string | null;
  saved_at: string;
}

/** Check if a user has saved a developer */
export async function isBookmarked(
  userId: string,
  developerId: string,
): Promise<boolean> {
  const row = await queryOne<{ exists: boolean }>(
    `SELECT EXISTS(
       SELECT 1 FROM saved_developers
       WHERE user_id = $1 AND developer_id = $2
     ) as exists`,
    [userId, developerId],
  );
  return row?.exists ?? false;
}

/** Save a developer */
export async function saveDeveloper(
  userId: string,
  developerId: string,
  note?: string,
): Promise<void> {
  await query(
    `INSERT INTO saved_developers (user_id, developer_id, note)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, developer_id) DO NOTHING`,
    [userId, developerId, note || null],
  );
}

/** Unsave a developer */
export async function unsaveDeveloper(
  userId: string,
  developerId: string,
): Promise<void> {
  await query(
    `DELETE FROM saved_developers
     WHERE user_id = $1 AND developer_id = $2`,
    [userId, developerId],
  );
}

/** Toggle bookmark (save/unsave) — returns new state */
export async function toggleBookmark(
  userId: string,
  developerId: string,
): Promise<boolean> {
  const saved = await isBookmarked(userId, developerId);
  if (saved) {
    await unsaveDeveloper(userId, developerId);
    return false;
  } else {
    await saveDeveloper(userId, developerId);
    return true;
  }
}

/** Get all saved developers for a user */
export async function getSavedDevelopers(
  userId: string,
): Promise<SavedDeveloper[]> {
  return query<SavedDeveloper>(
    `SELECT
       sd.id,
       sd.developer_id,
       dp.display_name,
       dp.headline,
       dp.profile_photo_url,
       c.name as country_name,
       dp.avg_rating,
       dp.total_reviews,
       sd.note,
       sd.created_at as saved_at
     FROM saved_developers sd
     JOIN developer_profiles dp ON dp.id = sd.developer_id
     LEFT JOIN countries c ON c.id = dp.country_id
     WHERE sd.user_id = $1
     ORDER BY sd.created_at DESC`,
    [userId],
  );
}

/** Get bookmarked developer IDs for a user (for batch checking) */
export async function getBookmarkedIds(
  userId: string,
): Promise<Set<string>> {
  const rows = await query<{ developer_id: string }>(
    `SELECT developer_id FROM saved_developers WHERE user_id = $1`,
    [userId],
  );
  return new Set(rows.map((r) => r.developer_id));
}
