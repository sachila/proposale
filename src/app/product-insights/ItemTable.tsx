import type { ContentLibraryItem } from "@/types/proposale";
import type { ContentLibraryAnalysis } from "@/utils/validations-schema";

const ItemTable = async ({
  promise,
  items,
}: {
  promise: Promise<ContentLibraryAnalysis>;
  items: ContentLibraryItem[];
}) => {
  const { itemNotes } = await promise;
  const noteByVariationId = new Map(
    itemNotes.map((note) => [note.variationId, note]),
  );

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500">
          <th className="py-2 pr-4 text-left font-medium">Title</th>
          <th className="py-2 pr-4 text-left font-medium">Tags</th>
          <th className="py-2 text-left font-medium">Title feedback</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const note = noteByVariationId.get(item.variationId);
          return (
            <tr key={item.variationId} className="border-b border-zinc-900">
              <td className="py-2 pr-4">{item.title || "Untitled item"}</td>
              <td className="py-2 pr-4 text-zinc-400">
                {note?.tags.join(", ") || "—"}
              </td>
              <td className="py-2 text-zinc-400">
                {note?.titleIssue
                  ? `${note.titleIssue}${
                      note.suggestedTitle ? ` → "${note.suggestedTitle}"` : ""
                    }`
                  : "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ItemTable;
