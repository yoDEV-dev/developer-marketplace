export default function DeveloperProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Cover skeleton */}
      <div className="h-48 lg:h-64 bg-background-alt animate-pulse" />

      {/* Profile header skeleton */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-16">
        <div className="flex items-end gap-4 mb-6">
          <div className="w-32 h-32 rounded-2xl bg-surface border-4 border-background animate-pulse" />
          <div className="space-y-2 pb-2">
            <div className="h-6 w-48 bg-background-alt rounded animate-pulse" />
            <div className="h-4 w-32 bg-background-alt rounded animate-pulse" />
          </div>
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Main content skeleton */}
          <div className="flex-1 space-y-6">
            <div className="h-10 w-64 bg-background-alt rounded-lg animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-background-alt rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-background-alt rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-background-alt rounded animate-pulse" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-80 space-y-4 mt-6">
            <div className="h-48 bg-surface border border-border rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
