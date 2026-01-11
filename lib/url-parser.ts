import * as cheerio from "cheerio";

export interface ParsedContent {
  title: string;
  content: string;
  author?: string;
  platform: "pinside" | "reddit" | "facebook" | "unknown";
}

export async function fetchAndParseUrl(url: string): Promise<ParsedContent> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Detect platform and parse accordingly
  if (url.includes("pinside.com")) {
    return parsePinside($, url);
  } else if (url.includes("reddit.com") || url.includes("redd.it")) {
    return parseReddit($, url);
  } else if (url.includes("facebook.com")) {
    return parseFacebook($, url);
  } else {
    return parseGeneric($, url);
  }
}

function parsePinside(
  $: cheerio.CheerioAPI,
  _url: string
): ParsedContent {
  // Pinside forum post structure
  const title = $("h1.topic-title").text().trim() || $("title").text().trim();
  const author = $(".post-author-name").first().text().trim();

  // Get the main post content
  const postContent = $(".post-message").first().text().trim();

  return {
    title,
    content: postContent || $("body").text().slice(0, 2000).trim(),
    author: author || undefined,
    platform: "pinside",
  };
}

function parseReddit(
  $: cheerio.CheerioAPI,
  _url: string
): ParsedContent {
  // Reddit post structure (works with old reddit better)
  const title =
    $('h1[slot="title"]').text().trim() ||
    $(".Post h1").text().trim() ||
    $("title").text().trim();

  const author =
    $('a[data-testid="post_author_link"]').text().trim() ||
    $(".author").first().text().trim();

  // Get post content
  const postContent =
    $('[data-click-id="text"]').text().trim() ||
    $(".Post .RichTextJSON-root").text().trim() ||
    $(".usertext-body").first().text().trim();

  return {
    title,
    content: postContent || $("body").text().slice(0, 2000).trim(),
    author: author || undefined,
    platform: "reddit",
  };
}

function parseFacebook(
  $: cheerio.CheerioAPI,
  _url: string
): ParsedContent {
  // Facebook is tricky due to dynamic content, but we try
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

function parseGeneric(
  $: cheerio.CheerioAPI,
  _url: string
): ParsedContent {
  const title =
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "Unknown Post";

  // Try to get main content
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
