import {
  BlockPerformance,
  ContentLibraryResult,
  ContentPerformanceResult,
  Proposal,
} from "@/types/proposale";
import { getProposal, listContent, searchProposals } from "./proposales";
import { localizedText } from "@/utils/localized-text";

const blockKey = (block: Proposal["blocks"][number]) => {
  return `${block.type}:${block.title ?? "untitled"}`;
};

type BlockTally = {
  title: string;
  type: BlockPerformance["type"];
  accepted: number;
  rejected: number;
};

// dedupes blocks per proposal (a block appearing twice in one proposal only counts once)
// and tallies how often each block shows up in an accepted vs. rejected proposal
const tallyBlocksByOutcome = (proposals: Proposal[]): Map<string, BlockTally> => {
  const tallies = new Map<string, BlockTally>();

  for (const proposal of proposals) {
    const uniqueBlocks = new Map(
      proposal.blocks
        .filter((block) => block.title)
        .map((block) => [blockKey(block), block] as const),
    );

    for (const [key, block] of uniqueBlocks) {
      const tally = tallies.get(key) ?? {
        title: block.title!,
        type: block.type,
        accepted: 0,
        rejected: 0,
      };
      if (proposal.status === "accepted") tally.accepted += 1;
      else tally.rejected += 1;
      tallies.set(key, tally);
    }
  }

  return tallies;
};

const toBlockPerformance = (
  key: string,
  tally: BlockTally,
  totalDecided: number,
  totalAccepted: number,
): BlockPerformance => {
  const totalWithBlock = tally.accepted + tally.rejected;
  const totalWithoutBlock = totalDecided - totalWithBlock;
  const acceptedWithoutBlock = totalAccepted - tally.accepted;
  const winRateWithBlock = tally.accepted / totalWithBlock;
  const winRateWithoutBlock =
    totalWithoutBlock > 0 ? acceptedWithoutBlock / totalWithoutBlock : null;
  const liftPct =
    winRateWithoutBlock !== null && winRateWithoutBlock > 0
      ? ((winRateWithBlock - winRateWithoutBlock) / winRateWithoutBlock) * 100
      : null;

  return {
    key,
    title: tally.title,
    type: tally.type,
    acceptedWithBlock: tally.accepted,
    rejectedWithBlock: tally.rejected,
    totalWithBlock,
    winRateWithBlock,
    winRateWithoutBlock,
    liftPct,
  };
};

export const getContentLibrary = async (
  companyId?: number,
): Promise<ContentLibraryResult> => {
  const { data } = await listContent({ companyId });

  const items = data.map((item) => ({
    productId: item.product_id,
    variationId: item.variation_id,
    title: localizedText(item.title),
    description: localizedText(item.description),
  }));

  return {
    totalItems: data.length,
    consideredItems: items.length,
    items,
  };
};

export const computeContentPerformance = async (
  companyId?: number,
): Promise<ContentPerformanceResult> => {
  const { data: results } = await searchProposals({
    companyId,
    limit: 100,
    excludeRevisionDrafts: true,
  });

  // correlation needs a binary outcome, so only decided proposals count
  const decided = results.filter(
    (r) => r.status === "accepted" || r.status === "rejected",
  );

  const proposals = await Promise.all(
    decided.map((r) => getProposal(r.uuid).then((res) => res.data)),
  );

  const accepted = proposals.filter((p) => p.status === "accepted");
  const rejected = proposals.filter((p) => p.status === "rejected");
  const totalDecided = proposals.length;

  const tallies = tallyBlocksByOutcome(proposals);
  const blocks = [...tallies.entries()]
    .map(([key, tally]) =>
      toBlockPerformance(key, tally, totalDecided, accepted.length),
    )
    .sort((a, b) => (b.liftPct ?? -Infinity) - (a.liftPct ?? -Infinity));

  return {
    proposalsConsidered: totalDecided,
    currency: proposals[0]?.currency ?? null,
    acceptedCount: accepted.length,
    rejectedCount: rejected.length,
    overallWinRate: totalDecided ? accepted.length / totalDecided : null,
    blocks,
    proposals: proposals.map((p) => ({
      uuid: p.uuid,
      title: p.title,
      status: p.status as "accepted" | "rejected",
      value_with_tax: p.value_with_tax,
      blockTitles: [
        ...new Set(p.blocks.map((b) => b.title).filter(Boolean)),
      ] as string[],
    })),
  };
};
