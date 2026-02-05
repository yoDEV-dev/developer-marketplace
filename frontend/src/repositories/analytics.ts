import { query, queryOne } from "@/lib/db";

export interface DashboardStats {
  earnings: { amount: number; change: number; period: string };
  hours: { amount: number; change: number; period: string };
  views: { amount: number; change: number; period: string };
  activeProjects: number;
}

/** Record a profile view event */
export async function recordProfileView(
  developerId: string,
  viewerUserId?: string | null,
  source?: string,
): Promise<void> {
  await query(
    `INSERT INTO profile_view_events (developer_id, viewer_user_id, source)
     VALUES ($1, $2, $3)`,
    [developerId, viewerUserId || null, source || "directory"],
  );

  // Upsert daily stats
  await query(
    `INSERT INTO profile_stats_daily (developer_id, stat_date, profile_views)
     VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (developer_id, stat_date)
     DO UPDATE SET profile_views = profile_stats_daily.profile_views + 1`,
    [developerId],
  );
}

/** Get profile views this week for a developer */
export async function getWeeklyViews(developerId: string): Promise<number> {
  const row = await queryOne<{ total: string }>(
    `SELECT COALESCE(SUM(profile_views), 0) as total
     FROM profile_stats_daily
     WHERE developer_id = $1
       AND stat_date >= date_trunc('week', CURRENT_DATE)`,
    [developerId],
  );
  return parseInt(row?.total || "0", 10);
}

/** Get profile views last week (for % change calc) */
export async function getLastWeekViews(developerId: string): Promise<number> {
  const row = await queryOne<{ total: string }>(
    `SELECT COALESCE(SUM(profile_views), 0) as total
     FROM profile_stats_daily
     WHERE developer_id = $1
       AND stat_date >= date_trunc('week', CURRENT_DATE) - INTERVAL '7 days'
       AND stat_date < date_trunc('week', CURRENT_DATE)`,
    [developerId],
  );
  return parseInt(row?.total || "0", 10);
}

/** Count active inquiries (accepted status) for a developer */
export async function countActiveInquiries(
  developerId: string,
): Promise<number> {
  const row = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM inquiries
     WHERE developer_id = $1 AND status = 'accepted'`,
    [developerId],
  );
  return parseInt(row?.count || "0", 10);
}

/** Assemble full dashboard stats */
export async function getDashboardStats(
  developerId: string,
): Promise<DashboardStats> {
  // Run all queries in parallel
  const [
    weeklyViews,
    lastWeekViews,
    activeCount,
    monthlyEarningsRow,
    lastMonthEarningsRow,
    weeklyHoursRow,
    lastWeekHoursRow,
  ] = await Promise.all([
    getWeeklyViews(developerId),
    getLastWeekViews(developerId),
    countActiveInquiries(developerId),
    queryOne<{ total: string }>(
      `SELECT COALESCE(SUM(hours * hourly_rate), 0) as total
       FROM time_entries
       WHERE developer_id = $1 AND is_billable = true AND hourly_rate IS NOT NULL
         AND entry_date >= date_trunc('month', CURRENT_DATE)`,
      [developerId],
    ),
    queryOne<{ total: string }>(
      `SELECT COALESCE(SUM(hours * hourly_rate), 0) as total
       FROM time_entries
       WHERE developer_id = $1 AND is_billable = true AND hourly_rate IS NOT NULL
         AND entry_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
         AND entry_date < date_trunc('month', CURRENT_DATE)`,
      [developerId],
    ),
    queryOne<{ total: string }>(
      `SELECT COALESCE(SUM(hours), 0) as total
       FROM time_entries
       WHERE developer_id = $1
         AND entry_date >= date_trunc('week', CURRENT_DATE)`,
      [developerId],
    ),
    queryOne<{ total: string }>(
      `SELECT COALESCE(SUM(hours), 0) as total
       FROM time_entries
       WHERE developer_id = $1
         AND entry_date >= date_trunc('week', CURRENT_DATE) - INTERVAL '7 days'
         AND entry_date < date_trunc('week', CURRENT_DATE)`,
      [developerId],
    ),
  ]);

  const monthlyEarnings = parseFloat(monthlyEarningsRow?.total || "0");
  const lastMonthEarnings = parseFloat(lastMonthEarningsRow?.total || "0");
  const weeklyHours = parseFloat(weeklyHoursRow?.total || "0");
  const lastWeekHours = parseFloat(lastWeekHoursRow?.total || "0");

  function percentChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  return {
    earnings: {
      amount: Math.round(monthlyEarnings),
      change: percentChange(monthlyEarnings, lastMonthEarnings),
      period: "this month",
    },
    hours: {
      amount: Math.round(weeklyHours * 10) / 10,
      change: percentChange(weeklyHours, lastWeekHours),
      period: "this week",
    },
    views: {
      amount: weeklyViews,
      change: percentChange(weeklyViews, lastWeekViews),
      period: "this week",
    },
    activeProjects: activeCount,
  };
}
