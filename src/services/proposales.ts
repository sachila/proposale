import {
  Company,
  ContentItem,
  CreateProposalInput,
  Proposal,
  ProposalMutationResponse,
  ProposalSearchResult,
} from "@/types/proposale";
import { ProposalesApiError } from "@/utils/error-handler";

const BASE_URL = "https://api.proposales.com";

const proposalesFetch = async <T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> => {
  const apiKey = process.env.PROPOSALES_API_KEY;
  if (!apiKey) {
    throw new Error("PROPOSALES_API_KEY is not set");
  }

  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ProposalesApiError(
      body?.error?.message ?? `Proposales API request failed (${res.status})`,
      res.status,
    );
  }

  return res.json();
};

export const listCompanies = () => {
  return proposalesFetch<{ data: Company[] }>("/v3/companies");
};

export const searchProposals = (opts: {
  companyId?: number;
  limit?: number;
  includeArchived?: boolean;
  excludeRevisionDrafts?: boolean;
}) => {
  return proposalesFetch<{ data: ProposalSearchResult[] }>(
    "/v3/proposal-search",
    {
      company_id: opts.companyId,
      limit: opts.limit,
      include_archived: opts.includeArchived,
      exclude_revision_drafts: opts.excludeRevisionDrafts,
    },
  );
};

export const getProposal = (uuid: string) => {
  return proposalesFetch<{ data: Proposal }>(`/v3/proposals/${uuid}`);
};

export const listContent = (opts: { companyId?: number }) => {
  return proposalesFetch<{ data: ContentItem[] }>("/v3/content", {
    company_id: opts.companyId,
  });
};

export const createProposal = async (input: CreateProposalInput) => {
  const apiKey = process.env.PROPOSALES_API_KEY;
  if (!apiKey) throw new Error("PROPOSALES_API_KEY is not set");

  const res = await fetch(new URL("/v3/proposals", BASE_URL), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_id: input.companyId,
      language: input.language,
      title_md: input.titleMd,
      description_md: input.descriptionMd,
      blocks: input.blocks,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ProposalesApiError(
      body?.error?.message ?? `Proposales API request failed (${res.status})`,
      res.status,
    );
  }

  return res.json() as Promise<ProposalMutationResponse>;
};

export const patchProposalData = async (
  uuid: string,
  data: Record<string, string>,
) => {
  const apiKey = process.env.PROPOSALES_API_KEY;
  if (!apiKey) throw new Error("PROPOSALES_API_KEY is not set");

  const res = await fetch(new URL(`/v3/proposals/${uuid}/data`, BASE_URL), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ProposalesApiError(
      body?.error?.message ?? `Proposales API request failed (${res.status})`,
      res.status,
    );
  }
};
