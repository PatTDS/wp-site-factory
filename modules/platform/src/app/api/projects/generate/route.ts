import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

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

    // TODO: Call orchestrator service
    // For now, return mock response indicating generation started
    // In production, this would:
    // 1. Create project in database
    // 2. Queue generation job
    // 3. Call orchestrator module
    // 4. Store generated files
    // 5. Return project details

    // Simulated response
    const generationResult = {
      success: true,
      projectId: `proj_${Date.now()}`,
      slug,
      status: "generating",
      message: "Site generation started",
      estimatedTime: "30-60 seconds",
      config: projectConfig,
    };

    return NextResponse.json(generationResult, { status: 202 });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
