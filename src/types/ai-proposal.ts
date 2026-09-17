export type PreviewItem = {
  variationId: number;
  title: string;
  quantity: number;
  reason: string;
};

export type ProposalPreview = {
  ask: string;
  companyId: number;
  language: string;
  titleMd: string;
  descriptionMd: string;
  startDate: string | null;
  endDate: string | null;
  items: PreviewItem[];
};

export type PreviewResult =
  | { ok: true; preview: ProposalPreview }
  | { ok: false; error: string };

export type ConfirmResult =
  | { ok: true; uuid: string; url: string }
  | { ok: false; error: string };
