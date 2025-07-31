import { z } from "zod";

// User schema
export const UserSchema = z.object({
  id: z.number().int().positive().describe("Benzersiz kullanıcı kimliği"),
  name: z.string().min(2).max(100).describe("Kullanıcının tam adı"),
  email: z.string().email().describe("E-posta adresi"),
  phone: z.string().min(10).max(20).describe("Telefon numarası")
});

// User type
export type User = z.infer<typeof UserSchema>;

// Input schemas
export const GetUserByIdInputSchema = {
  id: z.number().int().positive().describe("Kullanıcının ID'si")
};

export const SearchUsersByNameInputSchema = {
  name: z.string().min(1).describe("Aranacak kullanıcı ismi")
};

export const AddUserInputSchema = {
  name: z.string().min(2).max(100).describe("Kullanıcının tam adı"),
  email: z.string().email().describe("E-posta adresi"),
  phone: z.string().min(10).max(20).describe("Telefon numarası")
};