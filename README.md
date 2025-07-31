# User Info MCP Server

Bu proje, Model Context Protocol (MCP) kullanarak kullanıcı bilgilerini JSON dosyasından sağlayan basit bir server'dır.

## Proje Yapısı

```
firstTry/
├── src/
│   └── server.ts          # Ana MCP server dosyası
├── data/
│   └── users.json         # Kullanıcı verileri
├── package.json           # Proje bağımlılıkları
├── tsconfig.json          # TypeScript yapılandırması
├── .cursorrules           # Cursor IDE kuralları
└── README.md              # Bu dosya
```

## Özellikler

MCP server dört temel tool sağlar:

1. **get_all_users**: Tüm kullanıcıların listesini getirir
2. **get_user_by_id**: Belirli bir ID'ye sahip kullanıcıyı getirir
3. **search_users_by_name**: İsme göre kullanıcı arar
4. **add_user**: Yeni kullanıcı ekler (name, email, phone gerekli)

## User Veri Yapısı

Her kullanıcı şu bilgileri içerir:
- `id`: Benzersiz kullanıcı kimliği (number)
- `name`: Kullanıcının tam adı (string)
- `email`: E-posta adresi (string)
- `phone`: Telefon numarası (string)

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. TypeScript'i derleyin:
```bash
npm run server:build
```

## Teknoloji Stack

- **Node.js** (v18+)
- **TypeScript** (strict mode)
- **Zod** (schema validation)
- **MCP TypeScript SDK** (@modelcontextprotocol/sdk)
- **ES Modules**

## Kullanım

### Development Modda Çalıştırma
```bash
npm run server:dev
```

### MCP Inspector ile Test Etme
```bash
npm run server:inspect
```

Bu komut MCP Inspector'ı açar ve tool'ları interaktif olarak test etmenizi sağlar.

### Production Build
```bash
npm run server:build
```

## Tool Kullanım Örnekleri

### Tüm kullanıcıları getir
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_all_users",
    "arguments": {}
  }
}
```

### Belirli bir kullanıcıyı getir
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

### İsme göre kullanıcı ara
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

### Yeni kullanıcı ekle
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

## Veri Dosyası Düzenleme

`data/users.json` dosyasını düzenleyerek yeni kullanıcılar ekleyebilir veya mevcut kullanıcı bilgilerini güncelleyebilirsiniz. Dosya formatı:

```json
[
  {
    "id": 1,
    "name": "Ahmet Yılmaz",
    "email": "ahmet.yilmaz@example.com",
    "phone": "+90 532 123 4567"
  }
]
```

## Geliştirme Notları

- Bu proje MCP öğrenme amaçlı basit tutulmuştur
- Veritabanı kullanılmamış, sadece JSON dosyası kullanılmıştır
- **TypeScript strict mode** aktiftir
- **Zod schema validation** kullanılmaktadır
- **Runtime type safety** sağlanmıştır
- Error handling eklenmiştir
- ES modules kullanılmaktadır
- Kullanıcı ekleme özelliği ile CRUD işlemleri desteklenmektedir
- E-posta validasyonu ve duplicate kontrolü vardır
- ID auto-increment sistemi kullanılmaktadır
- **Input schema'lar Context7 MCP best practices'e uygun**

## Güvenlik ve Validasyon

### Zod ile Type-Safe Validasyon
- **Schema-based validasyon**: Tüm input'lar Zod schema'ları ile doğrulanır
- **Runtime type checking**: TypeScript + Zod ile çifte güvenlik
- **Otomatik validasyon mesajları**: Zod'un built-in hata mesajları
- **E-posta format validasyonu**: `z.string().email()` ile
- **String uzunluk kontrolü**: `z.string().min(2).max(100)`
- **Sayı validasyonu**: `z.number().int().positive()`
- **Duplicate e-posta kontrolü**
- **Required field validasyonu**

### Zod Schema'ları
```typescript
const UserSchema = z.object({
  id: z.number().int().positive().describe("Benzersiz kullanıcı kimliği"),
  name: z.string().min(2).max(100).describe("Kullanıcının tam adı"),
  email: z.string().email().describe("E-posta adresi"),
  phone: z.string().min(10).max(20).describe("Telefon numarası")
});

const AddUserSchema = z.object({
  name: z.string().min(2).max(100).describe("Kullanıcının tam adı"),
  email: z.string().email().describe("E-posta adresi"),
  phone: z.string().min(10).max(20).describe("Telefon numarası")
});
```

## MCP Hakkında

Model Context Protocol (MCP), AI asistanlarına structured veri ve tool sağlamak için tasarlanmış bir protokoldür. Bu proje MCP server geliştirme konusunda pratik yapmak için idealdir.