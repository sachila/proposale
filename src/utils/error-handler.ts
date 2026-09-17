export class ProposalesApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ProposalesApiError";
  }
}
