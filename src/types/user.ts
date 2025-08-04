import { z } from "zod";
import { UserSchema } from "../schemas/user.schema.js";

// ===============================================
// USER TYPE DEFINITIONS
// ===============================================
// Bu dosya sadece TypeScript interface'leri ve type'ları içerir
// Validation schema'ları src/schemas/user.schema.ts dosyasında tanımlanır

/**
 * User Interface - Ana kullanıcı type'ı
 * UserSchema'dan otomatik türetilir
 */
export type User = z.infer<typeof UserSchema>;

// ===============================================
// SERVICE LAYER TYPES
// ===============================================

/**
 * Service Result - Generic service response type
 * Business logic layer'dan gelen response'lar için
 */
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * User Service Result Types
 */
export type UserServiceResult = ServiceResult<User>;
export type UsersServiceResult = ServiceResult<User[]>;

// ===============================================
// MCP TOOL RESPONSE TYPES
// ===============================================

/**
 * MCP Tool Response - Context7 Pattern
 * Tüm MCP tool'ları bu format'ta response döner
 */
export interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

// ===============================================
// UTILITY TYPES
// ===============================================

/**
 * User Creation Data - ID olmadan kullanıcı verisi
 */
export type CreateUserData = Omit<User, 'id'>;

/**
 * User Update Data - Partial update için
 */
export type UpdateUserData = Partial<CreateUserData>;

/**
 * User Search Filters
 */
export interface UserSearchFilters {
  name?: string;
  email?: string;
  phone?: string;
}