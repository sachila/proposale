"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading your proposal...",
  "Judging your pricing...",
  "Sharpening the roast...",
  "Finding the weak spots...",
  "Adding a pinch of savage...",
];

const RoastLoadingAnimation = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end gap-2">
        {["🔥", "🔥", "🔥"].map((emoji, i) => (
          <span
            key={i}
            className="animate-bounce text-3xl"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {emoji}
          </span>
        ))}
      </div>
      <p className="min-h-6 text-sm text-zinc-500 transition-opacity dark:text-zinc-400">
        {MESSAGES[messageIndex]}
      </p>
    </div>
  );
};

export default RoastLoadingAnimation;
