import { SalesListResponse } from "../types/types";

export function parseSalesPayload(
  salesResponse: unknown,
): SalesListResponse | undefined {
  const r = salesResponse as Record<string, unknown> | undefined;
  if (!r) return undefined;
  if (typeof r.count === "number" && Array.isArray(r.data))
    return r as unknown as SalesListResponse;
  const inner = r.data as Record<string, unknown> | undefined;
  if (inner && typeof inner.count === "number" && Array.isArray(inner.data))
    return inner as unknown as SalesListResponse;
  return undefined;
}
