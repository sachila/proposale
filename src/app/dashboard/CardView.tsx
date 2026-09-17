import { Suspense } from "react";
import type { DashboardNarratives } from "@/utils/validations-schema";
import { NarrativeSkeleton } from "../../components/skeletons/dashboard/DashboardSkeleton";
import Narrative from "../../components/Narrative";

export interface StatCard {
  label: string;
  value: string;
  narrativeKey: keyof DashboardNarratives;
}

const CardView = ({
  card,
  narrativePromise,
}: {
  card: StatCard;
  narrativePromise: Promise<DashboardNarratives>;
}) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-md border border-zinc-700 px-6 py-8 text-center">
      <p className="text-sm uppercase tracking-widest text-zinc-500">
        {card.label}
      </p>
      <p className="text-4xl font-bold">{card.value}</p>
      <Suspense fallback={<NarrativeSkeleton />}>
        <Narrative
          narrativePromise={narrativePromise}
          field={card.narrativeKey}
        />
      </Suspense>
    </div>
  );
};

export default CardView;
