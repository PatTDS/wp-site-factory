import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { projectService } from "@/services/project-service";

// GET /api/projects - List user's projects
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch projects from disk
    const projects = await projectService.listProjects();

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
