import "./DashboardSkeleton.css";

export const NarrativeSkeleton = () => {
  return (
    <p aria-hidden className="h-5 w-40 animate-pulse rounded bg-zinc-800" />
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="overflow-y-auto bg-black text-white">
      <section className="flex pt-16 flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex w-full max-w-6xl flex-col gap-4 sm:flex-row">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center justify-center gap-3 rounded-md border border-zinc-800 px-6 py-8"
            >
              <div className="skeleton-shimmer h-3 w-24 rounded" />
              <div className="skeleton-shimmer h-9 w-20 rounded" />
              <div className="skeleton-shimmer h-5 w-32 rounded" />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <div className="flex w-full max-w-6xl flex-col gap-4 sm:flex-row">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center justify-center gap-4 rounded-md border border-zinc-800 px-6 py-8"
            >
              <div className="skeleton-shimmer h-3 w-40 rounded" />
              <div className="skeleton-shimmer h-48 w-full rounded" />
            </div>
          ))}
        </div>
      </section>

      <section className="flex pb-16 flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex w-full max-w-6xl flex-col gap-4 sm:flex-row">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center justify-center gap-3 rounded-md border border-zinc-800 px-6 py-8"
            >
              <div className="skeleton-shimmer h-3 w-32 rounded" />
              <div className="skeleton-shimmer h-9 w-28 rounded" />
              <div className="skeleton-shimmer h-5 w-40 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardSkeleton;
