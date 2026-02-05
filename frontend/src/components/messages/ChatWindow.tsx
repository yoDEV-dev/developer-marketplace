"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { sendMessage } from "@/actions/messages";

interface Participant {
  name: string;
  company?: string;
  avatarUrl?: string;
  online: boolean;
}

interface Conversation {
  id: string;
  participant: Participant;
  project?: string;
}

interface Message {
  id: string;
  senderId: "me" | "other";
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
}

export function ChatWindow({ conversation, messages }: ChatWindowProps) {
  const locale = useLocale();
  const [newMessage, setNewMessage] = useState("");
  const [sending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    msgs.forEach((message) => {
      const messageDate = new Date(message.timestamp).toLocaleDateString(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: messageDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  function handleSend() {
    const body = newMessage.trim();
    if (!body) return;

    setNewMessage("");
    startTransition(async () => {
      await sendMessage(conversation.id, body);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="hidden lg:flex flex-1 flex-col bg-background">
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-background-alt">
              {conversation.participant.avatarUrl ? (
                <Image
                  src={conversation.participant.avatarUrl}
                  alt={conversation.participant.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-muted">person</span>
                </div>
              )}
            </div>
            {conversation.participant.online && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent rounded-full border-2 border-surface" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{conversation.participant.name}</h3>
            <p className="text-xs text-muted">
              {conversation.participant.online ? "Online" : "Offline"}
              {conversation.project && ` • ${conversation.project}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-lg hover:bg-background-alt flex items-center justify-center text-muted hover:text-foreground transition-colors">
            <span className="material-symbols-outlined">videocam</span>
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-background-alt flex items-center justify-center text-muted hover:text-foreground transition-colors">
            <span className="material-symbols-outlined">call</span>
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-background-alt flex items-center justify-center text-muted hover:text-foreground transition-colors">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date Separator */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted font-medium">{group.date}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Messages */}
            <div className="space-y-4">
              {group.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      message.senderId === "me"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-surface border border-border text-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === "me" ? "text-white/70" : "text-muted"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="flex items-end gap-3">
          <button className="w-10 h-10 rounded-lg hover:bg-background-alt flex items-center justify-center text-muted hover:text-foreground transition-colors shrink-0">
            <span className="material-symbols-outlined">attach_file</span>
          </button>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 rounded-xl bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shrink-0 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">
              {sending ? "hourglass_top" : "send"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
