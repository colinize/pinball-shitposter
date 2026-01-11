import { NextRequest, NextResponse } from "next/server";
import { generateShitpost } from "@/lib/claude";
import { getShitpostSystemPrompt, getShitpostUserPrompt, ShitpostStyle } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      content,
      inputType,
      style,
      imageData,
      imageMediaType,
    }: {
      content: string;
      inputType: "image" | "url" | "text";
      style: ShitpostStyle;
      imageData?: string;
      imageMediaType?: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    } = body;

    if (!content && !imageData) {
      return NextResponse.json(
        { error: "Content or image is required" },
        { status: 400 }
      );
    }

    const systemPrompt = getShitpostSystemPrompt(style);
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

    let message = "Failed to generate shitpost";
    if (error instanceof Error) {
      if (error.message.includes("credit balance")) {
        message = "Anthropic account has no credits. Add credits at console.anthropic.com/settings/billing";
      } else if (error.message.includes("401") || error.message.includes("invalid")) {
        message = "Invalid API key. Check your ANTHROPIC_API_KEY.";
      } else {
        message = error.message;
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
