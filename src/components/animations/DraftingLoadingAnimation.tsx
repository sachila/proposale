"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading your ask...",
  "Picking the right content...",
  "Setting quantities...",
  "Polishing the wording...",
];

const LINE_WIDTHS = ["100%", "85%", "60%"];

const DraftingLoadingAnimation = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex flex-col gap-1.5">
        {LINE_WIDTHS.map((width, i) => (
          <div
            key={i}
            className="h-2 overflow-hidden rounded-full bg-black/8 dark:bg-white/[.145]"
            style={{ width: "6rem" }}
          >
            <div
              className="h-full rounded-full bg-black/40 dark:bg-white/40"
              style={{
                width,
                animation: "write-line 1.6s ease-in-out infinite",
                animationDelay: `${i * 200}ms`,
              }}
            />
          </div>
        ))}
        <span
          className="absolute -top-4 -right-4 text-xl"
          style={{
            animation: "write-wiggle 0.6s ease-in-out infinite",
            transformOrigin: "70% 70%",
          }}
        >
          ✍️
        </span>
      </div>
      <p className="min-h-6 text-sm text-zinc-500 transition-opacity dark:text-zinc-400">
        {MESSAGES[messageIndex]}
      </p>
    </div>
  );
};

export default DraftingLoadingAnimation;
