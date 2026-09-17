export const formatDurationFromHours = (hours: number) => {
  const totalSeconds = hours * 3600;

  if (totalSeconds < 60) return `${Math.round(totalSeconds)}s`;
  if (totalSeconds < 3600) return `${Math.round(totalSeconds / 60)}m`;
  return `${Math.round(hours)}h`;
};
