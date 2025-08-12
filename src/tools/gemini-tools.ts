import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GeminiController } from "../controllers/gemini.controller.js";
import {
  GeminiGenerateTextInputSchema,
  GeminiChatInputSchema,
  GeminiStatusInputSchema,
  GeminiGenerateStreamInputSchema
} from "../schemas/gemini.schema.js";

// ===============================================
// GEMINI AI MCP TOOLS REGISTRATION
// ===============================================
// Bu dosya Gemini AI ile ilgili MCP tool'larını kaydetmeyi sağlar
// Proje mimarisine uygun olarak sadece tool registration işlemleri yapar

/**
 * Gemini AI tool'larını MCP server'a kaydet
 */
export function registerGeminiTools(server: McpServer): void {
  
  // ===============================================
  // GEMINI GENERATE TEXT TOOL
  // ===============================================
  server.registerTool(
    "gemini_generate_text",
    {
      title: "Gemini Text Generation",
      description: "Gemini AI kullanarak text generation yapar. Çeşitli parametrelerle özelleştirilebilir.",
      inputSchema: GeminiGenerateTextInputSchema,
    },
    GeminiController.handleGenerateText
  );

  // ===============================================
  // GEMINI CHAT TOOL
  // ===============================================
  server.registerTool(
    "gemini_chat",
    {
      title: "Gemini Chat",
      description: "Gemini AI ile chat conversation yapar. System instruction ve conversation ID destekler.",
      inputSchema: GeminiChatInputSchema,
    },
    GeminiController.handleChat
  );

  // ===============================================
  // GEMINI STATUS TOOL
  // ===============================================
  server.registerTool(
    "gemini_status",
    {
      title: "Gemini Status",
      description: "Gemini AI client'ının durumunu ve konfigürasyonunu kontrol eder.",
      inputSchema: GeminiStatusInputSchema,
    },
    GeminiController.handleStatus
  );

  // ===============================================
  // GEMINI STREAMING TOOL
  // ===============================================
  server.registerTool(
    "gemini_generate_stream",
    {
      title: "Gemini Streaming Generation",
      description: "Gemini AI kullanarak streaming text generation yapar. Büyük yanıtlar için daha hızlı.",
      inputSchema: GeminiGenerateStreamInputSchema,
    },
    GeminiController.handleGenerateStream
  );

  console.error("✅ Gemini AI tools başarıyla kaydetildi:");
  console.error("   - gemini_generate_text: Text generation");
  console.error("   - gemini_chat: Chat conversation"); 
  console.error("   - gemini_status: Status kontrolü");
  console.error("   - gemini_generate_stream: Streaming generation");
}

// ===============================================
// GEMINI TOOL METADATA
// ===============================================

/**
 * Gemini tool'larının metadata'sı
 */
export const GEMINI_TOOLS_METADATA = {
  tools: [
    {
      name: "gemini_generate_text",
      category: "AI Generation",
      description: "Gemini AI text generation",
      version: "1.0.0"
    },
    {
      name: "gemini_chat", 
      category: "AI Chat",
      description: "Gemini AI conversation",
      version: "1.0.0"
    },
    {
      name: "gemini_status",
      category: "System",
      description: "Gemini AI status check",
      version: "1.0.0"
    },
    {
      name: "gemini_generate_stream",
      category: "AI Generation",
      description: "Gemini AI streaming generation",
      version: "1.0.0"
    }
  ],
  totalTools: 4,
  provider: "Google Gemini AI",
  apiVersion: "v1",
  registeredAt: new Date().toISOString()
};

/**
 * Gemini environment requirements
 */
export const GEMINI_REQUIREMENTS = {
  environmentVariables: [
    {
      name: "GEMINI_API_KEY",
      required: true,
      description: "Google Gemini AI API anahtarı"
    }
  ],
  dependencies: [
    {
      name: "@google/genai",
      version: "^0.6.0",
      description: "Google Generative AI JavaScript SDK"
    }
  ],
  permissions: [
    "GEMINI_API_ACCESS",
    "TEXT_GENERATION",
    "CHAT_CONVERSATION"
  ]
};
