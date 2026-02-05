import { TopBar } from "@/components/layout/TopBar";
import { getSession } from "@/lib/session";
import { InquiryInbox } from "@/components/inquiries/InquiryInbox";
import type { Inquiry } from "@/repositories/inquiries";

// Mock data for when DB is not connected
const mockInquiries: Inquiry[] = [
  {
    id: "inq-1",
    developer_id: "1",
    client_user_id: "client-1",
    subject: "Need a React developer for SaaS dashboard",
    description:
      "We're building a B2B analytics dashboard and need an experienced React developer familiar with data visualization libraries (D3, Recharts). The project is expected to take 2-3 months.",
    project_type_id: null,
    project_type_name: "Web Application",
    budget_range: "$5,000 - $15,000",
    timeline: "1-3 months",
    status: "pending",
    responded_at: null,
    completed_at: null,
    created_at: "2026-02-04T10:30:00Z",
    updated_at: "2026-02-04T10:30:00Z",
  },
  {
    id: "inq-2",
    developer_id: "1",
    client_user_id: "client-2",
    subject: "Mobile app for food delivery startup",
    description:
      "Looking for a full-stack developer to build a React Native food delivery app with real-time tracking, payment integration (Stripe), and push notifications.",
    project_type_id: null,
    project_type_name: "Mobile App",
    budget_range: "$15,000 - $50,000",
    timeline: "3-6 months",
    status: "responded",
    responded_at: "2026-02-02T14:00:00Z",
    completed_at: null,
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-02-02T14:00:00Z",
  },
  {
    id: "inq-3",
    developer_id: "1",
    client_user_id: "client-3",
    subject: "API integration consulting",
    description:
      "Need help integrating multiple third-party APIs (Twilio, SendGrid, Stripe) into our existing Node.js backend. Short-term engagement.",
    project_type_id: null,
    project_type_name: "API Development",
    budget_range: "$1,000 - $5,000",
    timeline: "< 1 month",
    status: "completed",
    responded_at: "2026-01-20T11:00:00Z",
    completed_at: "2026-01-28T16:00:00Z",
    created_at: "2026-01-18T08:00:00Z",
    updated_at: "2026-01-28T16:00:00Z",
  },
];

export default async function InquiriesPage() {
  const session = await getSession();

  let inquiries = mockInquiries;

  if (process.env.DATABASE_URL && session) {
    try {
      const { getInquiriesForDeveloper } = await import(
        "@/repositories/inquiries"
      );
      inquiries = await getInquiriesForDeveloper(session.profileId);
    } catch {
      // Fall back to mock data
    }
  }

  return (
    <>
      <TopBar showSearch={false} />

      <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
            <p className="text-sm text-muted mt-1">
              {inquiries.length} total inquiry{inquiries.length !== 1 ? "ies" : ""}
            </p>
          </div>
        </div>

        <InquiryInbox inquiries={inquiries} />
      </div>
    </>
  );
}
