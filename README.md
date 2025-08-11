# User Info MCP Server

🚀 **Gelişmiş Model Context Protocol (MCP) Server** - Context7 Best Practices ile geliştirilmiş kullanıcı yönetim sistemi.

Bu proje, modern layered architecture pattern kullanarak kullanıcı bilgilerini JSON dosyasından sağlayan profesyonel bir MCP server'dır. **Context7 MCP best practices** ve **clean architecture** prensipleri uygulanarak geliştirilmiştir.

<a href="https://glama.ai/mcp/servers/@huseyindol/McpProjectScaffold">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@huseyindol/McpProjectScaffold/badge" alt="User Info Server MCP server" />
</a>

## 🏗️ Proje Mimarisi

```
McpProjectScaffold/
├── src/
│   ├── server.ts                   # 🎯 Ana MCP server (Entry Point)
│   ├── controllers/
│   │   └── user.controller.ts      # 🎮 Tool handlers (MCP Interface Layer)
│   ├── services/
│   │   └── user.service.ts         # 🧠 Business logic & validation
│   ├── repositories/
│   │   └── user.repository.ts      # 💾 Data access layer (JSON operations)
│   ├── tools/
│   │   ├── index.ts               # 🔧 Tool registration orchestrator
│   │   └── user-tools.ts          # 📋 MCP tool definitions
│   └── types/
│       └── user.ts                # 📝 TypeScript interfaces & Zod schemas
├── data/
│   └── users.json                 # 💿 JSON veri dosyası
├── package.json                   # 📦 Proje bağımlılıkları
├── tsconfig.json                  # ⚙️ TypeScript konfigürasyonu
└── README.md                      # 📖 Bu dosya
```

### 🎨 Architecture Pattern: Layered Architecture (Context7 Pattern)

**Separation of Concerns** prensipleri:
- **Controllers** → MCP tool handlers & response formatting
- **Services** → Business logic, validation & error handling  
- **Repositories** → Pure data access (JSON file operations)
- **Tools** → MCP tool registration & schema definitions
- **Types** → TypeScript interfaces & Zod validation schemas

## ✨ Özellikler

MCP server **6 gelişmiş tool** sağlar:

1. **get_all_users** → Tüm kullanıcıların listesini getirir
2. **get_user_by_id** → ID'ye göre belirli kullanıcıyı getirir  
3. **search_users_by_name** → İsme göre kullanıcı arar (partial match)
4. **search_users_by_email** → E-posta adresine göre kullanıcı arar
5. **search_users_by_phone** → Telefon numarasına göre kullanıcı arar
6. **add_user** → Yeni kullanıcı ekler (validation + duplicate control)

### 🔍 User Veri Yapısı

```typescript
interface User {
  id: number;        // Benzersiz kullanıcı kimliği (auto-increment)
  name: string;      // Kullanıcının tam adı (2-100 karakter)
  email: string;     // E-posta adresi (unique, email format)
  phone: string;     // Telefon numarası (10-20 karakter)
}
```

## 📦 Kurulum & Setup

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. TypeScript Build
```bash
npm run server:build
```

### 3. Development Mode
```bash
npm run server:dev
```

### 4. MCP Inspector ile Test
```bash
npm run server:inspect
```

## 🛠️ Teknoloji Stack

### Core Technologies
- **Node.js** (v18+) → JavaScript runtime
- **TypeScript** (v5.8+) → Type-safe development  
- **ES Modules** → Modern module system
- **MCP TypeScript SDK** → Protocol implementation

### Development & Quality Tools
- **Zod** (v3.25+) → Runtime schema validation
- **tsx** → TypeScript execution
- **MCP Inspector** → Interactive tool testing
- **Strict TypeScript** → Maximum type safety

### Architecture Patterns
- **Context7 MCP Best Practices** → Industry standards
- **Layered Architecture** → Clean separation of concerns
- **Repository Pattern** → Data access abstraction
- **Service Layer Pattern** → Business logic encapsulation

## 🚀 Kullanım

### Development Scripts
```bash
# Development mode (hot reload)
npm run server:dev

# TypeScript build
npm run server:build

# Watch mode build
npm run server:build:watch

# MCP Inspector (interactive testing)
npm run server:inspect
```

### MCP Inspector Kullanımı
```bash
npm run server:inspect
```
Bu komut **MCP Inspector** web arayüzünü açar ve tool'ları interaktif olarak test etmenizi sağlar. Tarayıcıda `http://localhost:3000` adresinde açılır.

## 🔧 MCP Tool Kullanım Örnekleri

### 1. Tüm Kullanıcıları Getir
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_all_users",
    "arguments": {}
  }
}
```

### 2. ID'ye Göre Kullanıcı Getir
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_user_by_id",
    "arguments": {
      "id": 1
    }
  }
}
```

### 3. İsme Göre Kullanıcı Ara
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_users_by_name",
    "arguments": {
      "name": "Ahmet"
    }
  }
}
```

### 4. E-posta ile Kullanıcı Ara
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_users_by_email",
    "arguments": {
      "email": "ahmet.yilmaz@example.com"
    }
  }
}
```

