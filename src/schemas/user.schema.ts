import { z } from "zod";

// ===============================================
// USER VALIDATION SCHEMAS
// ===============================================
// Bu dosya sadece Zod validation schema'larını içerir
// Interface'ler src/types/user.ts dosyasında tanımlanır

/**
 * Core User Schema - Ana kullanıcı doğrulama şeması
 */
export const UserSchema = z.object({
  id: z.number().int().positive().describe("Benzersiz kullanıcı kimliği"),
  name: z.string().min(2).max(100).describe("Kullanıcının tam adı"),
  email: z.string().email().describe("E-posta adresi"),
  phone: z.string().min(10).max(20).describe("Telefon numarası")
});

// ===============================================
// MCP TOOL INPUT SCHEMAS
// ===============================================
// MCP tool'ları için input validation schema'ları

/**
 * Get User By ID - Input Schema
 */
export const GetUserByIdInputSchema = {
  id: z.number().int().positive().describe("Kullanıcının ID'si")
};

/**
 * Search Users By Name - Input Schema
 */
export const SearchUsersByNameInputSchema = {
  name: z.string().min(1).describe("Aranacak kullanıcı ismi")
};

/**
 * Search Users By Phone - Input Schema
 */
export const SearchUsersByPhoneInputSchema = {
  phone: z.string().min(10).max(20).describe("Aranacak Telefon numarası")
};

/**
 * Search Users By Email - Input Schema
 */
export const SearchUsersByEmailInputSchema = {
  email: z.string().email().describe("Aranacak kullanıcı e-posta adresi")
};

/**
 * Add User - Input Schema
 */
export const AddUserInputSchema = {
  name: z.string().min(2).max(100).describe("Kullanıcının tam adı"),
  email: z.string().email().describe("E-posta adresi"),
  phone: z.string().min(10).max(20).describe("Telefon numarası")
};