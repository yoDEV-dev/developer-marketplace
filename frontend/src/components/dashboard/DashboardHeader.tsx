"use client";

import Image from "next/image";

interface User {
  name: string;
  profileCompletion: number;
  avatarUrl?: string;
}

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-background-alt shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-muted">person</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted text-sm mt-1">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>

        <div className="sm:text-right">
          <div className="flex items-center gap-2 sm:justify-end">
            <span className="text-sm text-muted">Profile completion</span>
            <span className="text-sm font-bold text-primary">{user.profileCompletion}%</span>
          </div>
          <div className="w-full sm:w-48 h-2 bg-background-alt rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${user.profileCompletion}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
