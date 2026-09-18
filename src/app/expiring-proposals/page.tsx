import { Suspense } from "react";
import Link from "next/link";
import { listCompanies, listExpiringProposals } from "@/services/proposales";
import ExpiringProposalsList from "@/app/expiring-proposals/ExpiringProposalsList";

const ExpiringProposalsPage = async () => {
  const { data: companies } = await listCompanies();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ExpiringProposalsContent companyId={companies[0]?.id} />
    </Suspense>
  );
};

export default ExpiringProposalsPage;

const ExpiringProposalsContent = async ({
  companyId,
}: {
  companyId?: number;
}) => {
  const proposals = await listExpiringProposals(companyId);

  return (
    <div className="overflow-y-auto bg-black text-white">
      <section className="flex flex-col items-center gap-2 px-6 pt-16 text-center">
        <h1 className="text-2xl font-semibold">Expiring Soon</h1>
        <p className="max-w-lg text-sm text-zinc-500">
          Unsigned proposals that will expire in the next 24 hours
        </p>
      </section>

      <section className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="w-full max-w-4xl rounded-md border border-zinc-700 px-6 py-8 text-left">
          {proposals.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <p className="text-zinc-300">
                Nothing expiring in the next 24 hours.
              </p>
              <Link href="/" className="text-sm underline">
                Back home
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm uppercase tracking-widest text-zinc-500">
                Proposals ({proposals.length})
              </p>
              <ExpiringProposalsList proposals={proposals} />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const PageSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-black text-zinc-500">
      Loading...
    </div>
  );
};
