import "../dashboard/DashboardSkeleton.css";

const ProductInsightsSkeleton = () => {
  return (
    <div className="overflow-y-auto bg-black text-white">
      <section className="flex flex-col items-center gap-4 px-6 pt-16 text-center">
        <div className="skeleton-shimmer h-8 w-64 rounded" />
      </section>

      <section className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="w-full max-w-6xl space-y-2 rounded-md border border-zinc-800 px-6 py-8">
          <div className="skeleton-shimmer h-4 w-1/2 rounded" />
          <div className="skeleton-shimmer h-4 w-1/3 rounded" />
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 px-6 pb-16 text-center">
        <div className="skeleton-shimmer h-96 w-full max-w-6xl rounded-md" />
      </section>
    </div>
  );
};

export default ProductInsightsSkeleton;
