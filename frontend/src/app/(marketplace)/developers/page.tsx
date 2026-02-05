import { TopBar } from "@/components/layout/TopBar";
import { FilterSidebar } from "@/components/developers/FilterSidebar";
import { DeveloperCard } from "@/components/developers/DeveloperCard";

// Mock data - will be replaced with API calls
const mockDevelopers = [
  {
    id: "1",
    name: "Mateo Silva",
    headline: "Senior Full-Stack Engineer",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    countryFlag: "🇧🇷",
    rating: 5.0,
    reviewCount: 42,
    hourlyRateMin: 45,
    hourlyRateMax: 70,
    availability: "available" as const,
    skills: ["React Native", "Node.js", "AWS", "PostgreSQL", "TypeScript", "Docker", "Redis"],
  },
  {
    id: "2",
    name: "Luciana Gomez",
    headline: "UX/UI Specialist",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    countryFlag: "🇦🇷",
    rating: 4.9,
    reviewCount: 87,
    hourlyRateMin: 55,
    hourlyRateMax: 80,
    availability: "limited" as const,
    skills: ["Figma", "Tailwind CSS", "Framer", "React"],
    isFavorite: true,
  },
  {
    id: "3",
    name: "Diego Herrera",
    headline: "DevOps Architect",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    countryFlag: "🇲🇽",
    rating: 4.8,
    reviewCount: 31,
    hourlyRateMin: 70,
    hourlyRateMax: 110,
    availability: "available" as const,
    skills: ["Kubernetes", "Terraform", "Go", "AWS", "GCP"],
  },
  {
    id: "4",
    name: "Camila Vargas",
    headline: "Mobile App Developer",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    countryFlag: "🇨🇴",
    rating: 4.7,
    reviewCount: 28,
    hourlyRateMin: 50,
    hourlyRateMax: 75,
    availability: "available" as const,
    skills: ["Flutter", "React Native", "iOS", "Android", "Firebase"],
  },
  {
    id: "5",
    name: "Roberto Fernandez",
    headline: "Backend Engineer",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    countryFlag: "🇨🇱",
    rating: 4.9,
    reviewCount: 56,
    hourlyRateMin: 60,
    hourlyRateMax: 90,
    availability: "limited" as const,
    skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis"],
  },
  {
    id: "6",
    name: "Ana Martinez",
    headline: "AI/ML Engineer",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    countryFlag: "🇵🇪",
    rating: 5.0,
    reviewCount: 19,
    hourlyRateMin: 80,
    hourlyRateMax: 130,
    availability: "booked" as const,
    skills: ["Python", "TensorFlow", "PyTorch", "OpenAI", "LangChain"],
  },
];

export default function DevelopersPage() {
  return (
    <>
      <TopBar title="Browse Developers" />

      {/* Filter Chips (Mobile) */}
      <div className="lg:hidden flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar bg-surface border-b border-border">
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-4 text-white shadow-md">
          <span className="text-sm font-semibold">All Roles</span>
        </button>
        {["Frontend", "Backend", "Mobile", "DevOps"].map((role) => (
          <button
            key={role}
            className="flex h-9 shrink-0 items-center justify-center rounded-full bg-background-alt px-4 text-foreground border border-border"
          >
            <span className="text-sm font-medium">{role}</span>
          </button>
        ))}
      </div>

      <div className="flex">
        {/* Desktop Filter Sidebar */}
        <FilterSidebar />

        {/* Developer Grid */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted text-sm font-medium">
              Showing <span className="text-foreground font-semibold">{mockDevelopers.length}</span> developers
            </p>
            <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider cursor-pointer">
              <span>Sort: Recommended</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {mockDevelopers.map((dev) => (
              <DeveloperCard key={dev.id} {...dev} />
            ))}
          </div>

          {/* Load More */}
          <div className="flex flex-col items-center gap-4 py-8">
            <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
              <span>Load More Developers</span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            <p className="text-muted text-xs">
              Showing {mockDevelopers.length} of 47 developers
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
