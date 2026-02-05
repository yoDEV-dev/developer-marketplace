"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { reviewSchema } from "@/lib/validation";
import { createReview } from "@/repositories/reviews";

export type ActionResult = {
  success: boolean;
  error?: string;
};

/** Submit a review for a developer */
export async function submitReview(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = reviewSchema.safeParse({
    developerId: formData.get("developerId"),
    ratingOverall: formData.get("ratingOverall"),
    ratingCommunication: formData.get("ratingCommunication") || undefined,
    ratingQuality: formData.get("ratingQuality") || undefined,
    ratingTimeliness: formData.get("ratingTimeliness") || undefined,
    ratingValue: formData.get("ratingValue") || undefined,
    reviewText: formData.get("reviewText"),
    isAnonymous: formData.get("isAnonymous") === "on",
    inquiryId: formData.get("inquiryId") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const d = parsed.data;

  // Prevent self-review
  if (d.developerId === session.profileId) {
    return { success: false, error: "You cannot review yourself" };
  }

  try {
    await createReview({
      developerId: d.developerId,
      reviewerId: session.sub,
      reviewerName: session.name,
      ratingOverall: d.ratingOverall,
      ratingCommunication: d.ratingCommunication,
      ratingQuality: d.ratingQuality,
      ratingTimeliness: d.ratingTimeliness,
      ratingValue: d.ratingValue,
      reviewText: d.reviewText || null,
      isAnonymous: d.isAnonymous,
      inquiryId: d.inquiryId || null,
    });

    revalidatePath("/[locale]/(marketplace)/developers/[id]", "page");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit review";
    console.error("submitReview error:", err);
    return { success: false, error: message };
  }
}
