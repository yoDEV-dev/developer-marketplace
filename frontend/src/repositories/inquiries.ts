import { query, queryOne, pool } from "@/lib/db";

export interface Inquiry {
  id: string;
  developer_id: string;
  client_user_id: string;
  subject: string;
  description: string;
  project_type_id: string | null;
  project_type_name: string | null;
  budget_range: string | null;
  timeline: string | null;
  status: string;
  responded_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  developer_name?: string;
  client_name?: string;
}

export interface InquiryDetail extends Inquiry {
  developer_name: string;
  developer_photo_url: string | null;
  developer_headline: string;
}

const VALID_STATUSES = [
  "pending",
  "viewed",
  "responded",
  "in_discussion",
  "accepted",
  "declined",
  "completed",
  "cancelled",
] as const;

export type InquiryStatus = (typeof VALID_STATUSES)[number];

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["viewed", "responded", "declined", "cancelled"],
  viewed: ["responded", "declined", "cancelled"],
  responded: ["in_discussion", "accepted", "declined", "cancelled"],
  in_discussion: ["accepted", "declined", "cancelled"],
  accepted: ["completed", "cancelled"],
  declined: [],
  completed: [],
  cancelled: [],
};

export async function createInquiry(data: {
  developerId: string;
  clientUserId: string;
  subject: string;
  description: string;
  projectTypeId?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
}): Promise<Inquiry> {
  const row = await queryOne<Inquiry>(
    `INSERT INTO inquiries (developer_id, client_user_id, subject, description,
       project_type_id, budget_range, timeline)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.developerId,
      data.clientUserId,
      data.subject,
      data.description,
      data.projectTypeId || null,
      data.budgetRange || null,
      data.timeline || null,
    ],
  );
  return row!;
}

/** Get all inquiries received by a developer (inbox) */
export async function getInquiriesForDeveloper(
  developerId: string,
  status?: string,
): Promise<Inquiry[]> {
  const params: unknown[] = [developerId];
  let statusFilter = "";
  if (status && VALID_STATUSES.includes(status as InquiryStatus)) {
    statusFilter = " AND i.status = $2";
    params.push(status);
  }

  return query<Inquiry>(
    `SELECT i.*,
            pt.name as project_type_name
     FROM inquiries i
     LEFT JOIN project_types pt ON i.project_type_id = pt.id
     WHERE i.developer_id = $1${statusFilter}
     ORDER BY
       CASE i.status
         WHEN 'pending' THEN 0
         WHEN 'viewed' THEN 1
         WHEN 'responded' THEN 2
         WHEN 'in_discussion' THEN 3
         WHEN 'accepted' THEN 4
         ELSE 5
       END,
       i.created_at DESC`,
    params,
  );
}

/** Get all inquiries sent by a client */
export async function getInquiriesForClient(
  clientUserId: string,
): Promise<Inquiry[]> {
  return query<Inquiry>(
    `SELECT i.*,
            pt.name as project_type_name,
            dp.display_name as developer_name
     FROM inquiries i
     LEFT JOIN project_types pt ON i.project_type_id = pt.id
     LEFT JOIN developer_profiles dp ON i.developer_id = dp.id
     WHERE i.client_user_id = $1
     ORDER BY i.created_at DESC`,
    [clientUserId],
  );
}

/** Get a single inquiry with developer details */
export async function getInquiryById(
  inquiryId: string,
): Promise<InquiryDetail | null> {
  return queryOne<InquiryDetail>(
    `SELECT i.*,
            pt.name as project_type_name,
            dp.display_name as developer_name,
            dp.profile_photo_url as developer_photo_url,
            dp.headline as developer_headline
     FROM inquiries i
     LEFT JOIN project_types pt ON i.project_type_id = pt.id
     LEFT JOIN developer_profiles dp ON i.developer_id = dp.id
     WHERE i.id = $1`,
    [inquiryId],
  );
}

/** Update inquiry status with transition validation */
export async function updateInquiryStatus(
  inquiryId: string,
  newStatus: InquiryStatus,
  userId: string,
): Promise<Inquiry | null> {
  // Get current inquiry to validate transition
  const current = await queryOne<Inquiry>(
    "SELECT * FROM inquiries WHERE id = $1",
    [inquiryId],
  );

  if (!current) return null;

  // Check the user is the developer or client for this inquiry
  const isDeveloper = current.developer_id === userId;
  const isClient = current.client_user_id === userId;
  if (!isDeveloper && !isClient) return null;

  // Validate status transition
  const allowed = VALID_TRANSITIONS[current.status] || [];
  if (!allowed.includes(newStatus)) return null;

  const extras: string[] = [];
  const params: unknown[] = [newStatus, inquiryId];

  if (newStatus === "responded" && !current.responded_at) {
    extras.push(`responded_at = NOW()`);
  }
  if (newStatus === "completed") {
    extras.push(`completed_at = NOW()`);
  }

  const extraSet = extras.length > 0 ? ", " + extras.join(", ") : "";

  return queryOne<Inquiry>(
    `UPDATE inquiries SET status = $1, updated_at = NOW()${extraSet}
     WHERE id = $2 RETURNING *`,
    params,
  );
}

/** Count pending inquiries for a developer (for badge) */
export async function countPendingInquiries(
  developerId: string,
): Promise<number> {
  const row = await queryOne<{ count: string }>(
    "SELECT COUNT(*) as count FROM inquiries WHERE developer_id = $1 AND status = 'pending'",
    [developerId],
  );
  return parseInt(row?.count || "0", 10);
}
