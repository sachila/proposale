"use client";

import { useState } from "react";

type DuplicateGroup = {
  label: string;
  reason: string;
  variationIds: number[];
};

const groupKey = (group: DuplicateGroup) => {
  return [...group.variationIds].sort((a, b) => a - b).join(",");
};

const storageKey = (companyId?: number) => {
  return `product-insights:dismissed-duplicates:${companyId ?? "default"}`;
};

const loadDismissed = (companyId?: number): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(storageKey(companyId));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const DuplicateGroupsList = ({
  groups,
  titleByVariationId,
  companyId,
}: {
  groups: DuplicateGroup[];
  titleByVariationId: Record<number, string>;
  companyId?: number;
}) => {
  // lazy init reads localStorage on the client only, avoiding a server/client mismatch
  const [dismissed, setDismissed] = useState<Set<string>>(() =>
    loadDismissed(companyId),
  );

  const dismiss = (key: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(key);
      try {
        localStorage.setItem(storageKey(companyId), JSON.stringify([...next]));
      } catch {
        // ignore storage write failures (e.g. private browsing)
      }
      return next;
    });
  };

  const visible = groups.filter((group) => !dismissed.has(groupKey(group)));

  if (visible.length === 0) {
    return <p className="text-zinc-300">No likely duplicates found.</p>;
  }

  return (
    <ul className="space-y-4">
      {visible.map((group) => {
        const key = groupKey(group);
        return (
          <li
            key={key}
            className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-4 last:border-b-0 last:pb-0"
          >
            <div>
              <p className="font-medium">{group.label}</p>
              <p className="mb-1 text-sm text-zinc-400">{group.reason}</p>
              <ul className="list-inside list-disc text-sm text-zinc-300">
                {group.variationIds.map((id) => (
                  <li key={id}>{titleByVariationId[id] ?? `#${id}`}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => dismiss(key)}
              className="shrink-0 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/8"
            >
              Not a duplicate
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default DuplicateGroupsList;
