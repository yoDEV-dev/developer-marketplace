import { getSession } from "@/lib/session";
import { TopBar } from "@/components/layout/TopBar";
import { MessagesContent } from "@/components/messages/MessagesContent";

// Types matching what the components expect
interface Participant {
  name: string;
  company?: string;
  avatarUrl?: string;
  online: boolean;
}

interface ConversationItem {
  id: string;
  participant: Participant;
  lastMessage: {
    text: string;
    timestamp: string;
    unread: boolean;
  };
  project?: string;
}

interface MessageItem {
  id: string;
  senderId: "me" | "other";
  text: string;
  timestamp: string;
}

// Mock data for development without DB
const mockConversations: ConversationItem[] = [
  {
    id: "c1",
    participant: {
      name: "Sarah Chen",
      company: "TechStart Inc.",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      online: true,
    },
    lastMessage: {
      text: "Thanks for the update! The new features look great. When do you think we can have the staging build ready?",
      timestamp: "2026-02-05T14:30:00Z",
      unread: true,
    },
    project: "TechStart Mobile App",
  },
  {
    id: "c2",
    participant: {
      name: "Michael Torres",
      company: "DataSync Corp",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      online: false,
    },
    lastMessage: {
      text: "The API integration is almost complete. Just need to finalize the error handling.",
      timestamp: "2026-02-05T10:15:00Z",
      unread: false,
    },
    project: "API Integration",
  },
  {
    id: "c3",
    participant: {
      name: "Emily Rodriguez",
      company: "ShopFlow",
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      online: true,
    },
    lastMessage: {
      text: "Can we schedule a call to discuss the backend architecture?",
      timestamp: "2026-02-04T16:45:00Z",
      unread: true,
    },
    project: "E-commerce Backend",
  },
  {
    id: "c4",
    participant: {
      name: "David Kim",
      company: "FinanceApp",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      online: false,
    },
    lastMessage: {
      text: "Great work on the dashboard! The client loved it.",
      timestamp: "2026-02-03T09:20:00Z",
      unread: false,
    },
  },
];

const mockMessages: MessageItem[] = [
  {
    id: "m1",
    senderId: "other",
    text: "Hi Mateo! I wanted to check in on the progress of the mobile app.",
    timestamp: "2026-02-05T09:00:00Z",
  },
  {
    id: "m2",
    senderId: "me",
    text: "Hi Sarah! Everything is going well. I've completed the authentication flow and user profile screens.",
    timestamp: "2026-02-05T09:15:00Z",
  },
  {
    id: "m3",
    senderId: "other",
    text: "That's great to hear! Can you share some screenshots?",
    timestamp: "2026-02-05T09:30:00Z",
  },
  {
    id: "m4",
    senderId: "me",
    text: "Of course! I'll send them over shortly. Also, I wanted to discuss the push notification implementation.",
    timestamp: "2026-02-05T10:00:00Z",
  },
  {
    id: "m5",
    senderId: "me",
    text: "I'm thinking of using Firebase Cloud Messaging for cross-platform support. What do you think?",
    timestamp: "2026-02-05T10:01:00Z",
  },
  {
    id: "m6",
    senderId: "other",
    text: "Firebase sounds perfect! We already use it for analytics so it would integrate nicely.",
    timestamp: "2026-02-05T14:00:00Z",
  },
  {
    id: "m7",
    senderId: "other",
    text: "Thanks for the update! The new features look great. When do you think we can have the staging build ready?",
    timestamp: "2026-02-05T14:30:00Z",
  },
];

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedParam = typeof params.c === "string" ? params.c : undefined;

  let conversations: ConversationItem[] = mockConversations;
  let messages: MessageItem[] = mockMessages;

  const session = await getSession();

  if (process.env.DATABASE_URL && session) {
    try {
      const {
        getConversationsForUser,
        getMessages,
        markConversationRead,
      } = await import("@/repositories/messages");

      const dbConversations = await getConversationsForUser(session.profileId);

      if (dbConversations.length > 0) {
        conversations = dbConversations.map((c) => ({
          id: c.id,
          participant: {
            name: c.participant_name,
            avatarUrl: c.participant_avatar || undefined,
            online: false,
          },
          lastMessage: {
            text: c.last_message_body || "",
            timestamp: c.last_message_at || new Date().toISOString(),
            unread: c.unread_count > 0,
          },
          project: c.subject || undefined,
        }));

        const selectedId = selectedParam || conversations[0].id;

        const dbMessages = await getMessages(selectedId);
        messages = dbMessages.map((m) => ({
          id: m.id,
          senderId:
            m.sender_id === session.profileId
              ? ("me" as const)
              : ("other" as const),
          text: m.body,
          timestamp: m.created_at,
        }));

        // Mark selected conversation as read
        await markConversationRead(selectedId, session.profileId);
      } else {
        // No real conversations — show empty state
        conversations = [];
        messages = [];
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      // Fall back to mock data
    }
  }

  const selectedId = selectedParam || conversations[0]?.id || "";

  return (
    <>
      <TopBar showSearch={false} />
      <MessagesContent
        conversations={conversations}
        messages={messages}
        selectedConversationId={selectedId}
      />
    </>
  );
}
