import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/projects/[id] - Get project details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // TODO: Fetch from database
    // For now, return mock data
    const project = {
      id,
      name: "Demo Restaurant",
      slug: "demo-restaurant",
      companyName: "Demo Restaurant LLC",
      industry: "restaurant",
      status: "deployed",
      primaryColor: "#16a34a",
      secondaryColor: "#0f766e",
      email: "contact@demo-restaurant.com",
      phone: "(555) 123-4567",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generatedContent: {
        homepage: {
          headline: "Welcome to Demo Restaurant",
          subheadline: "Experience culinary excellence",
        },
      },
      deployments: [
        {
          id: "deploy_1",
          environment: "production",
          url: "https://demo-restaurant.wpf.dev",
          status: "active",
          deployedAt: new Date().toISOString(),
        },
      ],
    };

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // TODO: Delete from database and clean up resources
    console.log(`Deleting project ${id} for user ${userId}`);

    return NextResponse.json(
      { success: true, message: "Project deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    // TODO: Update in database
    console.log(`Updating project ${id}:`, updates);

    return NextResponse.json(
      { success: true, message: "Project updated", project: { id, ...updates } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
