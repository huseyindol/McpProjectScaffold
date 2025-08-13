import { LoanSearchParams } from "./loans";

// Parse edilmiş sorgu sonucu
export interface ParsedQuery {
  success: boolean;
  params?: LoanSearchParams;
  error?: string;
}

// Service Result Types (Context7 Pattern)
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}