import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// ===== MODULAR IMPORTS (Context7 Best Practices) =====
import { 
  GetUserByIdInputSchema,
  SearchUsersByNameInputSchema,
  AddUserInputSchema, 
  SearchUsersByEmailInputSchema,
  SearchUsersByPhoneInputSchema
} from "../schemas/user.schema.js";
import { UserController } from "../controllers/user.controller.js";

/**
 * Register User Tools - Registration Layer
 * Context7 Pattern: Clean separation - registration here, handlers in controller
 */
export function registerUserTools(server: McpServer): void {
  // Get all users tool
  server.registerTool(
    "get_all_users",
    {
      title: "Tüm Kullanıcıları Getir",
      description: "Tüm kullanıcıların listesini getir",
      inputSchema: {},
    },
    UserController.handleGetAllUsers
  );

  // Get user by ID tool
  server.registerTool(
    "get_user_by_id",
    {
      title: "Kullanıcı Getir",
      description: "ID'ye göre belirli bir kullanıcıyı getir",
      inputSchema: GetUserByIdInputSchema,
    },
    UserController.handleGetUserById
  );

  // Search users by name tool
  server.registerTool(
    "search_users_by_name",
    {
      title: "Kullanıcı Ara",
      description: "İsme göre kullanıcı ara",
      inputSchema: SearchUsersByNameInputSchema,
    },
    UserController.handleSearchUsersByName
  );

  // Search users by email tool
  server.registerTool(
    "search_users_by_email",
    {
      title: "Kullanıcı Ara",
      description: "E-posta adresine göre kullanıcı ara",
      inputSchema: SearchUsersByEmailInputSchema,
    },
    UserController.handleSearchUsersByEmail
  );

  // Search users by phone tool
  server.registerTool(
    "search_users_by_phone",
    {
      title: "Kullanıcı Ara",
      description: "Telefon numarasına göre kullanıcı ara",
      inputSchema: SearchUsersByPhoneInputSchema,
    },
    UserController.handleSearchUsersByPhone
  );

  // Add user tool
  server.registerTool(
    "add_user",
    {
      title: "Kullanıcı Ekle",
      description: "Yeni kullanıcı ekle",
      inputSchema: AddUserInputSchema,
    },
    UserController.handleAddUser
  );

  console.error("✅ User tools registered successfully");
}