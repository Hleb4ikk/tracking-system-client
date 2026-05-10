# Receiver Structure Synchronization

## Проблема
Структура receiver на фронтенде не соответствовала структуре на бэкенде.

## Backend Structure (Correct)
```typescript
interface Receiver {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  company_id: string;
}
```

## Frontend Structure (Было неправильно)
```typescript
interface Receiver {
  id: string;
  name: string;
  surname: string;
  phone: string;
  country: string;      // ❌ Не существует на бэкенде
  zip: string;          // ❌ Не существует на бэкенде
  region: string;       // ❌ Не существует на бэкенде
  city: string;         // ❌ Не существует на бэкенде
  address_line: string; // ❌ Не существует на бэкенде
  company_id: string;
}
```

## Изменения

### 1. `src/types/receiver.types.ts`
- ✅ Удалены поля: `country`, `zip`, `region`, `city`, `address_line`
- ✅ Добавлено поле: `email`
- ✅ Обновлены `CreateReceiverDto` и `UpdateReceiverDto`

### 2. `src/schemas/receiver.schemas.ts`
- ✅ Изменено `first_name` → `name`
- ✅ Изменено `last_name` → `surname`
- ✅ Добавлена валидация `email`
- ✅ Удалены поля адреса

### 3. `src/components/features/orders/OrderForm.tsx`
- ✅ Обновлен select для receivers:
  - Было: `{receiver.first_name} {receiver.last_name} - {receiver.city}, {receiver.country}`
  - Стало: `{receiver.name} {receiver.surname} - {receiver.email}`

### 4. `src/components/features/orders/OrderDetails.tsx`
- ✅ Обновлено отображение receiver:
  - Было: `first_name`, `last_name`, `phone`, `address_line`, `city`, `region`, `country`, `zip`
  - Стало: `name`, `surname`, `email`, `phone`

## Backend Reference
- **Migration**: `migrations/sqls/20260507092230-create-recievers-table-up.sql`
- **Schema**: `src/schemas/recieverSchemas.ts`
- **Fields**: `id`, `name`, `surname`, `email`, `phone`, `company_id`

## Seed Data
Seed файл также обновлен для создания receivers с правильной структурой (только `name`, `surname`, `email`, `phone`).

---

**Дата**: 10 мая 2026  
**Статус**: ✅ Завершено
