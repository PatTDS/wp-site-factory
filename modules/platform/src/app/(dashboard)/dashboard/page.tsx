import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Clock, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  // Mock data - will be replaced with actual data from API
  const stats = {
    totalProjects: 3,
    deployedSites: 2,
    pendingProjects: 1,
  };

  const recentProjects = [
    {
      id: "1",
      name: "Demo Restaurant",
      industry: "Restaurant",
      status: "deployed",
      updatedAt: "2 hours ago",
    },
    {
      id: "2",
      name: "Fitness Pro",
      industry: "Fitness",
      status: "generating",
      updatedAt: "1 day ago",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your WordPress sites from one place.
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalProjects}</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.deployedSites}</p>
              <p className="text-sm text-muted-foreground">Deployed Sites</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pendingProjects}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-lg border bg-white flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.industry}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === "deployed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {project.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  {project.updatedAt}
                </span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
