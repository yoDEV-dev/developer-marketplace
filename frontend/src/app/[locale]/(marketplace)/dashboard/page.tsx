import { TopBar } from "@/components/layout/TopBar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ActiveProjects } from "@/components/dashboard/ActiveProjects";
import { TimeTracker } from "@/components/dashboard/TimeTracker";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { getSession } from "@/lib/session";

// Mock data — used when DB is not connected
const mockUser = {
  name: "Mateo",
  profileCompletion: 85,
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
};

const mockStats = {
  earnings: { amount: 4250, change: 12, period: "this month" },
  hours: { amount: 42, change: 8, period: "this week" },
  views: { amount: 156, change: 23, period: "this week" },
  activeProjects: 3,
};

const mockProjects = [
  {
    id: "p1",
    name: "TechStart Mobile App",
    client: "TechStart Inc.",
    progress: 75,
    hoursLogged: 32,
    hoursEstimated: 45,
    status: "in_progress" as const,
    dueDate: "2026-02-20",
  },
  {
    id: "p2",
    name: "E-commerce Backend",
    client: "ShopFlow",
    progress: 40,
    hoursLogged: 18,
    hoursEstimated: 60,
    status: "in_progress" as const,
    dueDate: "2026-03-15",
  },
  {
    id: "p3",
    name: "API Integration",
    client: "DataSync Corp",
    progress: 90,
    hoursLogged: 12,
    hoursEstimated: 15,
    status: "review" as const,
    dueDate: "2026-02-10",
  },
];

const mockDeadlines = [
  { id: "d1", task: "Submit API documentation", project: "E-commerce Backend", date: "2026-02-07", priority: "high" as const },
  { id: "d2", task: "Code review meeting", project: "TechStart Mobile App", date: "2026-02-08", priority: "medium" as const },
  { id: "d3", task: "Deploy staging build", project: "API Integration", date: "2026-02-10", priority: "high" as const },
];

export default async function DashboardPage() {
  const session = await getSession();

  let user = mockUser;
  let stats = mockStats;
  let activeTimer = null;
  let weeklyHours = 0;

  if (process.env.DATABASE_URL && session) {
    try {
      const [
        { getDashboardStats },
        { getActiveTimer, getCurrentWeekSummary },
        { getEditableProfile },
      ] = await Promise.all([
        import("@/repositories/analytics"),
        import("@/repositories/time-entries"),
        import("@/repositories/profile"),
      ]);

      const [dbStats, timer, weeklySummary, profile] = await Promise.all([
        getDashboardStats(session.profileId),
        getActiveTimer(session.profileId),
        getCurrentWeekSummary(session.profileId),
        getEditableProfile(session.profileId),
      ]);

      stats = dbStats;
      activeTimer = timer;
      weeklyHours = weeklySummary.total_hours;

      if (profile) {
        user = {
          name: profile.display_name.split(" ")[0],
          profileCompletion: profile.profile_completion_pct,
          avatarUrl: profile.profile_photo_url || "",
        };
      }
    } catch {
      // Fall back to mock data
    }
  }

  return (
    <>
      <TopBar showSearch={false} />

      <div className="p-4 lg:p-6 space-y-6">
        <DashboardHeader user={user} />

        <StatsGrid stats={stats} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <ActiveProjects projects={mockProjects} />
            <TimeTracker
              projects={mockProjects}
              activeTimer={activeTimer}
              weeklyHours={weeklyHours}
            />
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            <QuickActions />
            <UpcomingDeadlines deadlines={mockDeadlines} />
          </div>
        </div>
      </div>
    </>
  );
}
