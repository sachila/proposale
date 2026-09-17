import { DashboardNarratives } from "@/utils/validations-schema";

const Narrative = async ({
  narrativePromise,
  field,
}: {
  narrativePromise: Promise<DashboardNarratives>;
  field: keyof DashboardNarratives;
}) => {
  const narratives = await narrativePromise;
  return <p className="text-sm text-zinc-300">{narratives[field]}</p>;
};

export default Narrative;
