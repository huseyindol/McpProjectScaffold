// User Controller - Tool Handlers Layer (Context7 Best Practices)
import { userService } from "../services/user.service.js";

// MCP Tool Response Types (Context7 Pattern - MCP SDK Compatible)
interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

/**
 * User Controller Class - Tool Handlers Layer
 * Context7 Pattern: Clean separation - handlers only, registration elsewhere
 */
export class UserController {

  // ===== EXPORTED TOOL HANDLERS (Context7 Pattern: Clean & Focused) =====

  /**
   * Handle Get All Users Request
   */
  static async handleGetAllUsers(): Promise<ToolResponse> {
    try {
      const result = await userService.getAllUsers();
      
      return {
        content: [
          {
            type: "text",
            text: result.success 
              ? JSON.stringify(result.data, null, 2)
              : result.error || "Bilinmeyen hata",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Tool handler'da beklenmeyen hata oluştu",
          },
        ],
      };
    }
  }

  /**
   * Handle Get User By ID Request
   */
  static async handleGetUserById({ id }: { id: number }): Promise<ToolResponse> {
    try {
      const result = await userService.getUserById(id);
      
      return {
        content: [
          {
            type: "text",
            text: result.success 
              ? JSON.stringify(result.data, null, 2)
              : result.error || "Kullanıcı bulunamadı",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Kullanıcı getirme işleminde hata oluştu",
          },
        ],
      };
    }
  }

  /**
   * Handle Search Users By Name Request
   */
  static async handleSearchUsersByName({ name }: { name: string }): Promise<ToolResponse> {
    try {
      const result = await userService.searchUsersByName(name);
      
      return {
        content: [
          {
            type: "text",
            text: result.success && result.data && result.data.length > 0
              ? JSON.stringify(result.data, null, 2)
              : result.message || result.error || "Kullanıcı bulunamadı",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Kullanıcı arama işleminde hata oluştu",
          },
        ],
      };
    }
  }

  /**
   * Handle Add User Request
   */
  static async handleAddUser({ name, email, phone }: { name: string; email: string; phone: string }): Promise<ToolResponse> {
    try {
      const result = await userService.createUser({ name, email, phone });
      
      return {
        content: [
          {
            type: "text",
            text: result.success 
              ? `${result.message}\n${JSON.stringify(result.data, null, 2)}`
              : result.error || "Kullanıcı oluşturulamadı",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Kullanıcı oluşturma işleminde hata oluştu",
          },
        ],
      };
    }
  }
}