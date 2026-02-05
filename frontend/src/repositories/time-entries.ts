import { query, queryOne, pool } from "@/lib/db";

export interface TimeEntry {
  id: string;
  developer_id: string;
  inquiry_id: string | null;
  project_name: string | null;
  client_name: string | null;
  entry_date: string;
  hours: number;
  description: string | null;
  hourly_rate: number | null;
  currency: string;
  is_billable: boolean;
  is_invoiced: boolean;
  timer_started_at: string | null;
  timer_stopped_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeeklySummary {
  week_start: string;
  total_hours: number;
  billable_hours: number;
  total_earnings: number;
  projects_count: number;
}

/** Log a manual time entry */
export async function logTimeEntry(data: {
  developerId: string;
  inquiryId?: string | null;
  projectName?: string | null;
  clientName?: string | null;
  entryDate: string;
  hours: number;
  description?: string | null;
  hourlyRate?: number | null;
  currency?: string;
  isBillable?: boolean;
}): Promise<TimeEntry> {
  const row = await queryOne<TimeEntry>(
    `INSERT INTO time_entries (
       developer_id, inquiry_id, project_name, client_name,
       entry_date, hours, description, hourly_rate, currency, is_billable
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      data.developerId,
      data.inquiryId || null,
      data.projectName || null,
      data.clientName || null,
      data.entryDate,
      data.hours,
      data.description || null,
      data.hourlyRate || null,
      data.currency || "USD",
      data.isBillable ?? true,
    ],
  );
  return row!;
}

/** Get time entries for a developer, most recent first */
export async function getEntriesForDeveloper(
  developerId: string,
  limit = 50,
  offset = 0,
): Promise<TimeEntry[]> {
  return query<TimeEntry>(
    `SELECT * FROM time_entries
     WHERE developer_id = $1
     ORDER BY entry_date DESC, created_at DESC
     LIMIT $2 OFFSET $3`,
    [developerId, limit, offset],
  );
}

/** Get entries for a specific week */
export async function getEntriesForWeek(
  developerId: string,
  weekStart: string,
): Promise<TimeEntry[]> {
  return query<TimeEntry>(
    `SELECT * FROM time_entries
     WHERE developer_id = $1
       AND entry_date >= $2::date
       AND entry_date < ($2::date + INTERVAL '7 days')
     ORDER BY entry_date, created_at`,
    [developerId, weekStart],
  );
}

/** Start a live timer — creates a pending time entry */
export async function startTimer(
  developerId: string,
  projectName?: string | null,
  clientName?: string | null,
): Promise<TimeEntry> {
  // Stop any existing active timer first
  await query(
    `UPDATE time_entries
     SET timer_stopped_at = NOW(),
         hours = EXTRACT(EPOCH FROM (NOW() - timer_started_at)) / 3600.0,
         entry_date = (timer_started_at AT TIME ZONE 'UTC')::date
     WHERE developer_id = $1 AND timer_started_at IS NOT NULL AND timer_stopped_at IS NULL`,
    [developerId],
  );

  const row = await queryOne<TimeEntry>(
    `INSERT INTO time_entries (
       developer_id, project_name, client_name,
       entry_date, hours, timer_started_at
     ) VALUES ($1, $2, $3, CURRENT_DATE, 0, NOW())
     RETURNING *`,
    [developerId, projectName || null, clientName || null],
  );
  return row!;
}

/** Stop the active timer and calculate hours */
export async function stopTimer(
  developerId: string,
): Promise<TimeEntry | null> {
  return queryOne<TimeEntry>(
    `UPDATE time_entries
     SET timer_stopped_at = NOW(),
         hours = EXTRACT(EPOCH FROM (NOW() - timer_started_at)) / 3600.0,
         entry_date = (timer_started_at AT TIME ZONE 'UTC')::date
     WHERE developer_id = $1 AND timer_started_at IS NOT NULL AND timer_stopped_at IS NULL
     RETURNING *`,
    [developerId],
  );
}

/** Get the currently active timer (if any) */
export async function getActiveTimer(
  developerId: string,
): Promise<TimeEntry | null> {
  return queryOne<TimeEntry>(
    `SELECT * FROM time_entries
     WHERE developer_id = $1 AND timer_started_at IS NOT NULL AND timer_stopped_at IS NULL
     LIMIT 1`,
    [developerId],
  );
}

/** Get weekly summary for the current week */
export async function getCurrentWeekSummary(
  developerId: string,
): Promise<WeeklySummary> {
  const row = await queryOne<{
    total_hours: string;
    billable_hours: string;
    total_earnings: string;
    projects_count: string;
  }>(
    `SELECT
       COALESCE(SUM(hours), 0) as total_hours,
       COALESCE(SUM(CASE WHEN is_billable THEN hours ELSE 0 END), 0) as billable_hours,
       COALESCE(SUM(CASE WHEN is_billable AND hourly_rate IS NOT NULL THEN hours * hourly_rate ELSE 0 END), 0) as total_earnings,
       COUNT(DISTINCT COALESCE(project_name, inquiry_id::text)) as projects_count
     FROM time_entries
     WHERE developer_id = $1
       AND entry_date >= date_trunc('week', CURRENT_DATE)
       AND entry_date < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'`,
    [developerId],
  );

  return {
    week_start: new Date().toISOString(),
    total_hours: parseFloat(row?.total_hours || "0"),
    billable_hours: parseFloat(row?.billable_hours || "0"),
    total_earnings: parseFloat(row?.total_earnings || "0"),
    projects_count: parseInt(row?.projects_count || "0", 10),
  };
}

/** Get total hours logged this month */
export async function getMonthlyHours(
  developerId: string,
): Promise<number> {
  const row = await queryOne<{ total: string }>(
    `SELECT COALESCE(SUM(hours), 0) as total
     FROM time_entries
     WHERE developer_id = $1
       AND entry_date >= date_trunc('month', CURRENT_DATE)`,
    [developerId],
  );
  return parseFloat(row?.total || "0");
}

/** Get total earnings this month */
export async function getMonthlyEarnings(
  developerId: string,
): Promise<number> {
  const row = await queryOne<{ total: string }>(
    `SELECT COALESCE(SUM(hours * hourly_rate), 0) as total
     FROM time_entries
     WHERE developer_id = $1
       AND is_billable = true
       AND hourly_rate IS NOT NULL
       AND entry_date >= date_trunc('month', CURRENT_DATE)`,
    [developerId],
  );
  return parseFloat(row?.total || "0");
}
