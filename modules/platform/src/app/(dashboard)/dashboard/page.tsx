import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Rocket, Zap, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName || "there"}!
        </h1>
        <p className="text-muted-foreground">
          Create and manage your WordPress sites with AI-powered automation.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Project
            </CardTitle>
            <CardDescription>
              Start a new WordPress site with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/projects/new">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Your Projects
            </CardTitle>
            <CardDescription>
              Manage your existing WordPress sites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/projects">View Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Deploy
            </CardTitle>
            <CardDescription>
              Deploy your latest changes instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              No projects yet
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Projects</CardDescription>
            <CardTitle className="text-4xl">0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Deployed Sites</CardDescription>
            <CardTitle className="text-4xl">0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Plan</CardDescription>
            <CardTitle className="text-4xl">
              <Badge variant="secondary">Free</Badge>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Projects Remaining</CardDescription>
            <CardTitle className="text-4xl">3</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Follow these steps to create your first WordPress site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            <li>Click &quot;Create New Project&quot; to start the wizard</li>
            <li>Enter your company details and select your industry</li>
            <li>Choose your brand colors and design preferences</li>
            <li>Review the AI-generated preview</li>
            <li>Deploy to your preferred hosting platform</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
