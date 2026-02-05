import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { AboutSection } from "@/components/profile/AboutSection";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { PortfolioSection } from "@/components/profile/PortfolioSection";
import { ReviewsSection } from "@/components/profile/ReviewsSection";
import { PricingSection } from "@/components/profile/PricingSection";
import { ContactSidebar } from "@/components/profile/ContactSidebar";

type PageParams = { locale: string; id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { id } = await params;

  let name = "Developer";
  let description = "View developer profile on yoDEV Marketplace";
  let image: string | undefined;

  if (process.env.DATABASE_URL) {
    try {
      const { getDeveloperById } = await import("@/repositories/developers");
      const dev = await getDeveloperById(id);
      if (dev) {
        name = dev.display_name;
        description = dev.headline || `${dev.display_name} on yoDEV Marketplace`;
        image = dev.profile_photo_url || undefined;
      }
    } catch {
      // Fall through to defaults
    }
  } else {
    name = mockDeveloper.name;
    description = mockDeveloper.headline;
    image = mockDeveloper.photoUrl;
  }

  return {
    title: `${name} | yoDEV Marketplace`,
    description,
    openGraph: {
      title: `${name} | yoDEV Marketplace`,
      description,
      ...(image ? { images: [{ url: image, width: 400, height: 400 }] } : {}),
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${name} | yoDEV Marketplace`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

// Mock data - will be replaced with API calls
const mockDeveloper = {
  id: "1",
  name: "Mateo Silva",
  headline: "Senior Full-Stack Engineer",
  photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  coverUrl: "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=1200&h=400&fit=crop",
  countryFlag: "🇧🇷",
  country: "Brazil",
  city: "São Paulo",
  timezone: "GMT-3",
  rating: 5.0,
  reviewCount: 42,
  hourlyRateMin: 45,
  hourlyRateMax: 70,
  availability: "available" as const,
  responseTime: "< 2 hours",
  memberSince: "2022-03-15",
  verified: true,
  topRated: true,
  about: `I'm a passionate full-stack engineer with 8+ years of experience building scalable web and mobile applications. I specialize in React, Node.js, and cloud infrastructure.

My approach combines clean code practices with pragmatic problem-solving. I've helped startups launch their MVPs and enterprises modernize legacy systems.

When I'm not coding, you'll find me contributing to open source projects or mentoring junior developers in my local tech community.`,
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "Spanish", level: "Conversational" },
  ],
  skills: [
    { name: "React", level: "Expert" as const, years: 6 },
    { name: "Node.js", level: "Expert" as const, years: 7 },
    { name: "TypeScript", level: "Expert" as const, years: 5 },
    { name: "PostgreSQL", level: "Advanced" as const, years: 6 },
    { name: "AWS", level: "Advanced" as const, years: 5 },
    { name: "Docker", level: "Advanced" as const, years: 4 },
    { name: "React Native", level: "Advanced" as const, years: 4 },
    { name: "Redis", level: "Intermediate" as const, years: 3 },
    { name: "GraphQL", level: "Intermediate" as const, years: 3 },
    { name: "Kubernetes", level: "Intermediate" as const, years: 2 },
  ],
  portfolio: [
    {
      id: "p1",
      title: "FinTech Mobile App",
      description: "Digital banking app with real-time transactions, biometric auth, and investment tracking.",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
      tags: ["React Native", "Node.js", "PostgreSQL"],
      link: "https://example.com/fintech",
    },
    {
      id: "p2",
      title: "E-commerce Platform",
      description: "Scalable marketplace handling 50k+ daily orders with real-time inventory management.",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      tags: ["Next.js", "Stripe", "AWS"],
      link: "https://example.com/ecommerce",
    },
    {
      id: "p3",
      title: "Healthcare Dashboard",
      description: "Patient management system with appointment scheduling and telemedicine integration.",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
      tags: ["React", "TypeScript", "HIPAA"],
    },
  ],
  reviews: [
    {
      id: "r1",
      clientName: "Sarah Chen",
      clientCompany: "TechStart Inc.",
      clientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 5,
      comment: "Mateo delivered exceptional work on our mobile app. His attention to detail and proactive communication made the entire process smooth. Highly recommend!",
      date: "2024-01-15",
      projectType: "Mobile App Development",
      verified: true,
    },
    {
      id: "r2",
      clientName: "Michael Torres",
      clientCompany: "DataFlow Analytics",
      clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      rating: 5,
      comment: "Outstanding technical skills and great problem-solving ability. Mateo helped us refactor our entire backend and improved performance by 3x.",
      date: "2023-11-20",
      projectType: "Backend Development",
      verified: true,
    },
    {
      id: "r3",
      clientName: "Emily Rodriguez",
      clientCompany: "GreenLeaf Ventures",
      clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      rating: 5,
      comment: "Professional, reliable, and incredibly skilled. Mateo transformed our outdated platform into a modern, scalable solution.",
      date: "2023-09-05",
      projectType: "Full-Stack Development",
      verified: true,
    },
  ],
  pricing: {
    hourlyRate: { min: 45, max: 70 },
    projectMinimum: 2000,
    retainerMonthly: 5000,
    openToEquity: true,
    freeConsultation: true,
    openToNegotiation: true,
  },
  preferences: {
    projectTypes: ["Web Applications", "Mobile Apps", "API Development", "System Architecture"],
    industries: ["FinTech", "HealthTech", "E-commerce", "SaaS"],
    teamSize: "1-10 people",
    engagement: ["Long-term contracts", "Project-based", "Part-time"],
  },
};

export default async function DeveloperProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  // In production, fetch from API
  const developer = mockDeveloper;

  if (!developer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader developer={developer} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-24 lg:pb-12">
        <div className="lg:flex lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProfileTabs />

            <div className="space-y-8 mt-6">
              <AboutSection
                about={developer.about}
                languages={developer.languages}
                preferences={developer.preferences}
              />

              <SkillsSection skills={developer.skills} />

              <PortfolioSection projects={developer.portfolio} />

              <ReviewsSection
                reviews={developer.reviews}
                averageRating={developer.rating}
                totalReviews={developer.reviewCount}
              />

              <PricingSection pricing={developer.pricing} />
            </div>
          </div>

          {/* Contact Sidebar - Desktop */}
          <ContactSidebar developer={developer} />
        </div>
      </div>
    </div>
  );
}
