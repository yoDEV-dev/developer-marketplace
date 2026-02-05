export default function MessagesLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem-6rem)] lg:h-[calc(100vh-4rem)]">
      {/* Conversation list skeleton */}
      <div className="w-full lg:w-80 border-r border-border bg-surface">
        <div className="p-4 border-b border-border">
          <div className="h-6 w-24 bg-background-alt rounded animate-pulse" />
        </div>
        <div className="p-3 border-b border-border">
          <div className="h-10 w-full bg-background-alt rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1 p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-3">
              <div className="w-12 h-12 rounded-full bg-background-alt animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-background-alt rounded animate-pulse" />
                <div className="h-3 w-full bg-background-alt rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat window skeleton (desktop only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  );
}
