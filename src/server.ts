#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tools/index.js";

// MCP server oluştur
const server = new McpServer({
  name: "user-info-server",
  version: "1.0.0",
});

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
