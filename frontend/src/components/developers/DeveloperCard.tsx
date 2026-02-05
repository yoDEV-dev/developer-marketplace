import Link from "next/link";
import Image from "next/image";

interface DeveloperCardProps {
  id: string;
  name: string;
  headline: string;
  photoUrl?: string;
  countryFlag?: string;
  rating: number;
  reviewCount: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  availability: "available" | "limited" | "booked" | "not_taking_work";
  skills: string[];
  isFavorite?: boolean;
}

const availabilityConfig = {
  available: {
    label: "Available Now",
    bgColor: "bg-accent/10",
    textColor: "text-accent",
    dotColor: "bg-accent",
    animate: true,
  },
  limited: {
    label: "Limited Availability",
    bgColor: "bg-warning/10",
    textColor: "text-warning",
    dotColor: "bg-warning",
    animate: false,
  },
  booked: {
    label: "Currently Booked",
    bgColor: "bg-muted/10",
    textColor: "text-muted",
    dotColor: "bg-muted",
    animate: false,
  },
  not_taking_work: {
    label: "Not Taking Work",
    bgColor: "bg-muted/10",
    textColor: "text-muted",
    dotColor: "bg-muted",
    animate: false,
  },
};

export function DeveloperCard({
  id,
  name,
  headline,
  photoUrl,
  countryFlag,
  rating,
  reviewCount,
  hourlyRateMin,
  hourlyRateMax,
  availability,
  skills,
  isFavorite = false,
}: DeveloperCardProps) {
  const availConfig = availabilityConfig[availability];
  const displayedSkills = skills.slice(0, 3);
  const remainingSkills = skills.length - 3;

  return (
    <div className="flex flex-col bg-surface rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex gap-4">
          {/* Avatar with availability indicator */}
          <div className="relative w-20 h-20 shrink-0">
            <div className="w-20 h-20 rounded-full border-2 border-primary/20 overflow-hidden bg-background-alt">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  <span className="material-symbols-outlined text-3xl">person</span>
                </div>
              )}
            </div>
            <div
              className={`absolute bottom-1 right-1 w-4 h-4 ${availConfig.dotColor} rounded-full border-2 border-surface`}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1 gap-1">
            <div className="flex justify-between items-start">
              <h3 className="text-foreground text-lg font-bold leading-tight">
                {name} {countryFlag}
              </h3>
              <button className="text-muted hover:text-error transition-colors">
                <span className={`material-symbols-outlined ${isFavorite ? "fill text-error" : ""}`}>
                  favorite
                </span>
              </button>
            </div>
            <p className="text-primary text-sm font-semibold">{headline}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-accent">
                <span className="material-symbols-outlined fill text-sm">star</span>
                <span className="text-xs font-bold ml-1">{rating.toFixed(1)}</span>
              </div>
              <span className="text-muted text-xs">({reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${availConfig.bgColor} ${availConfig.textColor} w-fit`}
        >
          <span
            className={`w-2 h-2 rounded-full ${availConfig.dotColor} ${
              availConfig.animate ? "animate-pulse" : ""
            }`}
          />
          <span className="text-[11px] font-bold uppercase tracking-wide">
            {availConfig.label}
          </span>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-2">
          {displayedSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold"
            >
              {skill}
            </span>
          ))}
          {remainingSkills > 0 && (
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold">
              +{remainingSkills}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border-light" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hourlyRateMin && hourlyRateMax ? (
              <>
                <p className="text-foreground text-base font-bold">
                  ${hourlyRateMin} - ${hourlyRateMax}
                </p>
                <p className="text-muted text-[10px] font-medium uppercase tracking-tight">
                  Hourly Rate Range
                </p>
              </>
            ) : (
              <p className="text-muted text-sm">Project-based pricing</p>
            )}
          </div>
          <Link
            href={`/developers/${id}`}
            className="flex items-center justify-center min-w-[120px] h-10 px-4 bg-primary text-white text-sm font-bold rounded-full shadow-md hover:bg-primary-dark transition-colors"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
