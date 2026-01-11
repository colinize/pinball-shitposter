"use client";

import { useState } from "react";

interface TextInputProps {
  onTextChange: (text: string) => void;
}

export default function TextInput({ onTextChange }: TextInputProps) {
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
  };

  const clearText = () => {
    setText("");
    onTextChange("");
  };

  return (
    <div className="w-full relative">
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Paste the forum post content here...

Example:
'Just picked up a Medieval Madness and it's the greatest game ever made. Anyone who disagrees is wrong.'"
        className="w-full h-64 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
      />
      {text && (
        <button
          onClick={clearText}
          className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
