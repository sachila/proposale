import { ProposalSearchResult, Proposal } from "@/types/proposale";
import { getProposal, searchProposals } from "./proposales";
import { DashboardStats, ContentTally, DailyCount } from "@/types/dashboard";

// only sent/decided proposals count toward stats; drafts and templates are noise
const RELEVANT_STATUSES = new Set([
  "active",
  "expired",
  "accepted",
  "replaced",
  "rejected",
  "withdrawn",
]);

export const computeDashboardStats = async (
  companyId?: number,
): Promise<DashboardStats> => {
  const { data: results } = await searchProposals({
    companyId,
    limit: 100,
    excludeRevisionDrafts: true,
  });

  const relevant = results.filter((r: ProposalSearchResult) =>
    r.status ? RELEVANT_STATUSES.has(r.status) : false,
  );

  const proposals = await Promise.all(
    relevant.map((r) => getProposal(r.uuid).then((res) => res.data)),
  );

  const accepted = proposals.filter((p) => p.status === "accepted");
  const rejected = proposals.filter((p) => p.status === "rejected");

  const decidedCount = accepted.length + rejected.length;

  const avgDealSize = accepted.length
    ? accepted.reduce((sum, p) => sum + p.value_with_tax, 0) / accepted.length
    : null;

  const totalAcceptedValue = accepted.reduce(
    (sum, p) => sum + p.value_with_tax,
    0,
  );

  const fastestAcceptanceHours = computeFastestAcceptance(accepted);
  const mostUsedContent = computeMostUsedContent(proposals);
  const mostViewedProposal = computeMostViewed(proposals);
  const acceptedByDay = computeAcceptedByDay(accepted);

  return {
    proposalsConsidered: proposals.length,
    currency: proposals[0]?.currency ?? null,
    sentCount: proposals.length,
    acceptedCount: accepted.length,
    rejectedCount: rejected.length,
    winRate: decidedCount ? accepted.length / decidedCount : null,
    avgDealSize,
    totalAcceptedValue,
    fastestAcceptanceHours,
    mostUsedContent,
    mostViewedProposal,
    acceptedByDay,
  };
};

const computeFastestAcceptance = (accepted: Proposal[]): number | null => {
  const durations = accepted
    .map((p) => {
      const sentAt = p.tracking.sent_at;
      const acceptedAt = p.tracking.accepted_at;
      if (!sentAt || !acceptedAt) return null;
      const hours =
        (new Date(acceptedAt).getTime() - new Date(sentAt).getTime()) /
        (1000 * 60 * 60);
      return hours >= 0 ? hours : null;
    })
    .filter((h): h is number => h !== null);

  return durations.length ? Math.min(...durations) : null;
};

const computeMostUsedContent = (proposals: Proposal[]): ContentTally | null => {
  const counts = new Map<string, number>();
  for (const proposal of proposals) {
    for (const block of proposal.blocks) {
      if (block.type !== "product-block" || !block.title) continue;
      counts.set(block.title, (counts.get(block.title) ?? 0) + 1);
    }
  }

  let best: ContentTally | null = null;
  for (const [title, count] of counts) {
    if (!best || count > best.count) best = { title, count };
  }
  return best;
};

const computeMostViewed = (
  proposals: Proposal[],
): { title: string; views: number } | null => {
  let best: { title: string; views: number } | null = null;
  for (const proposal of proposals) {
    const views = proposal.tracking.number_of_views ?? 0;
    if (!best || views > best.views) {
      best = { title: proposal.title ?? "Untitled proposal", views };
    }
  }
  return best && best.views > 0 ? best : null;
};

// counts accepted deals per calendar day (UTC), sorted chronologically
const computeAcceptedByDay = (accepted: Proposal[]): DailyCount[] => {
  const counts = new Map<string, number>();
  for (const proposal of accepted) {
    const acceptedAt = proposal.tracking.accepted_at;
    if (!acceptedAt) continue;
    const date = new Date(acceptedAt).toISOString().slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
