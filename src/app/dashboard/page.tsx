import { Suspense } from "react";
import { listCompanies } from "@/services/proposales";
import { computeDashboardStats } from "@/services/dashboard";
import { generateDashboardNarratives } from "@/services/ai-proposale";
import { DashboardChartsSection } from "@/app/dashboard/DashboardCharts";
import { formatMoney } from "@/utils/currency";
import { formatDurationFromHours } from "@/utils/duration";
import NoResult from "./NoResult";
import CardView, { type StatCard } from "./CardView";
import DashboardSkeleton from "@/components/skeletons/dashboard/DashboardSkeleton";

const DashboardPage = async () => {
  const { data: companies } = await listCompanies();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent companyId={companies[0]?.id} />
    </Suspense>
  );
};

const DashboardContent = async ({ companyId }: { companyId?: number }) => {
  const stats = await computeDashboardStats(companyId);

  if (stats.proposalsConsidered === 0) {
    return (
      <NoResult message="Send a few proposals in Proposales first, then come back to see your dashboard." />
    );
  }

  // don't await. stats render immediately, narratives stream in once the AI call resolves
  const narratives = generateDashboardNarratives(stats);

  const amountCards: StatCard[] = [
    {
      label: "Win rate",
      value: stats.winRate ? `${Math.round(stats.winRate * 100)}%` : "—",
      narrativeKey: "winRate",
    },
    {
      label: "Average deal size",
      value: stats.avgDealSize
        ? formatMoney(stats.avgDealSize, stats.currency)
        : "—",
      narrativeKey: "avgDealSize",
    },
    {
      label: "Total accepted value",
      value: formatMoney(stats.totalAcceptedValue, stats.currency),
      narrativeKey: "totalAcceptedValue",
    },
    {
      label: "Fastest acceptance",
      value: stats.fastestAcceptanceHours
        ? formatDurationFromHours(stats.fastestAcceptanceHours)
        : "—",
      narrativeKey: "fastestAcceptance",
    },
  ];

  const summaryCards: StatCard[] = [
    {
      label: "Most-pitched product",
      value: stats.mostUsedContent?.title ?? "—",
      narrativeKey: "mostUsedContent",
    },
    {
      label: "Most-viewed proposal",
      value: stats.mostViewedProposal?.title ?? "—",
      narrativeKey: "mostViewedProposal",
    },
  ];

  return (
    <div className="overflow-y-auto bg-black text-white">
      <section className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <div className="flex w-full max-w-6xl flex-col gap-4 sm:flex-row">
          {amountCards.map((card) => (
            <CardView
              key={card.label}
              card={card}
              narrativePromise={narratives}
            />
          ))}
        </div>
      </section>

      <DashboardChartsSection stats={stats} />

      <section className="flex pb-16 flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex w-full max-w-6xl flex-col gap-4 sm:flex-row">
          {summaryCards.map((card) => (
            <CardView
              key={card.label}
              card={card}
              narrativePromise={narratives}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
