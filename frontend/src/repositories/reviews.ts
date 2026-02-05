import { query, queryOne, pool } from "@/lib/db";

export interface Review {
  id: string;
  developer_id: string;
  reviewer_id: string | null;
  rating_overall: number;
  rating_communication: number | null;
  rating_quality: number | null;
  rating_timeliness: number | null;
  rating_value: number | null;
  review_text: string | null;
  reviewer_name: string | null;
  is_anonymous: boolean;
  inquiry_id: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface ReviewSummary {
  avg_rating: number;
  total_reviews: number;
  avg_communication: number | null;
  avg_quality: number | null;
  avg_timeliness: number | null;
  avg_value: number | null;
}

/** Get reviews for a developer (public, visible only) */
export async function getReviewsForDeveloper(
  developerId: string,
  limit = 20,
  offset = 0,
): Promise<Review[]> {
  return query<Review>(
    `SELECT id, developer_id, reviewer_id, rating_overall,
            rating_communication, rating_quality, rating_timeliness, rating_value,
            review_text, reviewer_name, is_anonymous, inquiry_id, is_verified, created_at
     FROM developer_reviews
     WHERE developer_id = $1 AND is_visible = true
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [developerId, limit, offset],
  );
}

/** Get review summary stats for a developer */
export async function getReviewSummary(
  developerId: string,
): Promise<ReviewSummary> {
  const row = await queryOne<ReviewSummary>(
    `SELECT
       COALESCE(AVG(rating_overall), 0)::numeric(3,2) as avg_rating,
       COUNT(*)::int as total_reviews,
       AVG(rating_communication)::numeric(3,2) as avg_communication,
       AVG(rating_quality)::numeric(3,2) as avg_quality,
       AVG(rating_timeliness)::numeric(3,2) as avg_timeliness,
       AVG(rating_value)::numeric(3,2) as avg_value
     FROM developer_reviews
     WHERE developer_id = $1 AND is_visible = true`,
    [developerId],
  );

  return row || {
    avg_rating: 0,
    total_reviews: 0,
    avg_communication: null,
    avg_quality: null,
    avg_timeliness: null,
    avg_value: null,
  };
}

/** Create a review (transactional — also updates developer stats) */
export async function createReview(data: {
  developerId: string;
  reviewerId: string;
  reviewerName: string;
  ratingOverall: number;
  ratingCommunication?: number | null;
  ratingQuality?: number | null;
  ratingTimeliness?: number | null;
  ratingValue?: number | null;
  reviewText?: string | null;
  isAnonymous?: boolean;
  inquiryId?: string | null;
}): Promise<Review> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // If linked to an inquiry, verify it's completed and belongs to the reviewer
    if (data.inquiryId) {
      const inquiry = await client.query(
        "SELECT status, client_user_id FROM inquiries WHERE id = $1",
        [data.inquiryId],
      );
      if (inquiry.rows.length === 0) throw new Error("Inquiry not found");
      if (inquiry.rows[0].status !== "completed")
        throw new Error("Can only review completed inquiries");
      if (inquiry.rows[0].client_user_id !== data.reviewerId)
        throw new Error("Only the client can leave a review");

      // Check no existing review for this inquiry
      const existing = await client.query(
        "SELECT id FROM developer_reviews WHERE inquiry_id = $1",
        [data.inquiryId],
      );
      if (existing.rows.length > 0)
        throw new Error("Review already exists for this inquiry");
    }

    const result = await client.query(
      `INSERT INTO developer_reviews (
         developer_id, reviewer_id, reviewer_name, rating_overall,
         rating_communication, rating_quality, rating_timeliness, rating_value,
         review_text, is_anonymous, inquiry_id, is_verified
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        data.developerId,
        data.reviewerId,
        data.isAnonymous ? null : data.reviewerName,
        data.ratingOverall,
        data.ratingCommunication || null,
        data.ratingQuality || null,
        data.ratingTimeliness || null,
        data.ratingValue || null,
        data.reviewText || null,
        data.isAnonymous || false,
        data.inquiryId || null,
        !!data.inquiryId, // verified if linked to an inquiry
      ],
    );

    // Recalculate developer avg_rating and total_reviews
    await client.query(
      `UPDATE developer_profiles SET
         avg_rating = (
           SELECT COALESCE(AVG(rating_overall), 0)::numeric(3,2)
           FROM developer_reviews WHERE developer_id = $1 AND is_visible = true
         ),
         total_reviews = (
           SELECT COUNT(*)::int
           FROM developer_reviews WHERE developer_id = $1 AND is_visible = true
         )
       WHERE id = $1`,
      [data.developerId],
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
