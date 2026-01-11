import { NextRequest, NextResponse } from "next/server";
import { generateShitpost } from "@/lib/claude";
import { getShitpostSystemPrompt, getShitpostUserPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      content,
      inputType,
      unhingedLevel,
      imageData,
      imageMediaType,
    }: {
      content: string;
      inputType: "image" | "url" | "text";
      unhingedLevel: number;
      imageData?: string;
      imageMediaType?: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    } = body;

    if (!content && !imageData) {
      return NextResponse.json(
        { error: "Content or image is required" },
        { status: 400 }
      );
    }

    const systemPrompt = getShitpostSystemPrompt(unhingedLevel);
    const userPrompt = getShitpostUserPrompt(content || "", inputType);

    const shitpost = await generateShitpost({
      systemPrompt,
      userPrompt,
      imageData,
      imageMediaType,
    });

    return NextResponse.json({ shitpost });
  } catch (error) {
    console.error("Error generating shitpost:", error);
    return NextResponse.json(
      { error: "Failed to generate shitpost. Check your API key." },
      { status: 500 }
    );
  }
}
