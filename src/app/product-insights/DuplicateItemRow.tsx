import { useState, useTransition } from "react";
import { deleteContentItem } from "./actions";

export const DuplicateItemRow = ({
  id,
  title,
  companyId,
  onDeleted,
}: {
  id: number;
  title: string;
  companyId?: number;
  onDeleted: (id: number) => void;
}) => {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteContentItem(companyId, id);
      if (result.ok) {
        onDeleted(id);
      } else {
        setError(result.error);
        setConfirming(false);
      }
    });
  };

  return (
    <li className="flex items-start justify-between gap-3">
      <div>
        <span>{title}</span>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
      {confirming ? (
        <span className="flex shrink-0 gap-2 text-xs">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-md border border-red-800 px-2 py-1 text-red-400 transition-colors hover:bg-red-950 disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Confirm delete?"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="rounded-md border border-zinc-700 px-2 py-1 text-zinc-300 transition-colors hover:bg-white/8 disabled:opacity-50"
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="shrink-0 rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 transition-colors hover:border-red-800 hover:text-red-400"
        >
          Delete
        </button>
      )}
    </li>
  );
};
