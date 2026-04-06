export function getYoutubeVideoId(input?: string | null) {
  if (!input) return null;
  const raw = String(input).trim();

  // If it's already a bare ID (most common in LMS systems)
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

    const pathParts = url.pathname.split("/").filter(Boolean);
    const candidates = pathParts.filter((p) => /^[a-zA-Z0-9_-]{11}$/.test(p));
    if (candidates.length > 0) return candidates[0];

    // Sometimes the last segment includes extra params (rare)
    const last = pathParts[pathParts.length - 1] ?? "";
    const cleaned = last.split("?")[0].split("&")[0];
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) return cleaned;
  } catch {
    // Not a URL, keep trying below.
  }

  // Fallback: pull an ID-ish token from text
  const match = raw.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\b|&|\/|$)/);
  return match?.[1] ?? null;
}
