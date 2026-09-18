import { ExpiringProposal } from "@/types/proposale";

const formatTimeRemaining = (expiresAt: number) => {
  const msLeft = expiresAt - Date.now();
  const totalMinutes = Math.max(0, Math.round(msLeft / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `Expires in ${minutes}m`;
  return `Expires in ${hours}h ${minutes}m`;
};

const buildMailtoUrl = (proposal: ExpiringProposal) => {
  const subject = `Reminder: your proposal "${proposal.title ?? "proposal"}" is expiring soon`;
  const bodyLines = [
    `Hi ${proposal.recipientName ?? "there"},`,
    "",
    `Just a quick reminder that your proposal${proposal.title ? ` "${proposal.title}"` : ""} is expiring soon and hasn't been signed yet.`,
    proposal.url ? `You can review and sign it here: ${proposal.url}` : "",
    "",
    "Let me know if you have any questions.",
  ].filter(Boolean);

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join("\n"),
  });

  return `mailto:${proposal.recipientEmail}?${params.toString()}`;
};

const ExpiringProposalsList = ({
  proposals,
}: {
  proposals: ExpiringProposal[];
}) => {
  return (
    <ul className="space-y-4">
      {proposals.map((proposal) => (
        <li
          key={proposal.uuid}
          className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-4 last:border-b-0 last:pb-0"
        >
          <div>
            <p className="font-medium">{proposal.title ?? "Untitled proposal"}</p>
            <p className="text-sm text-zinc-400">
              {proposal.recipientName ?? "Unknown recipient"}
              {proposal.recipientEmail ? ` · ${proposal.recipientEmail}` : ""}
            </p>
            <p className="text-sm text-amber-400">
              {formatTimeRemaining(proposal.expiresAt)}
            </p>
          </div>
          {proposal.recipientEmail ? (
            <a
              href={buildMailtoUrl(proposal)}
              className="shrink-0 rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:bg-white/8"
            >
              Send reminder
            </a>
          ) : (
            <span className="shrink-0 text-xs text-zinc-500">
              No email on file
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ExpiringProposalsList;
