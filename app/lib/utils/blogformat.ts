export function readingTime(text: string) {
  const words = (text || "").trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 180));
  return `${mins} min read`;
}

export function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return date;
  }
}
