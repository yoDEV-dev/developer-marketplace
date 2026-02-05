"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";

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

interface MessagesContentProps {
  conversations: ConversationItem[];
  messages: MessageItem[];
  selectedConversationId: string;
}

export function MessagesContent({
  conversations,
  messages,
  selectedConversationId,
}: MessagesContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Polling: refresh data every 5 seconds for near-real-time messaging
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) ||
    conversations[0];

  function handleSelect(id: string) {
    router.push(`${pathname}?c=${id}`, { scroll: false });
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-muted mb-4 block">
            chat_bubble_outline
          </span>
          <p className="text-muted">No conversations yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem-6rem)] lg:h-[calc(100vh-4rem)]">
      <ConversationList
        conversations={conversations}
        selectedId={selectedConversationId}
        onSelect={handleSelect}
      />

      {selectedConversation && (
        <ChatWindow
          conversation={selectedConversation}
          messages={messages}
        />
      )}
    </div>
  );
}
