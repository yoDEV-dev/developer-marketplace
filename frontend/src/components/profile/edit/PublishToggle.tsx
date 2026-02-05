"use client";

import { useTransition } from "react";
import { togglePublished } from "@/actions/profile";

interface Props {
  isPublished: boolean;
}

export function PublishToggle({ isPublished }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => { await togglePublished(); })}
      disabled={pending}
      className={`flex items-center gap-2 h-10 px-4 rounded-full font-bold text-sm transition-colors ${
        isPublished
          ? "bg-success/10 text-success"
          : "bg-warning/10 text-warning"
      } disabled:opacity-50`}
    >
      <span className="material-symbols-outlined text-[18px]">
        {isPublished ? "visibility" : "visibility_off"}
      </span>
      {pending ? "..." : isPublished ? "Published" : "Draft"}
    </button>
  );
}
