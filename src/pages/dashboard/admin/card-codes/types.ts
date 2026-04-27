// export interface CardCode {
//   id: number;
//   code: string;
//   card: string;
//   price: number;
//   isUsed: boolean;
//   is_installment: boolean;
//   isDownloadeded: boolean;
//   isActive: boolean;
//   usedBy?: string;
//   usedAt?: string;
//   createdAt: string;
//   batchId: string;
//   // NEW: Subsection targeting
//   targetedSubsections: number[]; // Empty array means all subsections
// }

// export interface CodeBatch {
//   id: string;
//   card: string;
//   price: number;
//   totalCodes: number;
//   usedCodes: number;
//   activeCodes: number;
//   createdAt: string;
//   isActive: boolean;
//   // Security and admin info
//   createdBy: string;
//   createdByRole: string;
//   createdFromIP: string;
//   createdFromDevice: string;
//   lastModified?: string;
//   lastModifiedBy?: string;
//   notes?: string;
//   // NEW: Subsection targeting
//   targetedSubsections: number[]; // Empty array means all subsections
//   targetingType: "all" | "specific"; // 'all' for all subsections, 'specific' for selected ones
// }

export type PendingCodeStatusToggle = {
  id: string;
  isActive: boolean;
  codePrefix: string;
};
