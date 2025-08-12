import { z } from "zod";

// ===============================================
// GEMINI AI TYPE DEFINITIONS
// ===============================================
// Bu dosya Gemini AI ile ilgili TypeScript interface'leri ve type'ları içerir
// Validation schema'ları src/schemas/gemini.schema.ts dosyasında tanımlanır

/**
 * Gemini Request Interface - Ana sorgu type'ı
 */
export interface GeminiRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

// ===============================================
// GEMINI SERVICE LAYER TYPES
// ===============================================

/**
 * Gemini Service Result - Generic gemini service response type
 * Business logic layer'dan gelen response'lar için
 */
export interface GeminiServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Gemini Response Types
 */
export interface GeminiResponse {
  id: string;
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
  timestamp: string;
}

export type GeminiQueryServiceResult = GeminiServiceResult<GeminiResponse>;

// ===============================================
// MCP TOOL REQUEST TYPES
// ===============================================

/**
 * Gemini Query Arguments - MCP tool için input type'ı
 */
export interface GeminiQueryArgs {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Gemini Chat Arguments - Konuşma için input type'ı
 */
export interface GeminiChatArgs {
  message: string;
  model?: string;
  conversationId?: string;
  systemInstruction?: string;
}

// ===============================================
// CONFIGURATION TYPES
// ===============================================

/**
 * Gemini Configuration
 */
export interface GeminiConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
}

/**
 * Default Gemini Configuration
 */
export const DEFAULT_GEMINI_CONFIG: Omit<GeminiConfig, 'apiKey'> = {
  model: 'gemini-2.5-flash',
  maxTokens: 1000,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
};

// ===============================================
// ERROR TYPES
// ===============================================

/**
 * Gemini Error Types
 */
export enum GeminiErrorType {
  API_KEY_MISSING = 'API_KEY_MISSING',
  INVALID_REQUEST = 'INVALID_REQUEST',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Gemini Error Interface
 */
export interface GeminiError {
  type: GeminiErrorType;
  message: string;
  details?: unknown;
  code?: number;
}
