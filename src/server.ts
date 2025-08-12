#!/usr/bin/env node

// Load environment variables from .env file (must be first)
import { config } from "dotenv";
config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tools/index.js";

// MCP server oluştur
const server = new McpServer({
  name: "user-info-server",
  version: "1.0.0",
});

// Environment variable debug (development only)
if (process.env.NODE_ENV === "development") {
  console.error("🔑 Environment variables loaded:");
  console.error("  - GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Not set");
}

// Tüm tool'ları kaydet (modüler yapı)
registerAllTools(server);

// Server'ı başlat
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("User Info MCP Server başlatıldı");
}

main().catch((error) => {
  console.error("Server başlatma hatası:", error);
  process.exit(1);
});
