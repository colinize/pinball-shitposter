"use client";

interface UnhingedSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const labels = [
  "Mild", // 1-2
  "Spicy", // 3-4
  "Chaotic", // 5-6
  "Unhinged", // 7-8
  "MAXIMUM CHAOS", // 9-10
];

export default function UnhingedSlider({
  value,
  onChange,
}: UnhingedSliderProps) {
  const labelIndex = Math.min(Math.floor((value - 1) / 2), 4);
  const label = labels[labelIndex];

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-zinc-300">
          Unhinged Level
        </label>
        <span
          className={`text-sm font-bold ${
            value <= 2
              ? "text-green-400"
              : value <= 4
                ? "text-yellow-400"
                : value <= 6
                  ? "text-orange-400"
                  : value <= 8
                    ? "text-red-400"
                    : "text-purple-400 animate-pulse"
          }`}
        >
          {value}/10 - {label}
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right,
            #22c55e 0%,
            #eab308 25%,
            #f97316 50%,
            #ef4444 75%,
            #a855f7 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-zinc-500">
        <span>Normal human</span>
        <span>72 hours no sleep</span>
      </div>
    </div>
  );
}
