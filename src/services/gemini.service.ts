import { GoogleGenAI } from '@google/genai';
import { 
  GeminiServiceResult, 
  GeminiResponse, 
  GeminiQueryArgs, 
  GeminiChatArgs, 
  GeminiConfig,
  GeminiError,
  GeminiErrorType,
  DEFAULT_GEMINI_CONFIG
} from '../types/gemini.js';
import { validateGeminiEnvironment } from '../schemas/gemini.schema.js';

// ===============================================
// GEMINI AI SERVICE
// ===============================================
// Bu service Gemini AI ile iletişim kurma business logic'ini içerir
// Proje mimarisine uygun olarak sadece business logic işlemleri yapar

export class GeminiService {
  private static client: GoogleGenAI | null = null;
  private static config: GeminiConfig | null = null;

  /**
   * Gemini AI client'ını initialize eder
   */
  private static async initializeClient(): Promise<void> {
    try {
      // Environment validation
      const env = validateGeminiEnvironment();

      console.error("Gemini API key:", env.GEMINI_API_KEY);
      
      // Client initialization
      this.client = new GoogleGenAI({
        apiKey: env.GEMINI_API_KEY
      });

      // Configuration setup
      this.config = {
        ...DEFAULT_GEMINI_CONFIG,
        apiKey: env.GEMINI_API_KEY
      };

      console.error("Gemini AI client başarıyla initialize edildi");
    } catch (error) {
      console.error("Gemini AI client initialize hatası:", error);
      throw new Error("Gemini AI client initialize edilemedi");
    }
  }

  /**
   * Client'ın hazır olduğunu garantiler
   */
  private static async ensureClient(): Promise<GoogleGenAI> {
    if (!this.client || !this.config) {
      await this.initializeClient();
    }
    return this.client!;
  }

