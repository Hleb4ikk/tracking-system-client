# Cargo Supply Chain Connection Selector

## Overview
Replaced the manual UUID input field for supply node connections in the cargo form with a user-friendly two-step selector.

## Changes Made

### CargoForm Component (`src/components/features/cargos/CargoForm.tsx`)

#### New Features:
1. **Supply Chain Dropdown**
   - First step: User selects a supply chain from available chains
   - Shows all supply chains belonging to the user's company
   - Includes helpful hint text

2. **Connection Route Dropdown**
   - Second step: User selects a specific connection from the chosen supply chain
   - Displays connections in readable format: `Start Node → Destination Node (distance km)`
   - Automatically loads connections when supply chain is selected
   - Shows loading state while fetching connections
   - Disabled until supply chain is selected

3. **Smart Pre-filling for Edit Mode**
   - When editing existing cargo, automatically finds and selects the supply chain
   - Pre-selects the existing connection route
   - Iterates through supply chains to find the one containing the cargo's connection

#### State Management:
- `supplyChains`: List of available supply chains
- `selectedSupplyChainId`: Currently selected supply chain
- `connections`: Available connections for selected supply chain
- `isLoadingConnections`: Loading state for connections

#### User Experience Improvements:
- Clear two-step selection process
- Visual feedback with loading spinners
- Helpful placeholder text and hints
- Validation error messages
- Warning when supply chain has no connections
- Automatic reset of connection when supply chain changes

## API Integration

### New API Calls:
1. `supplyChainsApi.getSupplyChains()` - Loads all supply chains
2. `supplyChainsApi.getSupplyChainById()` - Loads connections for selected chain

### Existing API Calls:
- `ordersApi.getOrders()` - Loads orders for dropdown
- `vehiclesApi.getVehicles()` - Loads vehicles for dropdown
- `cargosApi.createCargo()` / `cargosApi.updateCargo()` - Submit form

## User Flow

### Creating New Cargo:
1. Fill in title, description, status
2. Select supply chain from dropdown
3. Wait for connections to load
4. Select connection route (shows as "Node A → Node B (150 km)")
5. Optionally select order and vehicle
6. Submit form

### Editing Existing Cargo:
1. Form opens with all fields pre-filled
2. Supply chain is automatically selected based on existing connection
3. Connections are loaded and current connection is pre-selected
4. User can change any field including supply chain/connection
5. Submit to update

## Technical Details

### Connection Display Format:
```typescript
{connection.start_node.title} → {connection.destination_node.title} ({connection.distance} km)
```

Example: `Warehouse Moscow → Distribution Center Berlin (2500 km)`

### Error Handling:
- Failed to load supply chains: Shows error toast
- Failed to load connections: Shows error toast and empty dropdown
- No connections available: Shows warning message
- Validation errors: Displayed below respective fields

## Benefits

1. **User-Friendly**: No need to manually copy/paste UUIDs
2. **Visual**: Clear representation of routes with node names and distances
3. **Safe**: Prevents invalid connection IDs
4. **Efficient**: Cascading dropdowns reduce cognitive load
5. **Smart**: Auto-detection of supply chain in edit mode
