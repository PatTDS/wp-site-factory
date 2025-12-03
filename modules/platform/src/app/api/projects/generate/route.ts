import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { projectService } from "@/services/project-service";

// Project generation request schema
const GenerateRequestSchema = z.object({
  name: z.string().min(1),
  companyName: z.string().min(1),
  industry: z.string().min(1),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  useAI: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = GenerateRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const config = validationResult.data;

    // Generate slug from name
    const slug = config.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Prepare project config for orchestrator
    const projectConfig = {
      name: config.name,
      slug,
      companyName: config.companyName,
      industry: config.industry,
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      email: config.email,
      phone: config.phone,
      address: config.address,
      city: config.city,
      state: config.state,
    };

    // Generate project using orchestrator
    const generationResult = await projectService.generateProject(projectConfig);

    if (!generationResult.success) {
      return NextResponse.json(
        {
          error: "Generation failed",
          details: generationResult.errors,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        projectId: generationResult.projectId,
        slug: generationResult.slug,
        status: "ready",
        message: "Site generated successfully",
        filesGenerated: generationResult.files.length,
        metadata: generationResult.metadata,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
