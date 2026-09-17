"use client";

import { DailyCount, DashboardStats } from "@/types/dashboard";
import { BarChart } from "../../components/charts/BarChart";
import { PieChart } from "../../components/charts/PieChart";

// matches the site's dark-theme foreground and zinc palette instead of green/red
const BAR_COLOR = "#ededed";
const ACCEPTED_COLOR = "#ededed";
const REJECTED_COLOR = "#52525b";

const AcceptedByDayChart = ({ data }: { data: DailyCount[] }) => {
  return (
    <BarChart
      data={data}
      xAxisKey="date"
      dataKey="count"
      name="Deals accepted"
      color={BAR_COLOR}
    />
  );
};

const AcceptedVsRejectedChart = ({
  accepted,
  rejected,
}: {
  accepted: number;
  rejected: number;
}) => {
  const data = [
    { name: "Accepted", value: accepted, color: ACCEPTED_COLOR },
    { name: "Rejected", value: rejected, color: REJECTED_COLOR },
  ];

  return <PieChart data={data} />;
};

export const DashboardChartsSection = ({
  stats,
}: {
  stats: DashboardStats;
}) => {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex w-full max-w-6xl flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-md border border-zinc-700 px-6 py-8">
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Deals accepted per day
          </p>
          {stats.acceptedByDay.length > 0 ? (
            <div className="w-full">
              <AcceptedByDayChart data={stats.acceptedByDay} />
            </div>
          ) : (
            <p className="text-lg text-zinc-300">No accepted deals yet.</p>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-md border border-zinc-700 px-6 py-8">
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Accepted vs rejected
          </p>
          {stats.acceptedCount + stats.rejectedCount > 0 ? (
            <div className="w-full">
              <AcceptedVsRejectedChart
                accepted={stats.acceptedCount}
                rejected={stats.rejectedCount}
              />
            </div>
          ) : (
            <p className="text-lg text-zinc-300">
              No decided proposals yet. Accept or reject a proposal to see the
              ratio.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
