# MCP Project Scaffold - Mimari Kurallar ve Kılavuz

## 🏗️ Proje Mimarisi

### 📋 Temel İlkeler
Bu proje **Context7 MCP Best Practices** ve **Clean Architecture** prensipleri üzerine inşa edilmiştir.

---

## 🎯 Katmanlı Mimari (Layered Architecture)

```
McpProjectScaffold/
├── src/
│   ├── server.ts                   # 🎯 Entry Point - MCP Server
│   ├── controllers/                # 🎮 MCP Interface Layer
│   │   └── *.controller.ts         
│   ├── services/                   # 🧠 Business Logic Layer
│   │   └── *.service.ts            
│   ├── repositories/               # 💾 Data Access Layer
│   │   └── *.repository.ts         
│   ├── tools/                      # 🔧 MCP Registration Layer
│   │   ├── index.ts               # Registration orchestrator
│   │   └── *-tools.ts             # Tool definitions
│   ├── types/                      # 📝 Type Definitions
│   │   └── *.ts                   # Interfaces & Schemas
│   └── utils/                      # 🛠️ Utilities
│       └── *.ts                   
├── data/                           # 💿 Data Storage
│   └── *.json                     
└── docs/                           # 📖 Documentation
    ├── PROJECT_PROGRESS.md         # İlerleyiş takibi
    └── ARCHITECTURE_RULES.md       # Bu dosya
```

---

## 🔒 Katman Sorumlulukları

### 1️⃣ **Controllers Layer** (`src/controllers/`)
**Sorumluluk:** MCP Tool Handler'ları ve Response Formatting

#### ✅ Yapması Gerekenler:
- MCP tool request'lerini handle etmek
- Input validation (Zod schemas ile)
- Service layer'ı çağırmak
- Response formatting (ToolResponse interface)
- Error handling ve kullanıcı dostu mesajlar

