export const formatMoney = (cents: number, currency: string | null) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "EUR",
  }).format(cents / 100);
};
