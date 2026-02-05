import { query, queryOne, pool } from "@/lib/db";

export interface ConversationSummary {
  id: string;
  subject: string | null;
  inquiry_id: string | null;
  participant_name: string;
  participant_avatar: string | null;
  last_message_body: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  is_system: boolean;
  created_at: string;
}

export interface ConversationDetail {
  id: string;
  subject: string | null;
  participant_name: string;
  participant_avatar: string | null;
  participant_user_id: string;
}

/** Get conversations for a user with latest message + unread count */
export async function getConversationsForUser(
  userId: string,
): Promise<ConversationSummary[]> {
  return query<ConversationSummary>(
    `SELECT
       c.id,
       c.subject,
       c.inquiry_id,
       other_p.display_name as participant_name,
       other_p.avatar_url as participant_avatar,
       last_msg.body as last_message_body,
       last_msg.created_at as last_message_at,
       COALESCE(unread.cnt, 0)::int as unread_count
     FROM conversations c
     JOIN conversation_participants my_p
       ON my_p.conversation_id = c.id AND my_p.user_id = $1
     JOIN conversation_participants other_p
       ON other_p.conversation_id = c.id AND other_p.user_id != $1
     LEFT JOIN LATERAL (
       SELECT body, created_at
       FROM messages
       WHERE conversation_id = c.id
       ORDER BY created_at DESC
       LIMIT 1
     ) last_msg ON true
     LEFT JOIN LATERAL (
       SELECT COUNT(*) as cnt
       FROM messages
       WHERE conversation_id = c.id
         AND sender_id != $1
         AND created_at > my_p.last_read_at
     ) unread ON true
     ORDER BY COALESCE(last_msg.created_at, c.created_at) DESC`,
    [userId],
  );
}

/** Get a conversation's details for the current user */
export async function getConversationDetail(
  conversationId: string,
  userId: string,
): Promise<ConversationDetail | null> {
  return queryOne<ConversationDetail>(
    `SELECT
       c.id,
       c.subject,
       other_p.display_name as participant_name,
       other_p.avatar_url as participant_avatar,
       other_p.user_id as participant_user_id
     FROM conversations c
     JOIN conversation_participants my_p
       ON my_p.conversation_id = c.id AND my_p.user_id = $2
     JOIN conversation_participants other_p
       ON other_p.conversation_id = c.id AND other_p.user_id != $2
     WHERE c.id = $1`,
    [conversationId, userId],
  );
}

/** Get messages for a conversation */
export async function getMessages(
  conversationId: string,
  limit = 100,
  before?: string,
): Promise<Message[]> {
  if (before) {
    return query<Message>(
      `SELECT id, conversation_id, sender_id, body, is_system, created_at
       FROM messages
       WHERE conversation_id = $1 AND created_at < $3
       ORDER BY created_at DESC
       LIMIT $2`,
      [conversationId, limit, before],
    );
  }

  const rows = await query<Message>(
    `SELECT id, conversation_id, sender_id, body, is_system, created_at
     FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [conversationId, limit],
  );
  return rows.reverse(); // Return in chronological order
}

/** Send a message */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string,
): Promise<Message> {
  const row = await queryOne<Message>(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [conversationId, senderId, body],
  );

  // Update conversation timestamp
  await query(
    "UPDATE conversations SET updated_at = NOW() WHERE id = $1",
    [conversationId],
  );

  return row!;
}

/** Mark a conversation as read for a user */
export async function markConversationRead(
  conversationId: string,
  userId: string,
): Promise<void> {
  await query(
    `UPDATE conversation_participants
     SET last_read_at = NOW()
     WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, userId],
  );
}

/** Get or create a conversation between two users */
export async function getOrCreateConversation(
  userId: string,
  userName: string,
  userAvatar: string | null,
  otherUserId: string,
  otherUserName: string,
  otherUserAvatar: string | null,
  subject?: string | null,
  inquiryId?: string | null,
): Promise<string> {
  // Check for existing conversation between these two users
  const existing = await queryOne<{ conversation_id: string }>(
    `SELECT cp1.conversation_id
     FROM conversation_participants cp1
     JOIN conversation_participants cp2
       ON cp1.conversation_id = cp2.conversation_id
     WHERE cp1.user_id = $1 AND cp2.user_id = $2
     LIMIT 1`,
    [userId, otherUserId],
  );

  if (existing) return existing.conversation_id;

  // Create new conversation
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const conv = await client.query(
      `INSERT INTO conversations (subject, inquiry_id)
       VALUES ($1, $2) RETURNING id`,
      [subject || null, inquiryId || null],
    );
    const conversationId = conv.rows[0].id;

    await client.query(
      `INSERT INTO conversation_participants (conversation_id, user_id, display_name, avatar_url)
       VALUES ($1, $2, $3, $4), ($1, $5, $6, $7)`,
      [
        conversationId,
        userId, userName, userAvatar,
        otherUserId, otherUserName, otherUserAvatar,
      ],
    );

    await client.query("COMMIT");
    return conversationId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/** Count total unread messages across all conversations */
export async function countUnreadMessages(
  userId: string,
): Promise<number> {
  const row = await queryOne<{ total: string }>(
    `SELECT COALESCE(SUM(unread.cnt), 0) as total
     FROM conversation_participants cp
     CROSS JOIN LATERAL (
       SELECT COUNT(*) as cnt
       FROM messages m
       WHERE m.conversation_id = cp.conversation_id
         AND m.sender_id != $1
         AND m.created_at > cp.last_read_at
     ) unread
     WHERE cp.user_id = $1`,
    [userId],
  );
  return parseInt(row?.total || "0", 10);
}
