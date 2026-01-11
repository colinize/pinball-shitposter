"use client";

import { useState } from "react";

interface UrlInputProps {
  onContentFetched: (content: string) => void;
}

export default function UrlInput({ onContentFetched }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch URL");
      }

      const content = `[${data.platform.toUpperCase()}] ${data.title}\n\n${data.author ? `Posted by: ${data.author}\n\n` : ""}${data.content}`;
      setFetchedContent(content);
      onContentFetched(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch URL");
    } finally {
      setIsLoading(false);
    }
  };

  const clearContent = () => {
    setUrl("");
    setFetchedContent(null);
    setError(null);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a Pinside, Reddit, or forum URL..."
          className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={handleFetch}
          disabled={isLoading || !url.trim()}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {isLoading ? "Fetching..." : "Fetch"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {fetchedContent && (
        <div className="relative">
          <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono">
              {fetchedContent}
            </pre>
          </div>
          <button
            onClick={clearContent}
            className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
