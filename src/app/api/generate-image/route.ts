import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    let imageUrl: string;

    imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=512&height=512&nologo=true&enhance=true`;

    return NextResponse.json({
      success: true,
      imageUrl,
      provider: "pollinations",
    });
  } catch (error: unknown) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to generate image",
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate image",
        },
        { status: 500 }
      );
    }
  }
}
