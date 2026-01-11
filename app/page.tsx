"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import UrlInput from "@/components/UrlInput";
import TextInput from "@/components/TextInput";
import ShitpostOutput from "@/components/ShitpostOutput";
import StyleSelector from "@/components/StyleSelector";
import { ShitpostStyle } from "@/lib/prompts";

type InputTab = "image" | "url" | "text";

export default function Home() {
  const [activeTab, setActiveTab] = useState<InputTab>("image");
  const [style, setStyle] = useState<ShitpostStyle>("reply-guy");
  const [shitpost, setShitpost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Content state
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<
    "image/jpeg" | "image/png" | "image/gif" | "image/webp" | null
  >(null);
  const [urlContent, setUrlContent] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let content = "";
      let inputType: InputTab = activeTab;

      if (activeTab === "image") {
        if (!imageData) {
          setError("Please upload an image first");
          setIsLoading(false);
          return;
        }
        content = "";
      } else if (activeTab === "url") {
        if (!urlContent) {
          setError("Please fetch a URL first");
          setIsLoading(false);
          return;
        }
        content = urlContent;
      } else {
        if (!textContent.trim()) {
          setError("Please enter some text first");
          setIsLoading(false);
          return;
        }
        content = textContent;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          inputType,
          style,
          imageData: activeTab === "image" ? imageData : undefined,
          imageMediaType: activeTab === "image" ? imageMediaType : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate shitpost");
      }

      setShitpost(data.shitpost);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate shitpost"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const hasContent =
    (activeTab === "image" && imageData) ||
    (activeTab === "url" && urlContent) ||
    (activeTab === "text" && textContent.trim());

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Pinball Shitposter
          </h1>
          <p className="text-zinc-400 text-lg">
            Generate the perfect reply for any pinball forum post
          </p>
        </div>

        {/* Style Selector */}
        <div className="mb-8 p-4 bg-zinc-800/50 rounded-lg">
          <StyleSelector value={style} onChange={setStyle} />
        </div>

        {/* Input Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-zinc-700">
            <button
              onClick={() => setActiveTab("image")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "image"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Screenshot
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "url"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              URL
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "text"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Text
            </button>
          </div>
        </div>

        {/* Input Content */}
        <div className="mb-8">
          {activeTab === "image" && (
            <ImageUploader
              onImageSelect={(data, mediaType) => {
                setImageData(data);
                setImageMediaType(mediaType);
              }}
            />
          )}
          {activeTab === "url" && (
            <UrlInput onContentFetched={setUrlContent} />
          )}
          {activeTab === "text" && <TextInput onTextChange={setTextContent} />}
        </div>

        {/* Generate Button */}
        <div className="mb-8">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !hasContent}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? "Generating..." : "Generate Shitpost"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Output */}
        <div className="mb-8">
          <ShitpostOutput shitpost={shitpost} isLoading={isLoading} />
        </div>

        {/* Regenerate Button */}
        {shitpost && !isLoading && (
          <div className="text-center">
            <button
              onClick={handleRegenerate}
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
            >
              Regenerate
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-zinc-500 text-sm">
          <p>For entertainment purposes only. Please shitpost responsibly.</p>
        </div>
      </div>
    </div>
  );
}