  /**
   * Gemini AI'dan text generation yapar
   */
  static async generateText(args: GeminiQueryArgs): Promise<GeminiServiceResult<GeminiResponse>> {
    try {
      const client = await this.ensureClient();
      const config = this.config!;

      // Request configuration
      const requestConfig = {
        model: args.model || config.model,
        contents: args.prompt,
        config: {
          maxOutputTokens: args.maxTokens || config.maxTokens,
          temperature: args.temperature || config.temperature,
          topP: config.topP,
          topK: config.topK,
        }
      };

      console.error(`Gemini AI'ya sorgu gönderiliyor: ${args.prompt.substring(0, 100)}...`);

      // API call
      const response = await client.models.generateContent(requestConfig);

      if (!response?.text) {
        return {
          success: false,
          error: "Gemini AI'dan geçerli bir yanıt alınamadı",
          message: "Boş veya geçersiz response"
        };
      }

      // Response formatting
      const geminiResponse: GeminiResponse = {
        id: `gemini_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: response.text,
        model: args.model || config.model,
        usage: response.usageMetadata ? {
          promptTokens: response.usageMetadata.promptTokenCount || 0,
          completionTokens: response.usageMetadata.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata.totalTokenCount || 0,
        } : undefined,
        finishReason: response.candidates?.[0]?.finishReason || 'completed',
        timestamp: new Date().toISOString()
      };

      console.error(`Gemini AI yanıtı alındı: ${response.text.substring(0, 100)}...`);

      return {
        success: true,
        data: geminiResponse,
        message: "Gemini AI sorgusu başarıyla tamamlandı"
      };

    } catch (error) {
      console.error("Gemini AI service hatası:", error);
      return this.handleError(error);
    }
  }

  /**
   * Gemini AI ile chat conversation yapar
   */
  static async chatWithGemini(args: GeminiChatArgs): Promise<GeminiServiceResult<GeminiResponse>> {
    try {
      const client = await this.ensureClient();
      const config = this.config!;

      // System instruction ekleme
      const contents = args.systemInstruction 
        ? `${args.systemInstruction}\n\nUser: ${args.message}`
        : args.message;

      // Request configuration
      const requestConfig = {
        model: args.model || config.model,
        contents: contents,
        config: {
          maxOutputTokens: config.maxTokens,
          temperature: config.temperature,
          topP: config.topP,
          topK: config.topK,
        }
      };

      console.error(`Gemini AI chat başlatılıyor: ${args.message.substring(0, 100)}...`);

      // API call
      const response = await client.models.generateContent(requestConfig);

      if (!response?.text) {
        return {
          success: false,
          error: "Gemini AI'dan geçerli bir chat yanıtı alınamadı",
          message: "Boş veya geçersiz chat response"
        };
      }

      // Response formatting
      const geminiResponse: GeminiResponse = {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: response.text,
        model: args.model || config.model,
        usage: response.usageMetadata ? {
          promptTokens: response.usageMetadata.promptTokenCount || 0,
          completionTokens: response.usageMetadata.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata.totalTokenCount || 0,
        } : undefined,
        finishReason: response.candidates?.[0]?.finishReason || 'completed',
        timestamp: new Date().toISOString()
      };

      console.error(`Gemini AI chat yanıtı alındı: ${response.text.substring(0, 100)}...`);

      return {
        success: true,
        data: geminiResponse,
        message: "Gemini AI chat başarıyla tamamlandı"
      };

    } catch (error) {
      console.error("Gemini AI chat service hatası:", error);
      return this.handleError(error);
    }
  }

  /**
   * Streaming response için text generation
   */
  static async generateTextStream(args: GeminiQueryArgs): Promise<GeminiServiceResult<AsyncIterable<string>>> {
    try {
      const client = await this.ensureClient();
      const config = this.config!;

      // Request configuration
      const requestConfig = {
        model: args.model || config.model,
        contents: args.prompt,
        config: {
          maxOutputTokens: args.maxTokens || config.maxTokens,
          temperature: args.temperature || config.temperature,
          topP: config.topP,
          topK: config.topK,
        }
      };

      console.error(`Gemini AI streaming sorgu başlatılıyor: ${args.prompt.substring(0, 100)}...`);

      // Streaming API call
      const response = await client.models.generateContentStream(requestConfig);

      // Stream iterator oluştur
      const streamIterator = async function* () {
        for await (const chunk of response) {
          if (chunk.text) {
            yield chunk.text;
          }
        }
      };

      return {
        success: true,
        data: streamIterator(),
        message: "Gemini AI streaming başarıyla başlatıldı"
      };

    } catch (error) {
      console.error("Gemini AI streaming service hatası:", error);
      return this.handleError(error);
    }
  }

  /**
   * Mevcut konfigürasyonu döner
   */
  static getCurrentConfig(): GeminiConfig | null {
    return this.config;
  }

  /**
   * Client status'unu kontrol eder
   */
  static isClientReady(): boolean {
    return this.client !== null && this.config !== null;
  }

  /**
   * Error handling utility
   */
  private static handleError(error: unknown): GeminiServiceResult<never> {
    let geminiError: GeminiError;

    if (error instanceof Error) {
      // API key missing
      if (error.message.includes('API_KEY') || error.message.includes('apiKey')) {
        geminiError = {
          type: GeminiErrorType.API_KEY_MISSING,
          message: "Gemini API key bulunamadı veya geçersiz",
          details: error.message
        };
      }
      // Rate limit
      else if (error.message.includes('rate') || error.message.includes('quota')) {
        geminiError = {
          type: GeminiErrorType.RATE_LIMIT,
          message: "Gemini AI rate limit aşıldı",
          details: error.message
        };
      }
      // Invalid request
      else if (error.message.includes('invalid') || error.message.includes('400')) {
        geminiError = {
          type: GeminiErrorType.INVALID_REQUEST,
          message: "Geçersiz Gemini AI isteği",
          details: error.message
        };
      }
      // Server error
      else if (error.message.includes('500') || error.message.includes('server')) {
        geminiError = {
          type: GeminiErrorType.SERVER_ERROR,
          message: "Gemini AI server hatası",
          details: error.message
        };
      }
      // Network error
      else if (error.message.includes('network') || error.message.includes('connection')) {
        geminiError = {
          type: GeminiErrorType.NETWORK_ERROR,
          message: "Gemini AI bağlantı hatası",
          details: error.message
        };
      }
      // Unknown error
      else {
        geminiError = {
          type: GeminiErrorType.UNKNOWN_ERROR,
          message: "Bilinmeyen Gemini AI hatası",
          details: error.message
        };
      }
    } else {
      geminiError = {
        type: GeminiErrorType.UNKNOWN_ERROR,
        message: "Beklenmeyen hata oluştu",
        details: String(error)
      };
    }

    return {
      success: false,
      error: geminiError.message,
      message: `Gemini AI Error: ${geminiError.type}`
    };
  }
}
