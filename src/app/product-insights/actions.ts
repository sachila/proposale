"use server";

import { deleteContent, listContent } from "@/services/proposales";

export type DeleteContentResult = { ok: true } | { ok: false; error: string };

export const deleteContentItem = async (
  companyId: number | undefined,
  variationId: number,
): Promise<DeleteContentResult> => {
  try {
    const { data: content } = await listContent({ companyId });
    const exists = content.some((c) => c.variation_id === variationId);
    if (!exists) {
      return {
        ok: false,
        error: "That item no longer exists in your content library.",
      };
    }

    const { data } = await deleteContent({ variationId });
    if (!data.success) {
      return { ok: false, error: data.message || "Failed to delete the item." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong deleting this item." };
  }
};
