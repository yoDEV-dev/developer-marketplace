"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { toggleBookmark as dbToggleBookmark } from "@/repositories/bookmarks";

export type ActionResult = {
  success: boolean;
  bookmarked?: boolean;
  error?: string;
};

/** Toggle a developer bookmark (save/unsave) */
export async function toggleBookmark(
  developerId: string,
): Promise<ActionResult> {
  const session = await requireSession();

  if (developerId === session.profileId) {
    return { success: false, error: "Cannot bookmark yourself" };
  }

  try {
    const bookmarked = await dbToggleBookmark(session.profileId, developerId);
    revalidatePath("/[locale]/(marketplace)/developers", "page");
    return { success: true, bookmarked };
  } catch (err) {
    console.error("toggleBookmark error:", err);
    return { success: false, error: "Failed to update bookmark" };
  }
}
