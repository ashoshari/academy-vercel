export type CourseFormMode = "create" | "clone";

export function buildCourseFormData(
  course: any,
  mode: CourseFormMode,
  role: string,
): FormData {
  const fd = new FormData();
  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;
    fd.append(key, value instanceof File ? value : String(value));
  };

  append("name", course?.name);
  append("short_description", course?.short_description);
  append("long_description", course?.long_description);
  if (role !== "teacher") append("teacher", course?.teacher);
  append("time_in_hours", course?.time_in_hours);
  append("image", course?.image instanceof File ? course?.image : undefined);

  // booleans: in clone everything optional; in create we still keep your defaults
  const appendBool = (key: string, value: unknown) => {
    if (mode === "clone") {
      if (value === undefined || value === null) return;
      fd.append(key, String(Boolean(value)));
      return;
    }
    // create: preserve existing behavior (only append when truthy)
    if (value) fd.append(key, String(Boolean(value)));
  };

  appendBool("is_free", course?.is_free);
  append("card_price", course?.card_price);
  append("start_date", course?.start_date);
  append("end_date", course?.end_date);
  appendBool("is_published", course?.is_published);
  appendBool("is_special", course?.is_special);
  appendBool("is_show_general_questions", course?.is_show_general_questions);

  append("subsection", course?.subsection);
  append("subsubsection", course?.subsubsection);
  append("specialization", course?.specialization);
  append("specialization_material", course?.specialization_material);

  if (
    Array.isArray(course?.import_offer_target_ids) &&
    course.import_offer_target_ids.length > 0
  ) {
    // UI is single-select → send a single UUID value (only if present)
    const id = course.import_offer_target_ids[0];
    if (id) fd.append("import_offer_target_ids", String(id));
  }

  return fd;
}

function parseImportOfferTargetIds(course: any): string[] {
  const fromIds = Array.isArray(course?.import_offer_target_ids)
    ? course.import_offer_target_ids
    : [];
  const fromTargets = Array.isArray(course?.import_offer_targets)
    ? course.import_offer_targets
    : [];

  const ids: string[] = [];
  const push = (item: unknown) => {
    if (typeof item === "string" && item) ids.push(item);
    else if (
      item &&
      typeof item === "object" &&
      "id" in (item as Record<string, unknown>)
    ) {
      const id = String((item as { id: string }).id);
      if (id) ids.push(id);
    }
  };
  for (const item of fromIds) push(item);
  for (const item of fromTargets) push(item);
  return [...new Set(ids)];
}

export function courseWithNormalizedOfferImports(course: any) {
  if (!course) return course;

  const ids = parseImportOfferTargetIds(course).slice(0, 1);

  if (ids.length === 0) {
    // ❌ remove the field completely
    const { ...rest } = course;
    return rest;
  }

  return { ...course, import_offer_target_ids: ids };
}

export function toCloneDraft(course: any) {
  const normalized = courseWithNormalizedOfferImports(course);
  return {
    name: normalized?.name,
    short_description: normalized?.short_description ?? null,
    long_description: normalized?.long_description ?? null,
    teacher: normalized?.teacher?.id ?? normalized?.teacher ?? undefined,
    time_in_hours: normalized?.time_in_hours ?? undefined,
    image: undefined, // do not prefill file input
    is_free: normalized?.is_free,
    card_price: normalized?.card_price?.id ?? normalized?.card_price ?? null,
    start_date: normalized?.start_date ?? null,
    end_date: normalized?.end_date ?? null,
    is_published: normalized?.is_published,
    is_special: normalized?.is_special,
    is_show_general_questions: normalized?.is_show_general_questions,
    subsection: normalized?.subsection?.id ?? normalized?.subsection ?? null,
    subsubsection:
      normalized?.subsubsection?.id ?? normalized?.subsubsection ?? null,
    specialization:
      normalized?.specialization?.id ?? normalized?.specialization ?? null,
    specialization_material:
      normalized?.specialization_material?.id ??
      normalized?.specialization_material ??
      null,
    import_offer_target_ids: normalized?.import_offer_target_ids ?? [],
  };
}

export function buildImportOfferEditOptions(
  picklistData: any[] | undefined,
  editingCourseId: string | undefined,
  selectedCourse: any,
) {
  const base =
    picklistData
      ?.filter((c: any) => String(c.id) !== String(editingCourseId))
      .map((c: any) => ({
        id: String(c.id),
        title: c.name ?? "—",
      })) ?? [];

  const selId = selectedCourse?.import_offer_target_ids?.[0];
  if (!selId) return base;
  if (base.some((o) => o.id === String(selId))) return base;

  const fromApi = Array.isArray(selectedCourse?.import_offer_targets)
    ? selectedCourse.import_offer_targets.find(
        (t: any) => String(t.id) === String(selId),
      )
    : null;

  return [{ id: String(selId), title: fromApi?.name ?? "—" }, ...base];
}

export const normalizeScalar = (v: any) => {
  if (!v) return null;
  if (typeof v === "string") return v.trim();
  return v;
};

export const getLevelColor = (level: any) => {
  switch (level) {
    case "مبتدئ":
      return "bg-green-100 text-green-800";
    case "متوسط":
      return "bg-gray-100 text-(--brand)";
    case "متقدم":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
