export default function DevelopersLoading() {
  return (
    <div className="p-4 lg:p-6">
      {/* Skeleton filter bar */}
      <div className="h-10 w-48 bg-background-alt rounded-lg animate-pulse mb-6" />

      {/* Skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl border border-border p-5 space-y-4"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full bg-background-alt animate-pulse" />
              <div className="flex-1 space-y-2 py-2">
                <div className="h-4 w-3/4 bg-background-alt rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-background-alt rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-background-alt rounded animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-24 bg-background-alt rounded-full animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-background-alt rounded animate-pulse" />
              <div className="h-6 w-20 bg-background-alt rounded animate-pulse" />
              <div className="h-6 w-14 bg-background-alt rounded animate-pulse" />
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 bg-background-alt rounded animate-pulse" />
              <div className="h-10 w-28 bg-background-alt rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
