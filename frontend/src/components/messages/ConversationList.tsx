"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

interface Participant {
  name: string;
  company?: string;
  avatarUrl?: string;
  online: boolean;
}

interface Conversation {
  id: string;
  participant: Participant;
  lastMessage: {
    text: string;
    timestamp: string;
    unread: boolean;
  };
  project?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const locale = useLocale();
  const t = useTranslations("nav");

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString(locale, { weekday: "short" });
    } else {
      return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="w-full lg:w-80 border-r border-border bg-surface flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">{t("messages")}</h2>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-background-alt border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect?.(conversation.id)}
            className={`w-full p-4 flex gap-3 hover:bg-background-alt transition-colors text-left ${
              selectedId === conversation.id ? "bg-primary/5 border-l-2 border-primary" : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-background-alt">
                {conversation.participant.avatarUrl ? (
                  <Image
                    src={conversation.participant.avatarUrl}
                    alt={conversation.participant.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-muted">person</span>
                  </div>
                )}
              </div>
              {conversation.participant.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-surface" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold truncate ${conversation.lastMessage.unread ? "text-foreground" : "text-muted"}`}>
                  {conversation.participant.name}
                </span>
                <span className="text-xs text-muted shrink-0 ml-2">
                  {formatTime(conversation.lastMessage.timestamp)}
                </span>
              </div>
              {conversation.project && (
                <p className="text-xs text-primary truncate mb-1">{conversation.project}</p>
              )}
              <p className={`text-sm truncate ${conversation.lastMessage.unread ? "text-foreground font-medium" : "text-muted"}`}>
                {conversation.lastMessage.text}
              </p>
            </div>

            {/* Unread Indicator */}
            {conversation.lastMessage.unread && (
              <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
