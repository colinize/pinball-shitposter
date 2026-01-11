"use client";

import { useState } from "react";

interface ShitpostOutputProps {
  shitpost: string | null;
  isLoading: boolean;
}

export default function ShitpostOutput({
  shitpost,
  isLoading,
}: ShitpostOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!shitpost) return;

    try {
      await navigator.clipboard.writeText(shitpost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shitpost;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 bg-zinc-800/50 border border-zinc-700 rounded-lg">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" />
          <div
            className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        <p className="text-center text-zinc-400 mt-4">
          Channeling maximum chaos energy...
        </p>
      </div>
    );
  }

  if (!shitpost) {
    return (
      <div className="w-full p-8 bg-zinc-800/30 border border-zinc-700/50 border-dashed rounded-lg">
        <p className="text-center text-zinc-500">
          Your shitpost will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative p-6 bg-gradient-to-br from-purple-900/30 to-zinc-800 border border-purple-700/50 rounded-lg">
        <p className="text-lg text-white whitespace-pre-wrap leading-relaxed">
          {shitpost}
        </p>
        <button
          onClick={handleCopy}
          className={`absolute top-3 right-3 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            copied
              ? "bg-green-600 text-white"
              : "bg-zinc-700 hover:bg-zinc-600 text-white"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
