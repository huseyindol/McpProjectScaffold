import { GeminiService } from '../services/gemini.service.js';
import { 
  GeminiQueryArgs, 
  GeminiChatArgs
} from '../types/gemini.js';
import { ToolResponse as BaseToolResponse } from '../types/user.js';
import { 
  validateGeminiRequest, 
  validateGeminiChat 
} from '../schemas/gemini.schema.js';

// ===============================================
// GEMINI AI CONTROLLER
// ===============================================
// Bu controller Gemini AI MCP tool handler'larını içerir
// Proje mimarisine uygun olarak sadece MCP interface logic'i yapar

export class GeminiController {

  /**
   * Gemini AI text generation tool handler
   * MCP Tool: gemini_generate_text
   */
  static async handleGenerateText(args: unknown): Promise<BaseToolResponse> {
    try {
      // Input validation
      const validatedArgs = validateGeminiRequest(args) as GeminiQueryArgs;
      
      console.error(`Gemini text generation isteği: ${validatedArgs.prompt.substring(0, 50)}...`);

      // Service call
      const result = await GeminiService.generateText(validatedArgs);

      if (!result.success) {
        return {
          content: [{
            type: "text",
            text: `❌ Gemini AI Hatası: ${result.error}\n\nDetay: ${result.message}`
          }]
        };
      }

      // Success response
      const response = result.data!;
      const responseText = `✅ Gemini AI Yanıtı:\n\n${response.content}\n\n` +
        `📊 Detaylar:\n` +
        `- Model: ${response.model}\n` +
        `- ID: ${response.id}\n` +
        `- Zaman: ${new Date(response.timestamp).toLocaleString('tr-TR')}\n` +
        `- Durum: ${response.finishReason}\n` +
        (response.usage ? 
          `- Token Kullanımı: ${response.usage.totalTokens} (prompt: ${response.usage.promptTokens}, completion: ${response.usage.completionTokens})\n` : 
          '');

      return {
        content: [{
          type: "text",
          text: responseText
        }]
      };

    } catch (error) {
      console.error("Gemini text generation controller hatası:", error);
      
      if (error instanceof Error && error.message.includes('validation')) {
        return {
          content: [{
            type: "text",
            text: `❌ Girdi Doğrulama Hatası: ${error.message}\n\nLütfen geçerli bir prompt ve parametreler girin.`
          }]
        };
      }

      return {
        content: [{
          type: "text",
          text: `❌ Beklenmeyen Hata: Gemini AI text generation sırasında bir hata oluştu.\n\nHata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
          }]
        };
    }
  }

  /**
   * Gemini AI chat tool handler
   * MCP Tool: gemini_chat
   */
  static async handleChat(args: unknown): Promise<BaseToolResponse> {
    try {
      // Input validation
      const validatedArgs = validateGeminiChat(args) as GeminiChatArgs;
      
      console.error(`Gemini chat isteği: ${validatedArgs.message.substring(0, 50)}...`);

      // Service call
      const result = await GeminiService.chatWithGemini(validatedArgs);

      if (!result.success) {
        return {
          content: [{
            type: "text",
            text: `❌ Gemini Chat Hatası: ${result.error}\n\nDetay: ${result.message}`
          }]
        };
      }

      // Success response
      const response = result.data!;
      const responseText = `💬 Gemini Chat Yanıtı:\n\n${response.content}\n\n` +
        `📊 Chat Detayları:\n` +
        `- Model: ${response.model}\n` +
        `- Chat ID: ${response.id}\n` +
        `- Zaman: ${new Date(response.timestamp).toLocaleString('tr-TR')}\n` +
        `- Durum: ${response.finishReason}\n` +
        (validatedArgs.conversationId ? `- Konuşma ID: ${validatedArgs.conversationId}\n` : '') +
        (response.usage ? 
          `- Token Kullanımı: ${response.usage.totalTokens} (prompt: ${response.usage.promptTokens}, completion: ${response.usage.completionTokens})\n` : 
          '');

      return {
        content: [{
          type: "text",
          text: responseText
        }]
      };

    } catch (error) {
      console.error("Gemini chat controller hatası:", error);
      
      if (error instanceof Error && error.message.includes('validation')) {
        return {
          content: [{
            type: "text",
            text: `❌ Chat Girdi Doğrulama Hatası: ${error.message}\n\nLütfen geçerli bir mesaj ve parametreler girin.`
          }]
        };
      }

      return {
        content: [{
          type: "text",
          text: `❌ Beklenmeyen Chat Hatası: Gemini AI chat sırasında bir hata oluştu.\n\nHata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
          }]
        };
    }
  }

