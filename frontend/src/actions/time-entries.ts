"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { timeEntrySchema } from "@/lib/validation";
import {
  logTimeEntry,
  startTimer as dbStartTimer,
  stopTimer as dbStopTimer,
} from "@/repositories/time-entries";

export type ActionResult = {
  success: boolean;
  error?: string;
};

/** Log a manual time entry */
export async function submitTimeEntry(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = timeEntrySchema.safeParse({
    projectName: formData.get("projectName"),
    clientName: formData.get("clientName"),
    entryDate: formData.get("entryDate"),
    hours: formData.get("hours"),
    description: formData.get("description"),
    hourlyRate: formData.get("hourlyRate") || undefined,
    isBillable: formData.get("isBillable") === "on",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const d = parsed.data;

  try {
    await logTimeEntry({
      developerId: session.profileId,
      projectName: d.projectName || null,
      clientName: d.clientName || null,
      entryDate: d.entryDate,
      hours: d.hours,
      description: d.description || null,
      hourlyRate: d.hourlyRate || null,
      isBillable: d.isBillable,
    });

    revalidatePath("/[locale]/(marketplace)/dashboard", "page");
    return { success: true };
  } catch (err) {
    console.error("submitTimeEntry error:", err);
    return { success: false, error: "Failed to log time entry" };
  }
}

/** Start the live timer */
export async function startTimer(
  projectName?: string,
): Promise<ActionResult> {
  const session = await requireSession();

  try {
    await dbStartTimer(session.profileId, projectName);
    revalidatePath("/[locale]/(marketplace)/dashboard", "page");
    return { success: true };
  } catch (err) {
    console.error("startTimer error:", err);
    return { success: false, error: "Failed to start timer" };
  }
}

/** Stop the live timer */
export async function stopTimer(): Promise<ActionResult> {
  const session = await requireSession();

  try {
    const entry = await dbStopTimer(session.profileId);
    if (!entry) {
      return { success: false, error: "No active timer found" };
    }
    revalidatePath("/[locale]/(marketplace)/dashboard", "page");
    return { success: true };
  } catch (err) {
    console.error("stopTimer error:", err);
    return { success: false, error: "Failed to stop timer" };
  }
}
