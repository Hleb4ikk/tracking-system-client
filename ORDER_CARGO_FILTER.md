# Order Cargo Filter Feature

## Overview
Added the ability to filter cargos by order ID, allowing users to navigate from order details to view all cargos associated with that order.

## Changes Made

### 1. Backend (Already Existed)
The backend already had support for filtering cargos by `orderId`:
- **Schema**: `cargoSchemas.ts` includes `orderId` in `cargoFiltersSchema`
- **Repository**: `cargo.repository.ts` filters by `order_id` in the SQL query
- No backend changes were needed ✅

### 2. Frontend - CargosListPage (`src/pages/cargos/CargosListPage.tsx`)

#### Added Features:
1. **URL Parameter Support**
   - Reads `orderId` from URL query parameters
   - Example: `/cargos?orderId=123e4567-e89b-12d3-a456-426614174000`

2. **Filter State Management**
   - Added `orderId` to filters state
   - Automatically shows filters panel when `orderId` is present in URL
   - Persists `orderId` in URL when navigating between pages

3. **Visual Feedback**
   - Blue info card displays when filtering by order or supply connection
   - Shows "Filtered by Order" message
   - Quick "Clear" button to remove filters

4. **API Integration**
   - Passes `orderId` filter to `cargosApi.getCargos()` method
   - Filters are applied server-side for accurate results

### 3. Frontend - OrderDetails Component (`src/components/features/orders/OrderDetails.tsx`)

#### Added Features:
1. **View All Cargos Button**
   - New optional prop: `onViewAllCargos?: (orderId: string) => void`
   - "View All" button next to "Cargos" section header
   - Includes `ExternalLink` icon for visual clarity
   - Only shown when callback is provided

2. **Enhanced Cargos Section**
   - Displays cargo count in header
   - Shows preview of cargos (title, status, description)
   - Button to navigate to full filtered list

### 4. Frontend - OrdersListPage (`src/pages/orders/OrdersListPage.tsx`)

#### Added Features:
1. **Navigation Handler**
   - New function: `handleViewOrderCargos(orderId: string)`
   - Uses `useNavigate` to redirect to `/cargos?orderId={orderId}`
   - Passes handler to `OrderDetails` component

2. **Integration**
   - `OrderDetailsLoader` component passes navigation handler
   - Seamless navigation from order details to filtered cargo list

## User Flow

### Viewing Cargos for an Order:
1. User opens Orders page
2. Clicks on an order to view details
3. In the drawer, sees "Cargos (X)" section
4. Clicks "View All" button
5. Navigates to Cargos page with `orderId` filter applied
6. Sees blue info card: "Filtered by Order"
7. Can clear filter to see all cargos

### Direct URL Access:
- Users can bookmark or share URLs like `/cargos?orderId=...`
- Filter is automatically applied on page load
- Filters panel opens automatically when URL contains `orderId`

## Technical Details

### URL Parameters:
```typescript
// Single filter
/cargos?orderId=123e4567-e89b-12d3-a456-426614174000

// Multiple filters
/cargos?orderId=123e4567-e89b-12d3-a456-426614174000&status=on%20the%20way&page=2
```

### Filter State:
```typescript
const [filters, setFilters] = useState({
  title: '',
  status: '',
  supplyNodeConnectionId: '',
  orderId: '', // New filter
});
```

### API Call:
```typescript
const apiFilters: any = {};
if (activeFilters.orderId) apiFilters.orderId = activeFilters.orderId;

const data = await cargosApi.getCargos(page, apiFilters);
```

## Benefits

1. **Better Navigation**: Easy access to order-specific cargos
2. **Context Preservation**: URL-based filtering allows bookmarking and sharing
3. **Visual Clarity**: Clear indication when filters are active
4. **Consistent UX**: Similar to existing `supplyNodeConnectionId` filter
5. **No Backend Changes**: Leveraged existing backend functionality

## Related Features

- **Supply Connection Filter**: Similar filtering by `supplyNodeConnectionId`
- **Order Management**: View and manage orders with their associated cargos
- **Cargo Management**: Full CRUD operations on cargos with filtering

## Future Enhancements

Potential improvements:
- Add order title/info to the filter info card
- Show cargo count for order in the info card
- Add quick filter chips for common order statuses
- Export filtered cargo list