  /**
   * Gemini AI status kontrol tool handler
   * MCP Tool: gemini_status
   */
  static async handleStatus(): Promise<BaseToolResponse> {
    try {
      const isReady = GeminiService.isClientReady();
      const config = GeminiService.getCurrentConfig();

      if (!isReady) {
        return {
          content: [{
            type: "text",
            text: `🔴 Gemini AI Durumu: Hazır Değil\n\n` +
              `❌ Client henüz initialize edilmedi.\n` +
              `💡 Önce bir Gemini sorgusu göndererek client'ı başlatın.`
          }]
        };
      }

      const statusText = `🟢 Gemini AI Durumu: Aktif\n\n` +
        `✅ Client başarıyla initialize edildi\n` +
        `📋 Mevcut Konfigürasyon:\n` +
        `- Model: ${config?.model || 'Bilinmiyor'}\n` +
        `- Max Tokens: ${config?.maxTokens || 'Bilinmiyor'}\n` +
        `- Temperature: ${config?.temperature || 'Bilinmiyor'}\n` +
        `- Top P: ${config?.topP || 'Bilinmiyor'}\n` +
        `- Top K: ${config?.topK || 'Bilinmiyor'}\n` +
        `- API Key: ${config?.apiKey ? '✅ Tanımlı' : '❌ Tanımsız'}\n\n` +
        `🔧 Kullanılabilir Tool'lar:\n` +
        `- gemini_generate_text: Text generation\n` +
        `- gemini_chat: Chat conversation\n` +
        `- gemini_status: Status kontrolü`;

      return {
        content: [{
          type: "text",
          text: statusText
        }]
      };

    } catch (error) {
      console.error("Gemini status controller hatası:", error);
      
      return {
        content: [{
          type: "text",
          text: `❌ Status Kontrol Hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
        }]
      };
    }
  }

  /**
   * Gemini AI streaming text generation tool handler
   * MCP Tool: gemini_generate_stream (gelecekte eklenebilir)
   */
  static async handleGenerateStream(args: unknown): Promise<BaseToolResponse> {
    try {
      // Input validation
      const validatedArgs = validateGeminiRequest(args) as GeminiQueryArgs;
      
      console.error(`Gemini streaming generation isteği: ${validatedArgs.prompt.substring(0, 50)}...`);

      // Service call
      const result = await GeminiService.generateTextStream(validatedArgs);

      if (!result.success) {
        return {
          content: [{
            type: "text",
            text: `❌ Gemini Streaming Hatası: ${result.error}\n\nDetay: ${result.message}`
          }]
        };
      }

      // Streaming yanıtı birleştir (MCP text tool'lar için)
      let fullResponse = '';
      try {
        for await (const chunk of result.data!) {
          fullResponse += chunk;
        }
      } catch (streamError) {
        return {
          content: [{
            type: "text",
            text: `❌ Streaming Okuma Hatası: ${streamError instanceof Error ? streamError.message : 'Bilinmeyen streaming hatası'}`
          }]
        };
      }

      const responseText = `🔄 Gemini Streaming Yanıtı:\n\n${fullResponse}\n\n` +
        `📊 Detaylar:\n` +
        `- Model: ${validatedArgs.model || 'gemini-2.0-flash-001'}\n` +
        `- Mod: Streaming\n` +
        `- Zaman: ${new Date().toLocaleString('tr-TR')}\n` +
        `- Durum: Streaming tamamlandı`;

      return {
        content: [{
          type: "text",
          text: responseText
        }]
      };

    } catch (error) {
      console.error("Gemini streaming controller hatası:", error);
      
      return {
        content: [{
          type: "text",
          text: `❌ Streaming Hatası: ${error instanceof Error ? error.message : 'Bilinmeyen streaming hatası'}`
        }]
      };
    }
  }
}
