import { TopBar } from "@/components/layout/TopBar";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { ProjectFilters } from "@/components/projects/ProjectFilters";

// Mock data
const mockProjects = [
  {
    id: "p1",
    title: "E-commerce Platform Development",
    client: {
      name: "ShopFlow",
      avatarUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
      verified: true,
    },
    description: "Looking for a full-stack developer to build a modern e-commerce platform with inventory management, payment processing, and analytics dashboard.",
    budget: { min: 5000, max: 10000, type: "fixed" as const },
    duration: "2-3 months",
    skills: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    postedAt: "2026-02-04T10:00:00Z",
    proposals: 12,
    status: "open" as const,
  },
  {
    id: "p2",
    title: "Mobile App for Fitness Tracking",
    client: {
      name: "FitLife Inc.",
      avatarUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
      verified: true,
    },
    description: "We need a React Native developer to create a cross-platform fitness app with workout tracking, social features, and Apple Watch integration.",
    budget: { min: 50, max: 80, type: "hourly" as const },
    duration: "3-6 months",
    skills: ["React Native", "TypeScript", "Firebase", "HealthKit"],
    postedAt: "2026-02-03T15:30:00Z",
    proposals: 8,
    status: "open" as const,
  },
  {
    id: "p3",
    title: "API Integration & Backend Optimization",
    client: {
      name: "DataSync Corp",
      avatarUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop",
      verified: false,
    },
    description: "Need an experienced backend developer to integrate multiple third-party APIs and optimize our existing Node.js infrastructure.",
    budget: { min: 3000, max: 5000, type: "fixed" as const },
    duration: "1-2 months",
    skills: ["Node.js", "REST APIs", "GraphQL", "Redis", "Docker"],
    postedAt: "2026-02-02T09:00:00Z",
    proposals: 15,
    status: "open" as const,
  },
  {
    id: "p4",
    title: "DevOps & Cloud Infrastructure Setup",
    client: {
      name: "CloudFirst",
      avatarUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
      verified: true,
    },
    description: "Setting up CI/CD pipelines, Kubernetes clusters, and monitoring infrastructure for a growing SaaS platform.",
    budget: { min: 60, max: 100, type: "hourly" as const },
    duration: "Ongoing",
    skills: ["Kubernetes", "Terraform", "AWS", "GitHub Actions", "Prometheus"],
    postedAt: "2026-02-01T14:00:00Z",
    proposals: 6,
    status: "open" as const,
  },
  {
    id: "p5",
    title: "AI-Powered Chatbot Development",
    client: {
      name: "TechStart Inc.",
      avatarUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
      verified: true,
    },
    description: "Building an intelligent customer support chatbot using OpenAI's GPT-4 API with custom training on our knowledge base.",
    budget: { min: 8000, max: 15000, type: "fixed" as const },
    duration: "2-4 months",
    skills: ["Python", "OpenAI", "LangChain", "FastAPI", "Vector DB"],
    postedAt: "2026-01-30T11:00:00Z",
    proposals: 20,
    status: "open" as const,
  },
];

export default function ProjectsPage() {
  return (
    <>
      <TopBar showSearch={false} />

      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Desktop Sidebar */}
          <ProjectFilters />

          {/* Projects List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Find Projects</h1>
                <p className="text-muted text-sm mt-1">
                  {mockProjects.length} projects available
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select className="h-10 px-4 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Most Recent</option>
                  <option>Highest Budget</option>
                  <option>Most Proposals</option>
                </select>
              </div>
            </div>

            <ProjectsList projects={mockProjects} />
          </div>
        </div>
      </div>
    </>
  );
}
