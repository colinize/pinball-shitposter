import * as cheerio from "cheerio";

export interface ParsedContent {
  title: string;
  content: string;
  author?: string;
  platform: "pinside" | "reddit" | "facebook" | "unknown";
}

export async function fetchAndParseUrl(url: string): Promise<ParsedContent> {
  // Reddit has a JSON API - use that instead of scraping
  if (url.includes("reddit.com") || url.includes("redd.it")) {
    return fetchRedditJson(url);
  }

  // For other sites, try scraping with better headers
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(
        `Site returned ${response.status}. The site may be blocking automated requests.`
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    if (url.includes("pinside.com")) {
      return parsePinside($);
    } else if (url.includes("facebook.com")) {
      return parseFacebook($);
    } else {
      return parseGeneric($);
    }
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. The site may be slow or blocking requests.");
    }
    throw error;
  }
}

async function fetchRedditJson(url: string): Promise<ParsedContent> {
  // Convert Reddit URL to JSON endpoint
  let jsonUrl = url.replace(/\/$/, ""); // Remove trailing slash

  // Handle different Reddit URL formats
  if (jsonUrl.includes("redd.it/")) {
    // Short URL - need to follow redirect first
    const response = await fetch(jsonUrl, { redirect: "follow" });
    jsonUrl = response.url.replace(/\/$/, "");
  }

  // Remove query params and add .json
  jsonUrl = jsonUrl.split("?")[0] + ".json";

  const response = await fetch(jsonUrl, {
    headers: {
      "User-Agent": "PinballShitposter/1.0",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Reddit returned ${response.status}. The post may be private or deleted.`
    );
  }

  const data = await response.json();

  // Reddit returns an array - first element is the post, second is comments
  const postData = data[0]?.data?.children?.[0]?.data;

  if (!postData) {
    throw new Error("Could not parse Reddit post data");
  }

  return {
    title: postData.title || "Reddit Post",
    content: postData.selftext || postData.title || "",
    author: postData.author || undefined,
    platform: "reddit",
  };
}

function parsePinside($: cheerio.CheerioAPI): ParsedContent {
  const title = $("h1.topic-title").text().trim() || $("title").text().trim();
  const author = $(".post-author-name").first().text().trim();
  const postContent = $(".post-message").first().text().trim();

  return {
    title,
    content: postContent || $("body").text().slice(0, 2000).trim(),
    author: author || undefined,
    platform: "pinside",
  };
}

function parseFacebook($: cheerio.CheerioAPI): ParsedContent {
  const title = $('meta[property="og:title"]').attr("content") || "";
  const content =
    $('meta[property="og:description"]').attr("content") ||
    $("body").text().slice(0, 2000).trim();

  return {
    title,
    content,
    platform: "facebook",
  };
}

function parseGeneric($: cheerio.CheerioAPI): ParsedContent {
  const title =
    $("h1").first().text().trim() || $("title").text().trim() || "Unknown Post";

  const content =
    $("article").text().trim() ||
    $("main").text().trim() ||
    $(".post").text().trim() ||
    $(".content").text().trim() ||
    $("body").text().slice(0, 2000).trim();

  return {
    title,
    content: content.slice(0, 2000),
    platform: "unknown",
  };
}
