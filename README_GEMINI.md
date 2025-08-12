# Gemini AI Entegrasyonu

Bu proje artık Google Gemini AI desteği ile geliştirilmiştir. Proje mimarisine uygun olarak Context7 MCP Best Practices kullanılarak geliştirilmiştir.

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle
```bash
bun install
```

### 2. Gemini API Key Ayarla
Gemini API key'inizi environment variable olarak ayarlayın:

```bash
# Gemini API Key'i ayarla
export GEMINI_API_KEY="your_api_key_here"
```

Gemini API key almak için:
1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
2. "Create API Key" butonuna tıklayın
3. API key'inizi kopyalayın

### 3. Server'ı Başlat
```bash
# Development mode
bun run server:dev

# MCP Inspector ile debug
bun run server:inspect
```

## 🛠️ Kullanılabilir Gemini Tools

### 1. `gemini_generate_text`
Gemini AI kullanarak text generation yapar.

**Parametreler:**
- `prompt` (gerekli): Gemini AI'ya gönderilecek prompt/soru
- `model` (opsiyonel): Kullanılacak model (varsayılan: gemini-2.0-flash-001)
- `maxTokens` (opsiyonel): Maksimum token sayısı (varsayılan: 1000)
- `temperature` (opsiyonel): Yaratıcılık seviyesi 0-2 arası (varsayılan: 0.7)

**Örnek Kullanım:**
```json
{
  "prompt": "Python ile web scraping nasıl yapılır?",
  "model": "gemini-2.0-flash-001",
  "maxTokens": 1500,
  "temperature": 0.5
}
```

### 2. `gemini_chat`
Gemini AI ile chat conversation yapar.

**Parametreler:**
- `message` (gerekli): Chat mesajı
- `model` (opsiyonel): Kullanılacak model
- `conversationId` (opsiyonel): Konuşma ID'si
- `systemInstruction` (opsiyonel): System instruction

**Örnek Kullanım:**
```json
{
  "message": "Merhaba, nasılsın?",
  "systemInstruction": "Sen yardımsever bir AI asistanısın."
}
```

### 3. `gemini_status`
Gemini AI client'ının durumunu kontrol eder.

**Parametreler:** Yok

### 4. `gemini_generate_stream`
Streaming text generation yapar (büyük yanıtlar için daha hızlı).

**Parametreler:** `gemini_generate_text` ile aynı

## 📁 Proje Mimarisi

Gemini AI entegrasyonu proje mimarisine uygun olarak geliştirilmiştir:

```
src/
├── types/
│   └── gemini.ts              # Gemini type definitions
├── schemas/
│   └── gemini.schema.ts       # Zod validation schemas
├── services/
│   └── gemini.service.ts      # Business logic layer
├── controllers/
│   └── gemini.controller.ts   # MCP interface layer
└── tools/
    └── gemini-tools.ts        # MCP tool registration
```

### Katman Sorumlulukları

1. **Types Layer**: TypeScript interface'leri ve type tanımları
2. **Schemas Layer**: Zod validation schema'ları
3. **Services Layer**: Gemini AI ile iletişim business logic'i
4. **Controllers Layer**: MCP tool handler'ları ve response formatting
5. **Tools Layer**: MCP tool registration ve schema definitions

## 🔧 Konfigürasyon

### Environment Variables
- `GEMINI_API_KEY`: Google Gemini AI API anahtarı (gerekli)

### Default Configuration
```typescript
{
  model: 'gemini-2.0-flash-001',
  maxTokens: 1000,
  temperature: 0.7,
  topP: 0.9,
  topK: 40
}
```

## 🐛 Hata Yönetimi

Gemini service kapsamlı hata yönetimi içerir:

- **API_KEY_MISSING**: API key bulunamadı
- **INVALID_REQUEST**: Geçersiz istek
- **RATE_LIMIT**: Rate limit aşıldı
- **SERVER_ERROR**: Server hatası
- **NETWORK_ERROR**: Bağlantı hatası
- **UNKNOWN_ERROR**: Bilinmeyen hata

## 📊 Context7 MCP Best Practices

Bu entegrasyon Context7 MCP standartlarını takip eder:

- ✅ Clean Architecture principles
- ✅ Layered architecture
- ✅ Comprehensive error handling
- ✅ TypeScript strict mode
- ✅ Zod validation
- ✅ Modular tool registration
- ✅ Proper separation of concerns

## 🚨 Güvenlik

- API key'leri environment variable olarak tutun
- .env dosyalarını .gitignore'a ekleyin
- Production'da API key'leri güvenli yönetin
- Rate limiting'e dikkat edin

## 📝 Örnek Kullanım

MCP Inspector ile test:

1. Server'ı başlatın: `bun run server:inspect`
2. Browser'da açılan MCP Inspector'ı kullanın
3. `gemini_generate_text` tool'unu seçin
4. Prompt girin ve test edin

Console'da log'ları görebilirsiniz:
```
Gemini AI client başarıyla initialize edildi
Gemini AI'ya sorgu gönderiliyor: Python ile web scraping nasıl...
Gemini AI yanıtı alındı: Web scraping, web sitelerinden...
```

## 🔄 Güncellemeler

Bu entegrasyon gelecekte şu özelliklerle genişletilebilir:

- [ ] File upload desteği
- [ ] Image generation
- [ ] Function calling
- [ ] Conversation memory
- [ ] Multi-modal content
- [ ] Batch processing

## 📞 Destek

Sorunlar için:
1. Console log'larını kontrol edin
2. API key'in doğru olduğundan emin olun
3. Network bağlantısını kontrol edin
4. Rate limit'leri kontrol edin
