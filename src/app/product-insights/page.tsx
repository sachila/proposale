import { Suspense } from "react";
import Link from "next/link";
import { listCompanies } from "@/services/proposales";
import { getContentLibrary } from "@/services/product-insights";
import { computeContentPerformance } from "@/services/product-insights";
import {
  generatePossibleContentDuplicates,
  generateContentPerformanceInsights,
} from "@/services/ai-proposale";
import ProductInsightsSkeleton from "@/components/skeletons/product-insights/ProductInsightsSkeleton";
import DuplicateGroups from "@/app/product-insights/DuplicateGroups";
import ItemTable from "@/app/product-insights/ItemTable";
import Insights from "@/app/product-insights/Insights";
import AnalysisSkeleton from "@/components/skeletons/product-insights/AnalysisSkeleton";

const ContentLibraryPage = async () => {
  const { data: companies } = await listCompanies();

  return (
    <Suspense fallback={<ProductInsightsSkeleton />}>
      <ContentLibraryContent companyId={companies[0]?.id} />
    </Suspense>
  );
};

export default ContentLibraryPage;

const ContentLibraryContent = async ({ companyId }: { companyId?: number }) => {
  const { items } = await getContentLibrary(companyId);

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <h1 className="text-2xl font-semibold">Nothing to show yet</h1>
        <p className="max-w-sm text-zinc-400">
          Add some content items in Proposales first, then come back to have
          your library audited.
        </p>
        <Link href="/" className="underline">
          Back home
        </Link>
      </div>
    );
  }

  // don't await: item list renders immediately, the audit streams in once the AI call resolves
  const analysis = generatePossibleContentDuplicates(items);
  const performance = await computeContentPerformance(companyId);
  const insights =
    performance.blocks.length > 0
      ? generateContentPerformanceInsights(performance)
      : null;

  return (
    <div className="overflow-y-auto bg-black text-white">
      <section className="flex flex-col items-center gap-2 px-6 pt-16 text-center">
        <h1 className="text-2xl font-semibold">Product Insights</h1>
        <p className="max-w-lg text-sm text-zinc-500">
          Shows what product/services wins deals, and what is most likely to be
          duplicate products
        </p>
      </section>

      <section className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="w-full max-w-6xl rounded-md border border-zinc-700 px-6 py-8 text-left">
          <p className="mb-3 text-sm uppercase tracking-widest text-zinc-500">
            Overall insights
          </p>
          {insights ? (
            <Suspense fallback={<AnalysisSkeleton />}>
              <Insights promise={insights} />
            </Suspense>
          ) : (
            <p className="text-zinc-300">
              Not enough repeated content yet to spot a clear pattern.
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 px-6 pb-10 text-center">
        <div className="w-full max-w-6xl rounded-md border border-zinc-700 px-6 py-8 text-left">
          <p className="mb-3 text-sm uppercase tracking-widest text-zinc-500">
            Possible duplicates
          </p>
          <Suspense fallback={<AnalysisSkeleton />}>
            <DuplicateGroups
              promise={analysis}
              items={items}
              companyId={companyId}
            />
          </Suspense>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 px-6 pb-16 text-center">
        <div className="w-full max-w-6xl overflow-x-auto rounded-md border border-zinc-700 px-6 py-8 text-left">
          <p className="mb-4 text-sm uppercase tracking-widest text-zinc-500">
            Items
          </p>
          <Suspense fallback={<AnalysisSkeleton />}>
            <ItemTable promise={analysis} items={items} />
          </Suspense>
        </div>
      </section>
    </div>
  );
};
