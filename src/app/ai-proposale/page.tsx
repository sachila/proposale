"use client";

import { useState, useTransition } from "react";
import { previewProposal } from "./actions";
import type { ProposalPreview } from "@/types/ai-proposal";
import PreviewStage from "./PreviewStage";
import DoneStage from "./DoneStage";
import DraftingLoadingAnimation from "@/components/animations/DraftingLoadingAnimation";

type Stage =
  | { name: "form" }
  | { name: "preview"; preview: ProposalPreview }
  | { name: "done"; url: string };

const AiProposalePage = () => {
  const [ask, setAsk] = useState("");
  const [stage, setStage] = useState<Stage>({ name: "form" });
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePreview = () => {
    setError(null);
    startTransition(async () => {
      const result = await previewProposal(ask);
      if (result.ok) {
        setStage({ name: "preview", preview: result.preview });
        setStartDate(result.preview.startDate ?? "");
        setEndDate(result.preview.endDate ?? "");
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-16 text-center dark:bg-black">
      {!isPending && (
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          AI Proposal
        </h1>
      )}

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {stage.name === "form" && (
        <div className="flex w-full max-w-lg flex-col gap-4">
          {isPending ? (
            <DraftingLoadingAnimation />
          ) : (
            <>
              <textarea
                value={ask}
                onChange={(e) => setAsk(e.target.value)}
                placeholder="e.g. Client wants a 2-day offsite for 20 people, needs a meeting room and catering"
                rows={4}
                className="rounded-lg border border-black/8 bg-white px-4 py-3 text-sm outline-none dark:border-white/[.145] dark:bg-zinc-900"
              />
              <button
                onClick={handlePreview}
                disabled={isPending || !ask.trim()}
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
              >
                {isPending ? "Drafting..." : "Draft proposal"}
              </button>
            </>
          )}
        </div>
      )}

      {stage.name === "preview" && (
        <PreviewStage
          preview={stage.preview}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onStartOver={() => setStage({ name: "form" })}
          onConfirmed={(url) => setStage({ name: "done", url })}
          onError={setError}
        />
      )}

      {stage.name === "done" && <DoneStage url={stage.url} />}
    </div>
  );
};

export default AiProposalePage;
