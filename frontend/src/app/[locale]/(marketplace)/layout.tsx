import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { getSession } from "@/lib/session";

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
  if (process.env.DATABASE_URL && session) {
    badges = await getBadgeCounts(session.profileId);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar user={session} badges={badges} />

      {/* Main Content Area */}
      <main className="lg:pl-64 pb-24 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav badges={badges} />
    </div>
  );
}
