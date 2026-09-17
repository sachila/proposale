import { z } from "zod";
import { CONTENT_CATEGORIES } from "@/types/proposale";

export const narrativeSchema = z.object({
  winRate: z.string(),
  avgDealSize: z.string(),
  totalAcceptedValue: z.string(),
  fastestAcceptance: z.string(),
  mostUsedContent: z.string(),
  mostViewedProposal: z.string(),
});

export type DashboardNarratives = z.infer<typeof narrativeSchema>;

export const contentPerformanceInsightsSchema = z.object({
  insights: z.array(z.string()).min(2).max(4),
});

export type ContentPerformanceInsights = z.infer<
  typeof contentPerformanceInsightsSchema
>;

export const contentLibraryAnalysisSchema = z.object({
  duplicateGroups: z.array(
    z.object({
      label: z.string(),
      reason: z.string(),
      variationIds: z.array(z.number()).min(2),
    }),
  ),
  itemNotes: z.array(
    z.object({
      variationId: z.number(),
      tags: z.array(z.enum(CONTENT_CATEGORIES)).max(3),
      titleIssue: z.string().nullable(),
      suggestedTitle: z.string().nullable(),
    }),
  ),
});

export type ContentLibraryAnalysis = z.infer<
  typeof contentLibraryAnalysisSchema
>;

export const proposalPlanSchema = z.object({
  title_md: z.string(),
  description_md: z.string(),
  language: z.string().length(2),
  // ISO "YYYY-MM-DD", only when explicitly stated in the ask - null otherwise
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  items: z
    .array(
      z.object({
        variation_id: z.number(),
        quantity: z.number().min(1).max(50),
        reason: z.string(),
      }),
    )
    .max(12),
});

export type ProposalPlan = z.infer<typeof proposalPlanSchema>;
