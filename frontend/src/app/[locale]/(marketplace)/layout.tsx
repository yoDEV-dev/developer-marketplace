import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { getSession } from "@/lib/session";
import { queryOne } from "@/lib/db";

async function getBadgeCounts(profileId: string) {
  try {
    const [{ countPendingInquiries }, { countUnreadMessages }] =
      await Promise.all([
        import("@/repositories/inquiries"),
        import("@/repositories/messages"),
      ]);

    const [inquiries, messages] = await Promise.all([
      countPendingInquiries(profileId),
      countUnreadMessages(profileId),
    ]);

    return { inquiries, messages };
  } catch {
    return { inquiries: 0, messages: 0 };
  }
}

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  let badges = { inquiries: 0, messages: 0 };
  let userForSidebar = session ? { ...session } : null;

  if (process.env.DATABASE_URL && session) {
    const [badgeCounts, profile] = await Promise.all([
      getBadgeCounts(session.profileId),
      queryOne<{ profile_photo_url: string | null }>(
        "SELECT profile_photo_url FROM developer_profiles WHERE id = $1",
        [session.profileId],
      ),
    ]);
    badges = badgeCounts;
    // Use the uploaded profile photo instead of the OIDC avatar
    if (userForSidebar && profile?.profile_photo_url) {
      userForSidebar.picture = profile.profile_photo_url;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar user={userForSidebar} badges={badges} />

      {/* Main Content Area */}
      <main className="lg:pl-64 pb-24 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav badges={badges} />
    </div>
  );
}
