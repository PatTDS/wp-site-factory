import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/projects - List user's projects
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Fetch from database
    // For now, return mock data
    const projects = [
      {
        id: "proj_demo1",
        name: "Demo Restaurant",
        slug: "demo-restaurant",
        companyName: "Demo Restaurant LLC",
        industry: "restaurant",
        status: "deployed",
        primaryColor: "#16a34a",
        secondaryColor: "#0f766e",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deployments: [
          {
            id: "deploy_1",
            environment: "production",
            url: "https://demo-restaurant.wpf.dev",
            status: "active",
            deployedAt: new Date().toISOString(),
          },
        ],
      },
    ];

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
