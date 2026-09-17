"use client";

import { useTransition } from "react";
import { confirmProposal } from "./actions";
import type { ConfirmResult, ProposalPreview } from "@/types/ai-proposal";

const PreviewStage = ({
  preview,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onStartOver,
  onConfirmed,
  onError,
}: {
  preview: ProposalPreview;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStartOver: () => void;
  onConfirmed: (url: string) => void;
  onError: (error: string | null) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    onError(null);
    startTransition(async () => {
      const result: ConfirmResult = await confirmProposal({
        ...preview,
        startDate: startDate || null,
        endDate: endDate || null,
      });
      if (result.ok) {
        onConfirmed(result.url);
      } else {
        onError(result.error);
      }
    });
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 text-left">
      <div className="rounded-lg bg-white p-4 dark:bg-zinc-900">
        <p className="font-semibold text-black dark:text-zinc-50">
          {preview.titleMd}
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {preview.descriptionMd}
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {preview.items.map((item) => (
          <li
            key={item.variationId}
            className="rounded-lg bg-white p-3 text-sm dark:bg-zinc-900"
          >
            <span className="font-medium">
              {item.quantity}x {item.title}
            </span>
            <p className="text-zinc-500 dark:text-zinc-400">{item.reason}</p>
          </li>
        ))}
      </ul>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Start date
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="rounded-lg border border-black/8 bg-white px-3 py-2 text-sm outline-none dark:border-white/[.145] dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          End date
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="rounded-lg border border-black/8 bg-white px-3 py-2 text-sm outline-none dark:border-white/[.145] dark:bg-zinc-900"
          />
        </label>
      </div>

      <p className="text-xs text-zinc-500">
        This only creates a draft. Nothing is sent to a client.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onStartOver}
          disabled={isPending}
          className="flex-1 rounded-full border border-black/8 px-5 py-2 text-sm font-medium transition-colors hover:bg-black/4 disabled:opacity-50 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Start over
        </button>
        <button
          onClick={handleConfirm}
          disabled={isPending || !startDate || !endDate}
          className="flex-1 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {isPending ? "Creating..." : "Create draft in Proposales"}
        </button>
      </div>
    </div>
  );
};

export default PreviewStage;
