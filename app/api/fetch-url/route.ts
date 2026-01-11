import { NextRequest, NextResponse } from "next/server";
import { fetchAndParseUrl } from "@/lib/url-parser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url }: { url: string } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const parsed = await fetchAndParseUrl(url);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return NextResponse.json(
      { error: "Failed to fetch URL content" },
      { status: 500 }
    );
  }
}
