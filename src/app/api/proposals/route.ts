import { listCompanies, searchProposals } from "@/services/proposales";

export async function GET() {
  const { data: companies } = await listCompanies();
  const companyId = companies[0]?.id;

  const { data: proposals } = await searchProposals({
    companyId,
    limit: 25,
    excludeRevisionDrafts: true,
  });

  return Response.json({
    proposals: proposals
      .filter(
        (p) => p.status && p.status !== "draft" && p.status !== "template",
      )
      .map((p) => ({ uuid: p.uuid, title: p.title, status: p.status })),
  });
}
