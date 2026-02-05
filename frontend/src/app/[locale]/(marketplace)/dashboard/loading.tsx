export default function DashboardLoading() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-background-alt rounded animate-pulse" />
        <div className="h-4 w-64 bg-background-alt rounded animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl border border-border p-4 space-y-3"
          >
            <div className="h-4 w-20 bg-background-alt rounded animate-pulse" />
            <div className="h-8 w-24 bg-background-alt rounded animate-pulse" />
            <div className="h-3 w-16 bg-background-alt rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border p-6 h-64 animate-pulse" />
        <div className="bg-surface rounded-xl border border-border p-6 h-64 animate-pulse" />
      </div>
    </div>
  );
}
