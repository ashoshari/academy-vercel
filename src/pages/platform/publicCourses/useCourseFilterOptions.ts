import { useMemo } from "react";
import type { FilterOption } from "@/components/core/FilterSection";
import {
  flattenSpecializationMaterials,
  normalizeSubsectionIdsData,
} from "@/utils/specializationMaterials";
import type { CourseFilters } from "./types";

function subsectionLinkedToSection(subsection: any, sectionId: string) {
  if (!sectionId) return true;
  const links = subsection?.sections ?? [];
  return links.some(
    (s: string | { id?: string }) =>
      String(typeof s === "object" ? s?.id : s) === sectionId,
  );
}

export function useCourseFilterOptions(
  filters: CourseFilters,
  sectionsRaw: unknown,
  subsectionsIdsRaw: unknown,
) {
  const sectionsList = useMemo(() => {
    const raw = sectionsRaw as { data?: { data?: unknown[] } } | undefined;
    const list = raw?.data?.data ?? (raw as { data?: unknown[] })?.data;
    return Array.isArray(list) ? list : [];
  }, [sectionsRaw]);

  const subsectionTree = useMemo(
    () => normalizeSubsectionIdsData(subsectionsIdsRaw),
    [subsectionsIdsRaw],
  );

  const sectionOptions: FilterOption[] = useMemo(
    () =>
      sectionsList.map((s: any) => ({
        id: String(s.id),
        label: String(s.title ?? s.name ?? ""),
      })),
    [sectionsList],
  );

  const subsectionOptions: FilterOption[] = useMemo(() => {
    return subsectionTree
      .filter((s) => subsectionLinkedToSection(s, filters.section_id))
      .map((s) => ({
        id: String(s.id),
        label: String(s.title ?? s.name ?? ""),
      }));
  }, [subsectionTree, filters.section_id]);

  const selectedSubsection = useMemo(
    () => subsectionTree.find((s) => String(s.id) === filters.subsection_id),
    [subsectionTree, filters.subsection_id],
  );

  const subsubsectionOptions: FilterOption[] = useMemo(() => {
    if (!selectedSubsection) return [];
    return (selectedSubsection.subsubsections ?? []).map((ss: any) => ({
      id: String(ss.id),
      label: String(ss.title ?? ss.name ?? ""),
    }));
  }, [selectedSubsection]);

  const selectedSubsubsection = useMemo(() => {
    if (!selectedSubsection || !filters.subsubsection_id) return undefined;
    return (selectedSubsection.subsubsections ?? []).find(
      (ss: any) => String(ss.id) === filters.subsubsection_id,
    );
  }, [selectedSubsection, filters.subsubsection_id]);

  const specializationOptions: FilterOption[] = useMemo(() => {
    if (!selectedSubsubsection) return [];
    return (selectedSubsubsection.specializations ?? []).map((sp: any) => ({
      id: String(sp.id),
      label: String(sp.name ?? sp.title ?? ""),
    }));
  }, [selectedSubsubsection]);

  const selectedSpecialization = useMemo(() => {
    if (!selectedSubsubsection || !filters.specialization_id) return undefined;
    return (selectedSubsubsection.specializations ?? []).find(
      (sp: any) => String(sp.id) === filters.specialization_id,
    );
  }, [selectedSubsubsection, filters.specialization_id]);

  const materialOptions: FilterOption[] = useMemo(() => {
    const mats =
      selectedSpecialization?.specialization_materials?.length > 0
        ? selectedSpecialization.specialization_materials
        : selectedSubsubsection?.specialization_materials;

    return (mats ?? []).map((m: any) => ({
      id: String(m.id),
      label: String(m.name ?? m.material ?? ""),
    }));
  }, [selectedSpecialization, selectedSubsubsection]);

  const allMaterialRows = useMemo(
    () => flattenSpecializationMaterials(subsectionTree),
    [subsectionTree],
  );

  return {
    sectionsList,
    sectionOptions,
    subsectionOptions,
    subsubsectionOptions,
    specializationOptions,
    materialOptions,
    allMaterialRows,
  };
}
