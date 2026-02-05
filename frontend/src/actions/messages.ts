"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import {
  sendMessage as dbSendMessage,
  markConversationRead,
} from "@/repositories/messages";

export type ActionResult = {
  success: boolean;
  error?: string;
};

/** Send a message in a conversation */
export async function sendMessage(
  conversationId: string,
  body: string,
): Promise<ActionResult> {
  const session = await requireSession();

  if (!body.trim()) {
    return { success: false, error: "Message cannot be empty" };
  }

  if (body.length > 5000) {
    return { success: false, error: "Message too long (max 5000 characters)" };
  }

  try {
    await dbSendMessage(conversationId, session.profileId, body.trim());
    revalidatePath("/[locale]/(marketplace)/messages", "page");
    return { success: true };
  } catch (err) {
    console.error("sendMessage error:", err);
    return { success: false, error: "Failed to send message" };
  }
}

/** Mark a conversation as read */
export async function markRead(
  conversationId: string,
): Promise<ActionResult> {
  const session = await requireSession();

  try {
    await markConversationRead(conversationId, session.profileId);
    revalidatePath("/[locale]/(marketplace)/messages", "page");
    return { success: true };
  } catch (err) {
    console.error("markRead error:", err);
    return { success: false, error: "Failed to mark as read" };
  }
}
