export type SpecializationMaterialRow = {
  id: string;
  material: string;
  name?: string;
  is_published: boolean;
  subsubsectionTitle: string;
  subsubsectionId: string;
  subsectionId: string;
  specializationId?: string;
  specializationName?: string;
};

/** Normalize subsections-ids API response to a flat subsection array */
export function normalizeSubsectionIdsData(raw: unknown): any[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data: unknown }).data;
    if (Array.isArray(inner)) return inner;
    if (inner && typeof inner === "object" && "data" in inner) {
      const nested = (inner as { data: unknown }).data;
      if (Array.isArray(nested)) return nested;
    }
  }
  return [];
}

/** Flatten all specialization_materials from GET /training/admin/subsections-ids/ */
export function flattenSpecializationMaterials(
  subsectionData: any[] | undefined,
): SpecializationMaterialRow[] {
  const rows: SpecializationMaterialRow[] = [];

  for (const subsection of subsectionData ?? []) {
    for (const subsub of subsection.subsubsections ?? []) {
      for (const mat of subsub.specialization_materials ?? []) {
        rows.push({
          id: String(mat.id),
          material: String(mat.material ?? mat.name ?? ""),
          name: mat.name,
          is_published: Boolean(mat.is_published),
          subsubsectionTitle: String(subsub.title ?? ""),
          subsubsectionId: String(subsub.id),
          subsectionId: String(subsection.id),
        });
      }

      for (const spec of subsub.specializations ?? []) {
        for (const mat of spec.specialization_materials ?? []) {
          rows.push({
            id: String(mat.id),
            material: String(mat.material ?? mat.name ?? ""),
            name: mat.name,
            is_published: Boolean(mat.is_published),
            subsubsectionTitle: String(subsub.title ?? ""),
            subsubsectionId: String(subsub.id),
            subsectionId: String(subsection.id),
            specializationId: String(spec.id),
            specializationName: String(spec.name ?? ""),
          });
        }
      }
    }
  }

  return rows;
}

export type SubsubsectionOption = { id: string; title: string };

export type SpecializationOption = {
  id: string;
  name: string;
  subsubsection: string;
  subsubsection_id: string;
};

/** Extract subsubsections from GET /training/admin/subsections-ids/ */
export function flattenSubsubsections(
  subsectionData: any[] | undefined,
): SubsubsectionOption[] {
  const seen = new Map<string, SubsubsectionOption>();

  for (const subsection of subsectionData ?? []) {
    for (const subsub of subsection.subsubsections ?? []) {
      const id = String(subsub.id);
      if (!seen.has(id)) {
        seen.set(id, {
          id,
          title: String(subsub.title ?? ""),
        });
      }
    }
  }

  return Array.from(seen.values());
}

/** Extract specializations from GET /training/admin/subsections-ids/ */
export function flattenSpecializations(
  subsectionData: any[] | undefined,
): SpecializationOption[] {
  const seen = new Map<string, SpecializationOption>();

  for (const subsection of subsectionData ?? []) {
    for (const subsub of subsection.subsubsections ?? []) {
      for (const spec of subsub.specializations ?? []) {
        const id = String(spec.id);
        if (!seen.has(id)) {
          seen.set(id, {
            id,
            name: String(spec.name ?? ""),
            subsubsection: String(subsub.id),
            subsubsection_id: String(subsub.id),
          });
        }
      }
    }
  }

  return Array.from(seen.values());
}

export function buildSpecializationMaterialPayload(data: {
  material: string;
  is_published: boolean;
  subsubsection?: string;
  specialization?: string;
}) {
  const base = {
    name: data.material,
    material: data.material,
    is_published: data.is_published,
  };

  if (data.specialization) {
    return { ...base, specializations: [data.specialization] };
  }

  if (data.subsubsection) {
    return { ...base, subsubsections: [data.subsubsection] };
  }

  return base;
}
