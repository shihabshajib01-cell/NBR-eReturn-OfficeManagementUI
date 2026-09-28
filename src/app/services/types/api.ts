// ── Generic API envelope types ─────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ── Common query parameters ────────────────────────────────────────────────

export interface QueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  circle?: string;
  zone?: string;
  assessmentYear?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type ActiveStatus   = "Active" | "Inactive" | "Suspended";
export type ReturnType     = "Normal" | "82BB" | "82C(2)" | "212";
