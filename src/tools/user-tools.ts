import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ES module için __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ===== MODULAR IMPORTS (Context7 Best Practices) =====
import { 
  UserSchema, 
  User, 
  GetUserByIdInputSchema,
  SearchUsersByNameInputSchema,
  AddUserInputSchema 
} from "../types/user.js";

// Helper functions
function loadUsers(): User[] {
  try {
    const dataPath = join(__dirname, "../../data/users.json");
    const data = readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Users verisi yüklenirken hata:", error);
    return [];
  }
}

function saveUsers(users: User[]): boolean {
  try {
    const dataPath = join(__dirname, "../../data/users.json");
    const data = JSON.stringify(users, null, 2);
    writeFileSync(dataPath, data, "utf-8");
    return true;
  } catch (error) {
    console.error("Users verisi kaydedilirken hata:", error);
    return false;
  }
}

function getNextUserId(users: User[]): number {
  if (users.length === 0) return 1;
  return Math.max(...users.map(u => u.id)) + 1;
}

// Tool registration function
export function registerUserTools(server: McpServer): void {
  // Get all users tool
  server.registerTool(
    "get_all_users",
    {
      title: "Tüm Kullanıcıları Getir",
      description: "Tüm kullanıcıların listesini getir",
      inputSchema: {},
    },
    async () => {
      const users = loadUsers();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(users, null, 2),
          },
        ],
      };
    }
  );

  // Get user by ID tool
  server.registerTool(
    "get_user_by_id",
    {
      title: "Kullanıcı Getir",
      description: "ID'ye göre belirli bir kullanıcıyı getir",
      inputSchema: GetUserByIdInputSchema,
    },
    async ({ id }: { id: number }) => {
      const users = loadUsers();
      const user = users.find((u) => u.id === id);
      
      if (!user) {
        return {
          content: [
            {
              type: "text",
              text: `ID ${id} ile kullanıcı bulunamadı`,
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(user, null, 2),
          },
        ],
      };
    }
  );

  // Search users by name tool
  server.registerTool(
    "search_users_by_name",
    {
      title: "Kullanıcı Ara",
      description: "İsme göre kullanıcı ara",
      inputSchema: SearchUsersByNameInputSchema,
    },
    async ({ name }: { name: string }) => {
      const users = loadUsers();
      const matchedUsers = users.filter((u) =>
        u.name.toLowerCase().includes(name.toLowerCase())
      );
      
      return {
        content: [
          {
            type: "text",
            text: matchedUsers.length > 0 
              ? JSON.stringify(matchedUsers, null, 2)
              : `"${name}" ismiyle kullanıcı bulunamadı`,
          },
        ],
      };
    }
  );

  // Add user tool
  server.registerTool(
    "add_user",
    {
      title: "Kullanıcı Ekle",
      description: "Yeni kullanıcı ekle",
      inputSchema: AddUserInputSchema,
    },
    async ({ name, email, phone }: { name: string; email: string; phone: string }) => {
      const users = loadUsers();

      // E-posta zaten var mı kontrol et
      const existingUserWithEmail = users.find(u => u.email === email);
      if (existingUserWithEmail) {
        return {
          content: [
            {
              type: "text",
              text: `Bu e-posta adresi zaten kullanımda (ID: ${existingUserWithEmail.id})`,
            },
          ],
        };
      }

      // Yeni kullanıcı oluştur ve Zod ile validate et
      const newUserData = {
        id: getNextUserId(users),
        name,
        email,
        phone,
      };

      // UserSchema ile doğrula
      const newUserValidation = UserSchema.safeParse(newUserData);
      if (!newUserValidation.success) {
        return {
          content: [
            {
              type: "text",
              text: `Kullanıcı verisi validasyon hatası: ${newUserValidation.error.message}`,
            },
          ],
        };
      }

      const newUser = newUserValidation.data;

      // Kullanıcıyı listeye ekle
      const updatedUsers = [...users, newUser];
      
      // JSON dosyasına kaydet
      const saveSuccess = saveUsers(updatedUsers);
      
      if (!saveSuccess) {
        return {
          content: [
            {
              type: "text",
              text: "Kullanıcı eklenirken bir hata oluştu",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Kullanıcı başarıyla eklendi:\n${JSON.stringify(newUser, null, 2)}`,
          },
        ],
      };
    }
  );
}