import type { ContentPerformanceInsights } from "@/utils/validations-schema";

const Insights = async ({
  promise,
}: {
  promise: Promise<ContentPerformanceInsights>;
}) => {
  const { insights } = await promise;
  return (
    <ul className="list-inside list-disc space-y-2 text-zinc-300">
      {insights.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
};

export default Insights;
