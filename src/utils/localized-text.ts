// content title/description come keyed by language code, e.g. { en: "..." }
export const localizedText = (value: Record<string, string> | undefined) => {
  if (!value) return "";
  return value.en ?? Object.values(value)[0] ?? "";
};
