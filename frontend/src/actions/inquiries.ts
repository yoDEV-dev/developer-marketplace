"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { inquirySchema } from "@/lib/validation";
import {
  createInquiry,
  updateInquiryStatus,
  type InquiryStatus,
} from "@/repositories/inquiries";

export type ActionResult = {
  success: boolean;
  error?: string;
  inquiryId?: string;
};

/** Submit a new inquiry to a developer */
export async function submitInquiry(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = inquirySchema.safeParse({
    developerId: formData.get("developerId"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    projectTypeId: formData.get("projectTypeId") || undefined,
    budgetRange: formData.get("budgetRange") || undefined,
    timeline: formData.get("timeline") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const d = parsed.data;

  // Prevent self-inquiry
  if (d.developerId === session.profileId) {
    return { success: false, error: "You cannot send an inquiry to yourself" };
  }

  try {
    const inquiry = await createInquiry({
      developerId: d.developerId,
      clientUserId: session.sub,
      subject: d.subject,
      description: d.description,
      projectTypeId: d.projectTypeId || null,
      budgetRange: d.budgetRange || null,
      timeline: d.timeline || null,
    });

    revalidatePath("/[locale]/(marketplace)/inquiries", "page");
    return { success: true, inquiryId: inquiry.id };
  } catch (err) {
    console.error("submitInquiry error:", err);
    return { success: false, error: "Failed to submit inquiry" };
  }
}

/** Update inquiry status (for developer responding, accepting, etc.) */
export async function changeInquiryStatus(
  inquiryId: string,
  newStatus: InquiryStatus,
): Promise<ActionResult> {
  const session = await requireSession();

  try {
    const updated = await updateInquiryStatus(
      inquiryId,
      newStatus,
      session.profileId,
    );

    if (!updated) {
      return { success: false, error: "Invalid status transition or unauthorized" };
    }

    revalidatePath("/[locale]/(marketplace)/inquiries", "page");
    return { success: true };
  } catch (err) {
    console.error("changeInquiryStatus error:", err);
    return { success: false, error: "Failed to update status" };
  }
}
