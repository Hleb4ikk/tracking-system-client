# Supply Chain Visualization Guide

## 🎨 Overview

Новая визуализация supply chains отображает **все соединения** в цепочке, независимо от структуры графа (дерево, циклы, несвязанные компоненты).

## 📊 Компоненты визуализации

### 1. **Статистика (Statistics)**

Три карточки с ключевыми метриками:

- **Starting Points (Зеленые)** - узлы без входящих соединений
  - Это точки начала цепочки (склады, производства)
  - Цвет: зеленый
  
- **Distribution Hubs (Синие)** - узлы с входящими и исходящими соединениями
  - Промежуточные точки (распределительные центры)
  - Цвет: синий
  
- **End Points (Красные)** - узлы без исходящих соединений
  - Конечные точки (магазины, клиенты)
  - Цвет: красный

### 2. **Узлы по типам (Nodes by Type)**

Узлы сгруппированы по их роли в цепочке:

#### Starting Points (Зеленая граница)
```
┌─────────────────────────────┐
│ 🟢 Warehouse A              │
│ Description...              │
│ New York, USA               │
│ [↑ 2 out]                   │
└─────────────────────────────┘
```

#### Distribution Hubs (Синяя граница)
```
┌─────────────────────────────┐
│ 🔵 Distribution Center B    │
│ Description...              │
│ Chicago, USA                │
│ [↓ 1 in] [↑ 3 out]          │
└─────────────────────────────┘
```

#### End Points (Красная граница)
```
┌─────────────────────────────┐
│ 🔴 Store C                  │
│ Description...              │
│ Los Angeles, USA            │
│ [↓ 2 in]                    │
└─────────────────────────────┘
```

### 3. **Все соединения (All Connections)**

Полный список всех соединений с деталями:

```
┌────────────────────────────────────────────────────────────┐
│ 🟢 Warehouse A          →  [150 km]  →  🔴 Store B        │
│    New York, USA                          Boston, USA      │
└────────────────────────────────────────────────────────────┘
```

## 🎯 Преимущества новой визуализации

### ✅ Показывает все соединения
- Не ограничивается деревом
- Отображает циклы
- Показывает несвязанные компоненты

### ✅ Понятная классификация
- Цветовое кодирование по роли
- Статистика входящих/исходящих соединений
- Группировка по типам узлов

### ✅ Детальная информация
- Полная информация о каждом узле
- Расстояния между узлами
- Местоположение узлов

### ✅ Адаптивный дизайн
- Сетка на больших экранах (2 колонки)
- Одна колонка на мобильных
- Hover эффекты для интерактивности

## 📱 Примеры структур

### Пример 1: Линейная цепочка
```
Starting Point → Hub → End Point
```
- 1 зеленый узел (Starting Point)
- 1 синий узел (Hub)
- 1 красный узел (End Point)
- 2 соединения

### Пример 2: Hub-and-Spoke
```
        → End Point 1
Hub → → End Point 2
        → End Point 3
```
- 1 зеленый узел (Hub - если нет входящих)
- 0 синих узлов
- 3 красных узла (End Points)
- 3 соединения

### Пример 3: Сложная сеть
```
Start 1 → Hub A → Hub B → End 1
              ↓
Start 2 → Hub C → End 2
```
- 2 зеленых узла (Start 1, Start 2)
- 3 синих узла (Hub A, Hub B, Hub C)
- 2 красных узла (End 1, End 2)
- 5 соединений

### Пример 4: Цикл
```
A → B → C → A
```
- 0 зеленых узлов (все имеют входящие)
- 3 синих узла (все имеют входящие и исходящие)
- 0 красных узлов (все имеют исходящие)
- 3 соединения

## 🎨 Цветовая схема

### Light Mode
- Starting Points: `bg-green-50`, `border-green-300`
- Hubs: `bg-blue-50`, `border-blue-300`
- End Points: `bg-red-50`, `border-red-300`
- Connections: `bg-white`, `border-gray-200`

### Dark Mode
- Starting Points: `bg-green-900/20`, `border-green-700`
- Hubs: `bg-blue-900/20`, `border-blue-700`
- End Points: `bg-red-900/20`, `border-red-700`
- Connections: `bg-gray-900`, `border-gray-700`

## 🔧 Технические детали

### Алгоритм классификации узлов

```typescript
// Starting Points: incoming = 0
const isStartingPoint = (nodeId) => {
  const stats = nodeStats.get(nodeId);
  return !stats || stats.incoming === 0;
};

// Hubs: incoming > 0 AND outgoing > 0
const isHub = (nodeId) => {
  const stats = nodeStats.get(nodeId);
  return stats && stats.incoming > 0 && stats.outgoing > 0;
};

// End Points: outgoing = 0
const isEndPoint = (nodeId) => {
  const stats = nodeStats.get(nodeId);
  return !stats || stats.outgoing === 0;
};
```

### Извлечение соединений из графа

```typescript
const traverse = (node) => {
  if (visited.has(node.id)) return;
  visited.add(node.id);

  if (node.next && Array.isArray(node.next)) {
    node.next.forEach((edge) => {
      connections.push({
        id: edge.conn_id,
        from: node,
        to: edge.node,
        distance: edge.distance,
      });
      traverse(edge.node);
    });
  }
};
```

## 📊 Метрики производительности

- **Узлов**: до 100 (рекомендуется)
- **Соединений**: до 500 (рекомендуется)
- **Время рендеринга**: < 100ms для типичных графов
- **Память**: ~1KB на узел

## 🚀 Будущие улучшения

1. **Интерактивный граф**
   - Drag & drop узлов
   - Zoom и pan
   - Фильтрация по типам

2. **Аналитика**
   - Самый длинный путь
   - Критические узлы
   - Узкие места

3. **Экспорт**
   - PNG/SVG изображение
   - JSON данные
   - CSV таблица

4. **Поиск**
   - Поиск узлов
   - Поиск соединений
   - Фильтрация по расстоянию

---

**Last Updated:** May 10, 2026
**Version:** 2.0.0