### 5. Telefon ile Kullanıcı Ara
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_users_by_phone",
    "arguments": {
      "phone": "+90 532 123 4567"
    }
  }
}
```

### 6. Yeni Kullanıcı Ekle
```json
{
  "method": "tools/call",
  "params": {
    "name": "add_user",
    "arguments": {
      "name": "Zeynep Kılıç",
      "email": "zeynep.kilic@example.com",
      "phone": "+90 537 555 1234"
    }
  }
}
```

## 📁 Veri Dosyası Düzenleme

`data/users.json` dosyasını düzenleyerek kullanıcı verilerini manuel olarak değiştirebilirsiniz:

```json
[
  {
    "id": 1,
    "name": "Ahmet Yılmaz",
    "email": "ahmet.yilmaz@example.com",
    "phone": "+90 532 123 4567"
  },
  {
    "id": 2,
    "name": "Ayşe Demir", 
    "email": "ayse.demir@example.com",
    "phone": "+90 533 987 6543"
  }
]
```

**⚠️ Not**: JSON formatını bozmamaya dikkat edin. Yeni kullanıcılar için `add_user` tool'unu kullanmak daha güvenlidir.

## 🔗 MCP Client Konfigürasyonu

Bu MCP server'ı çeşitli IDE'ler ve AI araçlarında kullanabilirsiniz:

### Cursor IDE
```json
{
  "mcpServers": {
    "user-info-server": {
      "command": "node",
      "args": ["dist/server.js"],
      "cwd": "/path/to/McpProjectScaffold"
    }
  }
}
```

### Claude Desktop
```json
{
  "mcpServers": {
    "user-info-server": {
      "command": "npm",
      "args": ["run", "server:dev"],
      "cwd": "/path/to/McpProjectScaffold"
    }
  }
}
```

### VS Code (MCP Extension)
```json
{
  "mcp": {
    "servers": {
      "user-info-server": {
        "type": "stdio",
        "command": "npm",
        "args": ["run", "server:dev"],
        "cwd": "/path/to/McpProjectScaffold"
      }
    }
  }
}
```

## 🔒 Güvenlik & Validasyon

### Zod ile Type-Safe Validasyon
- **Schema-based validasyon** → Tüm input'lar Zod schema'ları ile doğrulanır
- **Runtime type checking** → TypeScript + Zod ile çifte güvenlik
- **Otomatik validasyon mesajları** → Zod'un built-in error handling
- **E-posta format kontrolü** → `z.string().email()` ile format doğrulama
- **String uzunluk kontrolü** → `z.string().min(2).max(100)` ile range validation
- **Sayı validasyonu** → `z.number().int().positive()` ile integer kontrolü
- **Duplicate e-posta kontrolü** → Repository layer'da unique email kontrolü
- **Required field validasyonu** → Zod schema ile zorunlu alan kontrolü

### Zod Schema Örnekleri
```typescript
// User entity schema
export const UserSchema = z.object({
  id: z.number().int().positive().describe("Benzersiz kullanıcı kimliği"),
  name: z.string().min(2).max(100).describe("Kullanıcının tam adı"),
  email: z.string().email().describe("E-posta adresi"),
  phone: z.string().min(10).max(20).describe("Telefon numarası")
});

// Add user input schema
export const AddUserInputSchema = {
  name: z.string().min(2).max(100).describe("Kullanıcının tam adı"),
  email: z.string().email().describe("E-posta adresi"),
  phone: z.string().min(10).max(20).describe("Telefon numarası")
};
```

## 🏗️ Geliştirme Notları

### Context7 MCP Best Practices ✅
- **Modular architecture** → Layered separation of concerns
- **Tool registration** → Clean tool definition & registration
- **Error handling** → Comprehensive error management
- **Type safety** → Full TypeScript + Zod validation
- **Input schemas** → Context7 compatible schema definitions
- **Clean responses** → Standardized MCP response format

### Technical Features
- **ES Modules** → Modern JavaScript module system
- **Strict TypeScript** → Maximum type safety
- **Auto-increment IDs** → Automatic ID generation
- **Duplicate prevention** → Email uniqueness checks
- **Business validation** → Service layer business rules
- **Repository pattern** → Data access abstraction
- **CRUD operations** → Full Create, Read, Update capabilities

### Code Quality
- **Separation of concerns** → Each layer has single responsibility
- **Error boundaries** → Proper error catching & handling
- **Validation layers** → Multiple validation levels
- **Clean code** → Readable, maintainable codebase
- **Type inference** → Zod to TypeScript type generation

## 📚 MCP Protocol Hakkında

**Model Context Protocol (MCP)**, AI asistanlarına structured veri ve tool sağlamak için tasarlanmış modern bir protokoldür. 

### MCP'nin Avantajları:
- **Standardized communication** → AI araçları arası standart iletişim
- **Tool-based architecture** → Modular fonksiyonellik
- **Real-time data access** → Canlı veri erişimi
- **Type-safe operations** → Güvenli operasyonlar
- **Cross-platform compatibility** → Platform bağımsızlık

Bu proje, **Context7 MCP best practices** kullanarak profesyonel MCP server geliştirme konusunda pratik yapmak için tasarlanmıştır.

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'e push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**🚀 Happy Coding!** - Context7 MCP Best Practices ile geliştirilmiştir.