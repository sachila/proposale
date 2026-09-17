export type ContentTally = { title: string; count: number };
export type DailyCount = { date: string; count: number };

export type DashboardStats = {
  proposalsConsidered: number;
  currency: string | null;
  sentCount: number;
  acceptedCount: number;
  rejectedCount: number;
  winRate: number | null;
  avgDealSize: number | null;
  totalAcceptedValue: number;
  fastestAcceptanceHours: number | null;
  mostUsedContent: ContentTally | null;
  mostViewedProposal: { title: string; views: number } | null;
  acceptedByDay: DailyCount[];
};
