import type { ContentLibraryItem } from "@/types/proposale";
import type { ContentLibraryAnalysis } from "@/utils/validations-schema";
import DuplicateGroupsList from "@/app/product-insights/DuplicateGroupsList";

const DuplicateGroups = async ({
  promise,
  items,
  companyId,
}: {
  promise: Promise<ContentLibraryAnalysis>;
  items: ContentLibraryItem[];
  companyId?: number;
}) => {
  const { duplicateGroups } = await promise;

  if (duplicateGroups.length === 0) {
    return <p className="text-zinc-300">No likely duplicates found.</p>;
  }

  const titleByVariationId = Object.fromEntries(
    items.map((item) => [item.variationId, item.title]),
  );

  return (
    <DuplicateGroupsList
      groups={duplicateGroups}
      titleByVariationId={titleByVariationId}
      companyId={companyId}
    />
  );
};

export default DuplicateGroups;
