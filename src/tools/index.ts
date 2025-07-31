// Tools modülü - Ana export dosyası
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerUserTools } from "./user-tools.js";

// Export all tools
export * from "./user-tools.js";

// Main tool registration function
export function registerAllTools(server: McpServer): void {
  // User tools'ları kaydet
  registerUserTools(server);
  
  console.error("✅ Tüm tools başarıyla kaydedildi");
}