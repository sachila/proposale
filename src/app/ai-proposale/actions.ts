"use server";

import {
  createProposal,
  listCompanies,
  listContent,
  patchProposalData,
} from "@/services/proposales";
import { localizedText } from "@/utils/localized-text";
import { draftProposalPlan } from "@/services/ai-proposale";
import type {
  ConfirmResult,
  PreviewItem,
  PreviewResult,
  ProposalPreview,
} from "@/types/ai-proposal";
import { ContentItem } from "@/types/proposale";

const MAX_ASK_LENGTH = 2000;

// only trust variation_ids that actually exist in the live content library
const validateItems = (
  items: { variation_id: number; quantity: number; reason: string }[],
  content: ContentItem[],
) => {
  const byId = new Map(content.map((c) => [c.variation_id, c]));
  const valid: PreviewItem[] = [];
  for (const item of items) {
    const match = byId.get(item.variation_id);
    if (!match) continue;
    valid.push({
      variationId: item.variation_id,
      title: localizedText(match.title),
      quantity: item.quantity,
      reason: item.reason,
    });
  }
  return valid;
};

export const previewProposal = async (ask: string): Promise<PreviewResult> => {
  const trimmed = ask.trim();
  if (!trimmed) return { ok: false, error: "Describe what the client wants." };
  if (trimmed.length > MAX_ASK_LENGTH) {
    return { ok: false, error: "That description is too long." };
  }

  try {
    const { data: companies } = await listCompanies();
    const companyId = companies[0]?.id;
    if (!companyId) {
      return {
        ok: false,
        error: "No Proposales company found for this account.",
      };
    }

    const { data: content } = await listContent({ companyId });
    if (content.length === 0) {
      return { ok: false, error: "Your content library is empty." };
    }

    const plan = await draftProposalPlan(trimmed, content);
    const items = validateItems(plan.items, content);

    if (items.length === 0) {
      return {
        ok: false,
        error:
          "Couldn't match this to anything in your content library. Try rephrasing.",
      };
    }

    return {
      ok: true,
      preview: {
        ask: trimmed,
        companyId,
        language: plan.language,
        titleMd: plan.title_md,
        descriptionMd: plan.description_md,
        startDate: plan.start_date,
        endDate: plan.end_date,
        items,
      },
    };
  } catch {
    return { ok: false, error: "Something went wrong drafting the preview." };
  }
};

export const confirmProposal = async (
  preview: ProposalPreview,
): Promise<ConfirmResult> => {
  if (!preview.startDate || !preview.endDate) {
    return { ok: false, error: "Please enter a start and end date." };
  }

  try {
    const { data: content } = await listContent({
      companyId: preview.companyId,
    });
    const validIds = new Set(content.map((c) => c.variation_id));

    const blocks = preview.items
      .filter((item) => validIds.has(item.variationId))
      .map((item) => ({
        content_id: item.variationId,
        type: "product-block" as const,
        quantity: item.quantity,
      }));

    if (blocks.length === 0) {
      return {
        ok: false,
        error: "Those items no longer exist in your library.",
      };
    }

    const { proposal } = await createProposal({
      companyId: preview.companyId,
      language: preview.language,
      titleMd: preview.titleMd,
      descriptionMd: preview.descriptionMd,
      blocks,
    });

    try {
      await patchProposalData(proposal.uuid, {
        ai_copilot_ask: preview.ask,
        start_date: preview.startDate,
        end_date: preview.endDate,
      });
    } catch {
      throw new Error("Failed to patch proposal data.");
    }

    return { ok: true, uuid: proposal.uuid, url: proposal.url };
  } catch {
    return { ok: false, error: "Something went wrong creating the draft." };
  }
};
