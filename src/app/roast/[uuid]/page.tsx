import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getProposal } from "@/services/proposales";
import { ProposalesApiError } from "@/utils/error-handler";
import { generateRoast } from "@/services/ai-proposale";
import { Proposal } from "@/types/proposale";
import RoastLoadingAnimation from "@/components/animations/RoastLoadingAnimation";

const uuidSchema = z.string().uuid();

const RoastText = async ({ proposal }: { proposal: Proposal }) => {
  const roast = await generateRoast(proposal);
  return (
    <p className="max-w-lg text-xl text-black dark:text-zinc-50">{roast}</p>
  );
};

const RoastResultPage = async ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const { uuid } = await params;
  const parsed = uuidSchema.safeParse(uuid);
  if (!parsed.success) notFound();

  let proposal;
  try {
    ({ data: proposal } = await getProposal(parsed.data));
  } catch (err) {
    if (err instanceof ProposalesApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <p className="text-sm uppercase tracking-widest text-zinc-500">
        {proposal.title ?? "Untitled proposal"}
      </p>
      <Suspense fallback={<RoastLoadingAnimation />}>
        <RoastText proposal={proposal} />
        <Link href="/roast" className="underline">
          Roast another
        </Link>
      </Suspense>
    </div>
  );
};

export default RoastResultPage;
