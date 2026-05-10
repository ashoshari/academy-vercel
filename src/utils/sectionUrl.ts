/** Spaces → hyphens; strip characters that break path segments or query parsing. */
export function normalizeSectionSegment(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[/\\?#&=+%]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** URL segment from title when unique; suffix id when titles collide after normalization. */
export function getSectionUrlSegment(
  section: { id: string; title?: string },
  allSections: { id: string; title?: string }[],
): string {
  const primary =
    normalizeSectionSegment(section.title ?? "") || section.id;
  const primaryFor = (s: { id: string; title?: string }) =>
    normalizeSectionSegment(s.title ?? "") || s.id;

  const hasConflict = allSections.some(
    (s) => s.id !== section.id && primaryFor(s) === primary,
  );

  if (hasConflict) {
    return `${primary}-${section.id}`;
  }
  return primary;
}

/** Prefer training API sections for uniqueness; fallback to footer peers if list not loaded yet. */
export function resolveSectionUrlSegment(
  item: { id: string; title?: string },
  trainingSections: { id: string; title?: string }[] | undefined,
  fallbackPeers: { id: string; title?: string }[],
): string {
  const peers =
    trainingSections && trainingSections.length > 0
      ? trainingSections
      : fallbackPeers;
  const node =
    trainingSections?.find((s) => String(s.id) === String(item.id)) ?? item;
  return getSectionUrlSegment(node, peers);
}

export function findSectionByUrlSegment(
  segment: string | undefined,
  sections: { id: string; title?: string }[] | undefined,
): { id: string; title?: string } | undefined {
  if (!segment || !sections?.length) return undefined;
  return sections.find((node) => {
    const seg = getSectionUrlSegment(node, sections);
    return seg === segment || String(node.id) === segment;
  });
}