#### ❌ Yapmaması Gerekenler:
- Business logic implementasyonu
- Direkt veri erişimi (repository'yi bypass etmek)
- External API çağrıları
- Karmaşık hesaplamalar

#### 📝 Naming Convention:
```typescript
// ✅ Doğru
export class UserController {
  static async handleGetUserById(args: GetUserByIdArgs): Promise<ToolResponse>
  static async handleSearchUsers(args: SearchArgs): Promise<ToolResponse>
}

// ❌ Yanlış
export class UserService {} // Bu service layer'da olmalı
```

### 2️⃣ **Services Layer** (`src/services/`)
**Sorumluluk:** Business Logic ve Validation

#### ✅ Yapması Gerekenler:
- Business rule'ları implement etmek
- Complex validation logic
- Repository layer'ı coordinate etmek
- Error handling ve business exceptions
- Data transformation ve processing

#### ❌ Yapmaması Gerekenler:
- MCP specific logic
- Direct data access (file operations)
- Response formatting

#### 📝 Naming Convention:
```typescript
// ✅ Doğru
export class UserService {
  async getAllUsers(): Promise<ServiceResult<User[]>>
  async validateUserData(userData: unknown): Promise<User>
}
```

### 3️⃣ **Repositories Layer** (`src/repositories/`)
**Sorumluluk:** Pure Data Access

#### ✅ Yapması Gerekenler:
- JSON file operations (read/write)
- Data CRUD operations
- Data filtering ve searching
- File system error handling

#### ❌ Yapmaması Gerekenler:
- Business logic
- Validation (data format dışında)
- Response formatting

#### 📝 Naming Convention:
```typescript
// ✅ Doğru
export class UserRepository {
  static async findAll(): Promise<User[]>
  static async findById(id: number): Promise<User | null>
  static async save(user: User): Promise<void>
}
```

### 4️⃣ **Tools Layer** (`src/tools/`)
**Sorumluluk:** MCP Tool Registration

#### ✅ Yapması Gerekenler:
- Tool schema definitions
- MCP server registration
- Input/output schema tanımları
- Controller metodlarını binding

#### ❌ Yapmaması Gerekenler:
- Business logic
- Data operations
- Complex processing

#### 📝 Naming Convention:
```typescript
// ✅ Doğru - tools/user-tools.ts
export function registerUserTools(server: McpServer): void {
  server.registerTool("get_user_by_id", schema, UserController.handleGetUserById)
}

// ✅ Doğru - tools/index.ts
export function registerAllTools(server: McpServer): void {
  registerUserTools(server)
  registerLoanTools(server)
}
```

### 5️⃣ **Types Layer** (`src/types/`)
**Sorumluluk:** Type Definitions ve Schemas

#### ✅ Yapması Gerekenler:
- TypeScript interfaces
- Zod validation schemas
- Enum definitions
- Type utilities

---

## 🚫 Kritik Kurallar

### 📦 Package Management
```bash
# ✅ Sadece bun kullan
bun add package-name
bun run script-name
bun install

# ❌ Asla npm/yarn kullanma
npm install   # YASAK
yarn add      # YASAK
```

### 🔄 Import/Export Rules
```typescript
// ✅ ES Modules syntax
import { Something } from "./path.js"  // .js extension zorunlu
export { Something }

// ❌ CommonJS
const something = require('./path')   // YASAK
```

### 🎯 MCP Tool Registration
```typescript
// ✅ Doğru: Tools layer'da registration
// tools/user-tools.ts
export function registerUserTools(server: McpServer) {
  server.registerTool("tool_name", schema, ControllerMethod)
}

// ❌ Yanlış: Controller'da registration
// controllers/user.controller.ts  
server.registerTool(...) // YASAK
```

### 🧪 Type Safety
```typescript
// ✅ Strict TypeScript
interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
}

// ❌ Any types
const response: any = {...}  // YASAK
```

---

## 🔧 Development Workflow

### 1️⃣ **Yeni Feature Ekleme Sırası**
1. **Types** → Interface ve schema tanımla
2. **Repository** → Data access metodları
3. **Service** → Business logic
4. **Controller** → MCP handler
5. **Tools** → Tool registration
6. **Test** → MCP Inspector ile test

### 2️⃣ **File Naming Convention**
- Controllers: `feature.controller.ts`
- Services: `feature.service.ts`
- Repositories: `feature.repository.ts`
- Tools: `feature-tools.ts`
- Types: `featureTypes.ts`

### 3️⃣ **Error Handling Pattern**
```typescript
// Service Layer
interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Controller Layer
try {
  const result = await service.method()
  return {
    content: [{
      type: "text",
      text: result.success ? JSON.stringify(result.data) : result.error
    }]
  }
} catch (error) {
  return {
    content: [{
      type: "text", 
      text: "Beklenmeyen hata oluştu"
    }]
  }
}
```

---

## ⚠️ Kritik Uyarılar

### 🚨 Asla Yapılmaması Gerekenler
1. **Layer Bypass:** Controller → Repository direkt erişim
2. **Circular Dependencies:** Service ↔ Controller döngüsel bağımlılık
3. **Mixed Responsibilities:** Controller'da business logic
4. **Package Manager Karışımı:** npm ile bun karıştırma
5. **Type Safety İhlali:** any type kullanımı

### 🔍 Her Değişiklik Öncesi Kontrol Et
1. **Dependency Direction:** Sadece aşağı katmana bağımlılık
2. **Single Responsibility:** Her class tek sorumluluğa sahip
3. **MCP Standards:** Context7 pattern'ları takip ediliyor mu
4. **Type Safety:** TypeScript strict mode uyumlu mu
5. **File Structure:** Dosya doğru katmanda mı

---

## 📚 Context7 MCP Best Practices

### 🎯 Tool Design
- Her tool tek bir işlev yapmalı
- Input/output schema'ları açık tanımlanmalı
- Error handling comprehensive olmalı
- Response format tutarlı olmalı

### 🔧 Server Architecture
- Modular tool registration
- Clean separation of concerns
- Proper error propagation
- Logging ve debugging support

### 📝 Code Quality
- TypeScript strict mode
- Comprehensive type definitions
- Clear naming conventions
- Documentation ve comments

---

**Bu kurallar her prompt'ta dikkate alınmalı ve değişiklikler bu mimariye uygun yapılmalıdır.**