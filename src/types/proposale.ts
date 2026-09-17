export type Company = {
  id: number;
  name: string;
  currency: string;
  timezone: string;
};

export const CONTENT_CATEGORIES = [
  "Product",
  "Service",
  "Add-on",
  "Consulting",
  "Support & Maintenance",
  "Training",
  "Discount / Bundle",
  "Video",
  "Other",
] as const;

export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

export type ContentLibraryItem = {
  productId: number;
  variationId: number;
  title: string;
  description: string;
};

export type ContentLibraryResult = {
  totalItems: number;
  consideredItems: number;
  items: ContentLibraryItem[];
};

export type ProposalStatus =
  | "accepted"
  | "replaced"
  | "active"
  | "draft"
  | "expired"
  | "rejected"
  | "template"
  | "withdrawn"
  | null;

export type ProposalSearchResult = {
  created_at: number;
  updated_at: number;
  title: string;
  uuid: string;
  series_uuid: string;
  company_id: number;
  version: number | null;
  status: ProposalStatus;
  url: string;
};

export type ProposalBlock = {
  uuid: string;
  type: "product-block" | "video-block";
  title?: string;
  content_id?: number;
  quantity?: number;
};

export type ProposalTracking = {
  sent_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  withdrawn_at?: string;
  expired_at?: string;
  first_viewed_at?: string;
  last_viewed_at?: string;
  number_of_views?: number;
};

export type Proposal = {
  uuid: string;
  title: string | null;
  description_md: string | null;
  company_id: number;
  status: ProposalStatus;
  currency: string;
  value_with_tax: number;
  value_without_tax: number;
  blocks: ProposalBlock[];
  tracking: ProposalTracking;
  recipient_name: string | null;
  recipient_company_name: string | null;
};

export type ContentItem = {
  product_id: number;
  variation_id: number;
  title: Record<string, string>;
  description: Record<string, string>;
};

export type CreateProposalBlock = {
  content_id: number;
  type: "product-block";
  quantity: number;
};

export type CreateProposalInput = {
  companyId: number;
  language: string;
  titleMd: string;
  descriptionMd: string;
  blocks: CreateProposalBlock[];
};

export type ProposalMutationResponse = {
  proposal: { uuid: string; url: string };
};
export type BlockPerformance = {
  key: string;
  title: string;
  type: "product-block" | "video-block";
  acceptedWithBlock: number;
  rejectedWithBlock: number;
  totalWithBlock: number;
  winRateWithBlock: number;
  winRateWithoutBlock: number | null;
  liftPct: number | null;
};

export type ProposalListItem = {
  uuid: string;
  title: string | null;
  status: "accepted" | "rejected";
  value_with_tax: number;
  blockTitles: string[];
};

export type ContentPerformanceResult = {
  proposalsConsidered: number;
  currency: string | null;
  acceptedCount: number;
  rejectedCount: number;
  overallWinRate: number | null;
  blocks: BlockPerformance[];
  proposals: ProposalListItem[];
};
