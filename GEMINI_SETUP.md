# 🚀 Gemini AI Setup Guide

## ✅ Problem Çözüldü!

Environment variable validation hatası düzeltildi. Artık Gemini AI tools'ları kullanabilirsiniz.

## 🔧 Kurulum Adımları

### 1. API Key Alın
1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
2. "Create API Key" butonuna tıklayın  
3. API key'inizi kopyalayın

### 2. Environment Variable Set Edin

**Terminal'de:**
```bash
export GEMINI_API_KEY="your_actual_api_key_here"
```

**Kalıcı olarak (.zshrc veya .bashrc):**
```bash
echo 'export GEMINI_API_KEY="your_actual_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

### 3. Server'ı Başlatın

```bash
# Development mode
bun run server:dev

# MCP Inspector ile test
bun run server:inspect
```

## 🧪 Test Etme

1. `bun run server:inspect` çalıştırın
2. Browser'da açılan MCP Inspector'ı kullanın
3. `gemini_generate_text` tool'unu seçin
4. Prompt girin (örn: "Python ile web scraping nasıl yapılır?")
5. Test edin!

## 🛠️ Kullanılabilir Tools

1. **`gemini_generate_text`** - Text generation
   - `prompt`: Sorgu/prompt (gerekli)
   - `model`: Model seçimi (opsiyonel)
   - `maxTokens`: Token limiti (opsiyonel)
   - `temperature`: Yaratıcılık seviyesi (opsiyonel)

2. **`gemini_chat`** - Chat conversation
   - `message`: Chat mesajı (gerekli)
   - `model`: Model seçimi (opsiyonel)
   - `conversationId`: Konuşma ID (opsiyonel)
   - `systemInstruction`: System instruction (opsiyonel)

3. **`gemini_status`** - Durum kontrolü
   - Parametre gerektirmez

4. **`gemini_generate_stream`** - Streaming generation
   - `gemini_generate_text` ile aynı parametreler

## ❌ Hata Çözümü

### "GEMINI_API_KEY environment variable is required" Hatası
```bash
# API key'i set edin:
export GEMINI_API_KEY="your_api_key_here"

# Kontrol edin:
echo $GEMINI_API_KEY
```

### Server Başlatma Sorunları
```bash
# Bağımlılıkları yeniden yükleyin:
bun install

# Build'i kontrol edin:
bun run server:build

# Server'ı başlatın:
bun run server:dev
```

## 🎯 Örnek Kullanım

**Basit Text Generation:**
```json
{
  "prompt": "TypeScript ile REST API nasıl oluşturulur?"
}
```

**Gelişmiş Chat:**
```json
{
  "message": "Merhaba, nasılsın?",
  "systemInstruction": "Sen yardımsever bir Türkçe AI asistanısın.",
  "model": "gemini-2.0-flash-001"
}
```

## ✅ Başarı Göstergeleri

Server başlatıldığında şu mesajları görmelisiniz:
```
✅ User tools registered successfully
✅ Gemini AI tools başarıyla kaydetildi:
   - gemini_generate_text: Text generation
   - gemini_chat: Chat conversation
   - gemini_status: Status kontrolü
   - gemini_generate_stream: Streaming generation
✅ Tüm tools başarıyla kaydedildi (User + Gemini AI)
User Info MCP Server başlatıldı
```

## 🔗 Daha Fazla Bilgi

- [README_GEMINI.md](./README_GEMINI.md) - Detaylı dokümantasyon
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)

---

**Artık Gemini AI entegrasyonu hazır! 🎉**
