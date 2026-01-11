import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateShitpostParams {
  systemPrompt: string;
  userPrompt: string;
  imageData?: string; // base64 encoded image
  imageMediaType?: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
}

export async function generateShitpost({
  systemPrompt,
  userPrompt,
  imageData,
  imageMediaType,
}: GenerateShitpostParams): Promise<string> {
  const content: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

  if (imageData && imageMediaType) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: imageMediaType,
        data: imageData,
      },
    });
  }

  content.push({
    type: "text",
    text: userPrompt,
  });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textBlock.text;
}
