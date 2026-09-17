"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProposalOption = { uuid: string; title: string; status: string };

const RoastPickerPage = () => {
  const router = useRouter();
  const [proposals, setProposals] = useState<ProposalOption[] | null>(null);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/proposals")
      .then((res) => res.json())
      .then((data) => setProposals(data.proposals))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Pick a proposal to roast
      </h1>

      {error && (
        <p className="text-red-600 dark:text-red-400">
          Couldn&apos;t load your proposals. Try again later.
        </p>
      )}

      {!error && !proposals && (
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      )}

      {proposals && proposals.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">
          No sent proposals found yet.
        </p>
      )}

      {proposals && proposals.length > 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selected) router.push(`/roast/${selected}`);
          }}
          className="flex w-full max-w-md flex-col gap-4"
        >
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-lg border border-black/8 bg-white px-4 py-2 text-sm dark:border-white/[.145] dark:bg-zinc-900"
          >
            <option value="" disabled>
              Select a proposal
            </option>
            {proposals.map((p) => (
              <option key={p.uuid} value={p.uuid}>
                {p.title} ({p.status})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selected}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            Roast this
          </button>
        </form>
      )}
    </div>
  );
};

export default RoastPickerPage;
