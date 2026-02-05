import Link from "next/link";

export default function DeveloperNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-6">
        <span className="material-symbols-outlined text-5xl text-muted mb-4 block">
          person_off
        </span>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Developer not found
        </h2>
        <p className="text-sm text-muted mb-6">
          This developer profile doesn&apos;t exist or is no longer available.
        </p>
        <Link
          href="/en/developers"
          className="inline-flex px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          Browse developers
        </Link>
      </div>
    </div>
  );
}
