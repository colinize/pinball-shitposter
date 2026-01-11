"use client";

import { ShitpostStyle } from "@/lib/prompts";

interface StyleSelectorProps {
  value: ShitpostStyle;
  onChange: (value: ShitpostStyle) => void;
}

const styles: { id: ShitpostStyle; name: string; description: string }[] = [
  {
    id: "reply-guy",
    name: "Reply Guy",
    description: "Quick one-liners, dry wit, gets upvotes",
  },
  {
    id: "sarcastic-insider",
    name: "Sarcastic Insider",
    description: "Gatekeepy, knows too much, obscure references",
  },
  {
    id: "wholesome-roast",
    name: "Wholesome Roast",
    description: "Friendly ribbing, supportive but still funny",
  },
  {
    id: "unhinged-rant",
    name: "Unhinged Rant",
    description: "Goes off, tangents, conspiracy energy",
  },
];

export default function StyleSelector({
  value,
  onChange,
}: StyleSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-zinc-300 mb-3">
        Shitpost Style
      </label>
      <div className="grid grid-cols-2 gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange(style.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              value === style.id
                ? "border-purple-500 bg-purple-500/20"
                : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50"
            }`}
          >
            <div className="font-medium text-white">{style.name}</div>
            <div className="text-sm text-zinc-400 mt-1">{style.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
