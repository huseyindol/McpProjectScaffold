import { z } from "zod";

// ===============================================
// GEMINI AI VALIDATION SCHEMAS
// ===============================================
// Bu dosya Gemini AI ile ilgili Zod validation schema'larını içerir
// Type definitions src/types/gemini.ts dosyasında tanımlanır

/**
 * Gemini Query Schema - Temel sorgu validation
 */
export const GeminiSchema = z.object({
  prompt: z.string()
    .min(1, "Prompt boş olamaz")
    .max(10000, "Prompt maksimum 10000 karakter olabilir"),
  
  model: z.string()
    .optional()
    .default("gemini-2.0-flash-001"),
    
  maxTokens: z.number()
    .int()
    .min(1, "MaxTokens en az 1 olmalı")
    .max(4096, "MaxTokens maksimum 4096 olabilir")
    .optional()
    .default(1000),
    
  temperature: z.number()
    .min(0, "Temperature en az 0 olmalı")
    .max(2, "Temperature maksimum 2 olabilir")
    .optional()
    .default(0.7),
    
  topP: z.number()
    .min(0, "TopP en az 0 olmalı")
    .max(1, "TopP maksimum 1 olabilir")
    .optional()
    .default(0.9),
    
  topK: z.number()
    .int()
    .min(1, "TopK en az 1 olmalı")
    .max(100, "TopK maksimum 100 olabilir")
    .optional()
    .default(40),
});

/**
 * Gemini Chat Schema - Konuşma validation
 */
export const GeminiChatSchema = z.object({
  message: z.string()
    .min(1, "Mesaj boş olamaz")
    .max(5000, "Mesaj maksimum 5000 karakter olabilir"),
    
  model: z.string()
    .optional()
    .default("gemini-2.0-flash-001"),
    
  conversationId: z.string()
    .optional(),
    
  systemInstruction: z.string()
    .max(2000, "System instruction maksimum 2000 karakter olabilir")
    .optional(),
});

/**
 * Gemini Configuration Schema
 */
export const GeminiConfigSchema = z.object({
  apiKey: z.string()
    .min(1, "API Key boş olamaz"),
    
  model: z.string()
    .min(1, "Model ismi boş olamaz")
    .default("gemini-2.0-flash-001"),
    
  maxTokens: z.number()
    .int()
    .min(1)
    .max(4096)
    .default(1000),
    
  temperature: z.number()
    .min(0)
    .max(2)
    .default(0.7),
    
  topP: z.number()
    .min(0)
    .max(1)
    .default(0.9),
    
  topK: z.number()
    .int()
    .min(1)
    .max(100)
    .default(40),
});

/**
 * Environment Variable Schema
 */
export const GeminiEnvSchema = z.object({
  GEMINI_API_KEY: z.string()
    .min(1, "GEMINI_API_KEY environment variable gerekli"),
});

// ===============================================
// MCP TOOL INPUT SCHEMAS
// ===============================================

/**
 * Gemini Generate Text - Input Schema
 */
export const GeminiGenerateTextInputSchema = {
  prompt: z.string()
    .min(1, "Prompt boş olamaz")
    .max(10000, "Prompt maksimum 10000 karakter olabilir")
    .describe("Gemini AI'ya gönderilecek prompt/soru"),
  
  model: z.string()
    .optional()
    .describe("Kullanılacak Gemini model (opsiyonel, varsayılan: gemini-2.0-flash-001)"),
    
  maxTokens: z.number()
    .int()
    .min(1, "MaxTokens en az 1 olmalı") 
    .max(4096, "MaxTokens maksimum 4096 olabilir")
    .optional()
    .describe("Maksimum token sayısı (opsiyonel, varsayılan: 1000)"),
    
  temperature: z.number()
    .min(0, "Temperature en az 0 olmalı")
    .max(2, "Temperature maksimum 2 olabilir")
    .optional()
    .describe("Yaratıcılık seviyesi 0-2 arası (opsiyonel, varsayılan: 0.7)")
};

/**
 * Gemini Chat - Input Schema
 */
export const GeminiChatInputSchema = {
  message: z.string()
    .min(1, "Mesaj boş olamaz")
    .max(5000, "Mesaj maksimum 5000 karakter olabilir")
    .describe("Chat mesajı"),
    
  model: z.string()
    .optional()
    .describe("Kullanılacak Gemini model (opsiyonel)"),
    
  conversationId: z.string()
    .optional()
    .describe("Konuşma ID'si (opsiyonel, chat geçmişi için)"),
    
  systemInstruction: z.string()
    .max(2000, "System instruction maksimum 2000 karakter olabilir")
    .optional()
    .describe("System instruction (opsiyonel, AI'nın davranışını şekillendirir)")
};

/**
 * Gemini Status - Input Schema (empty for status check)
 */
export const GeminiStatusInputSchema = {};

/**
 * Gemini Generate Stream - Input Schema
 */
export const GeminiGenerateStreamInputSchema = {
  prompt: z.string()
    .min(1, "Prompt boş olamaz")
    .max(10000, "Prompt maksimum 10000 karakter olabilir")
    .describe("Gemini AI'ya gönderilecek prompt/soru"),
  
  model: z.string()
    .optional()
    .describe("Kullanılacak Gemini model (opsiyonel)"),
    
  maxTokens: z.number()
    .int()
    .min(1, "MaxTokens en az 1 olmalı")
    .max(4096, "MaxTokens maksimum 4096 olabilir")
    .optional()
    .describe("Maksimum token sayısı (opsiyonel)"),
    
  temperature: z.number()
    .min(0, "Temperature en az 0 olmalı")
    .max(2, "Temperature maksimum 2 olabilir")
    .optional()
    .describe("Yaratıcılık seviyesi 0-2 arası (opsiyonel)")
};

// ===============================================
// VALIDATION FUNCTIONS
// ===============================================

/**
 * Gemini query validation function
 */
export function validateGeminiRequest(data: unknown) {
  return GeminiSchema.parse(data);
}

/**
 * Gemini chat validation function
 */
export function validateGeminiChat(data: unknown) {
  return GeminiChatSchema.parse(data);
}

/**
 * Environment validation function
 */
export function validateGeminiEnvironment() {
  // Check if GEMINI_API_KEY exists
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required. Please set it before using Gemini AI tools.");
  }
  
  // Return the validated environment object
  return GeminiEnvSchema.parse({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  });
}