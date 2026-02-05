import { TopBar } from "@/components/layout/TopBar";
import { FilterSidebar } from "@/components/developers/FilterSidebar";
import { DevelopersContent } from "@/components/developers/DevelopersContent";
import { MobileFilterChips } from "@/components/developers/MobileFilterChips";
import {
  searchDevelopers,
  type DeveloperSearchFilters,
} from "@/repositories/developers";
import type { DeveloperCardProps } from "@/components/developers/DeveloperCard";

// Mock data fallback when no database is connected
const mockDevelopers: DeveloperCardProps[] = [
  {
    id: "1",
    name: "Mateo Silva",
    headline: "Senior Full-Stack Engineer",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    countryFlag: "\u{1F1E7}\u{1F1F7}",
    rating: 5.0,
    reviewCount: 42,
    hourlyRateMin: 45,
    hourlyRateMax: 70,
    availability: "available",
    skills: [
      "React Native",
      "Node.js",
      "AWS",
      "PostgreSQL",
      "TypeScript",
      "Docker",
      "Redis",
    ],
  },
  {
    id: "2",
    name: "Luciana Gomez",
    headline: "UX/UI Specialist",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    countryFlag: "\u{1F1E6}\u{1F1F7}",
    rating: 4.9,
    reviewCount: 87,
    hourlyRateMin: 55,
    hourlyRateMax: 80,
    availability: "limited",
    skills: ["Figma", "Tailwind CSS", "Framer", "React"],
    isFavorite: true,
  },
  {
    id: "3",
    name: "Diego Herrera",
    headline: "DevOps Architect",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    countryFlag: "\u{1F1F2}\u{1F1FD}",
    rating: 4.8,
    reviewCount: 31,
    hourlyRateMin: 70,
    hourlyRateMax: 110,
    availability: "available",
    skills: ["Kubernetes", "Terraform", "Go", "AWS", "GCP"],
  },
  {
    id: "4",
    name: "Camila Vargas",
    headline: "Mobile App Developer",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    countryFlag: "\u{1F1E8}\u{1F1F4}",
    rating: 4.7,
    reviewCount: 28,
    hourlyRateMin: 50,
    hourlyRateMax: 75,
    availability: "available",
    skills: ["Flutter", "React Native", "iOS", "Android", "Firebase"],
  },
  {
    id: "5",
    name: "Roberto Fernandez",
    headline: "Backend Engineer",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    countryFlag: "\u{1F1E8}\u{1F1F1}",
    rating: 4.9,
    reviewCount: 56,
    hourlyRateMin: 60,
    hourlyRateMax: 90,
    availability: "limited",
    skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis"],
  },
  {
    id: "6",
    name: "Ana Martinez",
    headline: "AI/ML Engineer",
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    countryFlag: "\u{1F1F5}\u{1F1EA}",
    rating: 5.0,
    reviewCount: 19,
    hourlyRateMin: 80,
    hourlyRateMax: 130,
    availability: "booked",
    skills: ["Python", "TensorFlow", "PyTorch", "OpenAI", "LangChain"],
  },
];

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DevelopersPage({ searchParams }: PageProps) {
  let developers: DeveloperCardProps[] = mockDevelopers;
  let totalCount = mockDevelopers.length;

  // Try fetching from DB if DATABASE_URL is configured
  if (process.env.DATABASE_URL) {
    try {
      const sp = await searchParams;
      const filters: DeveloperSearchFilters = {
        q: typeof sp.q === "string" ? sp.q : undefined,
        techTags:
          typeof sp.tech === "string"
            ? sp.tech.split(",").filter(Boolean)
            : undefined,
        availability:
          typeof sp.availability === "string" ? sp.availability : undefined,
        rateMin: sp.rate_min ? Number(sp.rate_min) : undefined,
        rateMax: sp.rate_max ? Number(sp.rate_max) : undefined,
        country: typeof sp.country === "string" ? sp.country : undefined,
        experience:
          typeof sp.experience === "string" ? sp.experience : undefined,
        verified: sp.verified === "true" || undefined,
        hasPortfolio: sp.has_portfolio === "true" || undefined,
        sort: typeof sp.sort === "string" ? sp.sort : undefined,
        limit: sp.limit ? Number(sp.limit) : 20,
        offset: sp.offset ? Number(sp.offset) : 0,
      };

      const result = await searchDevelopers(filters);
      totalCount = result.total;
      developers = result.developers.map((dev) => ({
        id: dev.id,
        name: dev.display_name,
        headline: dev.headline,
        photoUrl: dev.profile_photo_url || undefined,
        countryFlag: dev.flag_emoji || undefined,
        rating: Number(dev.avg_rating) || 0,
        reviewCount: dev.total_reviews,
        hourlyRateMin: dev.hourly_rate_min
          ? Number(dev.hourly_rate_min)
          : undefined,
        hourlyRateMax: dev.hourly_rate_max
          ? Number(dev.hourly_rate_max)
          : undefined,
        availability: dev.availability_status as DeveloperCardProps["availability"],
        skills: dev.skills,
      }));
    } catch (err) {
      console.error("Failed to fetch developers from DB, using mock data:", err);
    }
  }

  return (
    <>
      <TopBar />
      <MobileFilterChips />
      <div className="flex">
        <FilterSidebar />
        <DevelopersContent developers={developers} totalCount={totalCount} />
      </div>
    </>
  );
}
