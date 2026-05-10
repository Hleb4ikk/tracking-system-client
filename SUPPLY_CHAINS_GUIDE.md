# Supply Chains Feature Guide

## 📋 Overview

The Supply Chains feature allows you to create and manage complex supply chain networks by connecting multiple supply nodes with distance information. This creates a directed graph structure that represents your logistics network.

## 🎯 Key Features

### ✅ Implemented Features

1. **List Supply Chains**
   - View all supply chains with pagination
   - Filter by title
   - Search functionality
   - Responsive card layout

2. **Create Supply Chain**
   - Basic information (title, description)
   - Add multiple node connections
   - Define distances between nodes
   - Validation for duplicate connections
   - Real-time supply node loading

3. **View Supply Chain Details**
   - Visual graph representation
   - Hierarchical node display
   - Distance information
   - Cycle detection
   - Metadata display

4. **Edit Supply Chain**
   - Update basic information
   - Modify node connections
   - Add/remove connections
   - Preserves existing data

5. **Delete Supply Chain**
   - Confirmation dialog
   - Cascade deletion of connections
   - Error handling

## 🔐 Access Control

### Role-Based Permissions

| Action | Co-Founder | Logistician | Expeditor | Courier |
|--------|-----------|-------------|-----------|---------|
| View   | ✅        | ✅          | ❌        | ❌      |
| Create | ✅        | ✅          | ❌        | ❌      |
| Edit   | ✅        | ✅          | ❌        | ❌      |
| Delete | ✅        | ✅          | ❌        | ❌      |

## 📱 User Interface

### Supply Chains List Page

**Location:** `/supply-chains`

**Features:**
- Grid layout with cards
- Filter panel (title search)
- Pagination controls
- Quick actions (View, Delete)
- Empty state with call-to-action

**Navigation:**
- Accessible from sidebar menu
- Breadcrumb navigation
- Direct URL access

### Create/Edit Form

**Fields:**
- **Title*** (required) - Name of the supply chain
- **Description** (optional) - Detailed description
- **Supply Node Connections** (optional) - List of connections

**Connection Fields:**
- **From Node*** - Starting supply node
- **To Node*** - Destination supply node
- **Distance (km)*** - Distance between nodes

**Validation:**
- Title: 1-255 characters
- Description: max 1000 characters
- Distance: positive number
- Node IDs: valid UUIDs
- No duplicate connections

### Details View

**Sections:**
1. **Header** - Title and description
2. **Supply Chain Network** - Visual graph representation
3. **Information** - Chain ID and Company ID

**Graph Visualization:**
- Hierarchical tree structure
- Node cards with location info
- Distance badges between nodes
- Cycle detection warnings
- Empty state for chains without connections

## 🔄 Data Flow

### Creating a Supply Chain

```
User Input → Form Validation → API Request → Backend Processing → Database Insert → Response → UI Update
```

1. User fills form with title, description, and connections
2. React Hook Form validates input using Zod schema
3. API call to `POST /supply-chains`
4. Backend creates supply chain and connections in transaction
5. Backend builds graph structure
6. Response includes created chain with graph
7. UI shows success message and refreshes list

### Viewing Supply Chain Details

```
User Click → API Request → Backend Query → Graph Construction → Response → UI Render
```

1. User clicks on supply chain card
2. API call to `GET /supply-chains/:id`
3. Backend fetches chain with all connections
4. Backend constructs SupplyGraph from connections
5. Response includes chain with graph structure
6. UI renders hierarchical graph visualization

### Updating Supply Chain

```
User Edit → Form Pre-fill → User Changes → Validation → API Request → Backend Update → Response → UI Update
```

1. User clicks edit button
2. Form pre-fills with existing data (including extracted connections from graph)
3. User modifies fields
4. Validation on submit
5. API call to `PATCH /supply-chains/:id`
6. Backend updates in transaction (deletes old connections, inserts new ones)
7. Response includes updated fields
8. UI shows success and refreshes

## 🏗️ Technical Architecture

### Frontend Structure

```
src/
├── api/
│   └── supply-chains.api.ts          # API client functions
├── components/
│   └── features/
│       └── supply-chains/
│           ├── SupplyChainDetails.tsx # Details view component
│           ├── SupplyChainForm.tsx    # Create/Edit form
│           └── index.ts               # Exports
├── pages/
│   └── supply-chains/
│       ├── SupplyChainsListPage.tsx   # Main list page
│       └── index.ts                   # Exports
├── schemas/
│   └── supply-chain.schemas.ts        # Zod validation schemas
└── types/
    └── supply-chain.types.ts          # TypeScript types
```

### Backend Structure

```
src/
├── modules/
│   └── supply-chain/
│       ├── supply-chain.controller.ts  # REST endpoints
│       ├── supply-chain.service.ts     # Business logic
│       ├── supply-chain.repository.ts  # Database queries
│       └── supply-chain.module.ts      # NestJS module
├── classes/
│   └── SupplyChainGraph.ts            # Graph data structure
├── schemas/
│   └── supplyChainSchemas.ts          # Zod schemas
├── types/
│   └── SupplyChain.ts                 # TypeScript types
└── interfaces/
    └── ISupplyChainRepository.ts      # Repository interface
```

### Database Schema

**supply_chains table:**
```sql
- id: UUID (PK)
- title: VARCHAR
- description: VARCHAR (nullable)
- company_id: UUID (FK → companies)
```

**supply_node_connections table:**
```sql
- id: UUID (PK)
- start_node_id: UUID (FK → supply_nodes)
- destination_node_id: UUID (FK → supply_nodes)
- supply_chain_id: UUID (FK → supply_chains)
- distance: DECIMAL
- UNIQUE(start_node_id, destination_node_id, supply_chain_id)
```

## 🎨 UX Highlights

### Visual Design

1. **Consistent Styling**
   - Matches existing design system
   - Dark mode support
   - Responsive layout

2. **Interactive Elements**
   - Hover effects on cards
   - Loading states
   - Disabled states
   - Error messages

3. **Graph Visualization**
   - Clear hierarchy
   - Visual connections with arrows
   - Distance badges
   - Cycle warnings
   - Empty states

### User Feedback

1. **Success Messages**
   - "Supply chain successfully created!"
   - "Supply chain was updated successfully!"
   - "Supply chain successfully deleted!"

2. **Error Handling**
   - Network errors
   - Validation errors
   - Not found errors
   - Permission errors

3. **Loading States**
   - Spinner during data fetch
   - Button loading states
   - Disabled inputs during submission

### Accessibility

1. **Keyboard Navigation**
   - Tab through form fields
   - Enter to submit
   - Escape to close drawer

2. **Screen Reader Support**
   - Semantic HTML
   - ARIA labels
   - Descriptive text

3. **Visual Indicators**
   - Focus states
   - Error states
   - Required field markers

## 🔧 Configuration

### Environment Variables

No additional environment variables required. Uses existing:
- `VITE_API_URL` - Backend API URL

### Dependencies

**Frontend:**
- `react-hook-form` - Form management
- `@hookform/resolvers` - Zod integration
- `zod` - Schema validation
- `lucide-react` - Icons

**Backend:**
- `@nestjs/common` - NestJS framework
- `zod` - Schema validation
- `pg` - PostgreSQL client
- `flatted` - Circular JSON serialization

## 📊 API Endpoints

### GET /supply-chains
Get list of supply chains with pagination and filters.

**Query Parameters:**
- `page` (number, default: 1)
- `title` (string, optional)
- `companyId` (UUID, optional)

**Response:** `SupplyChain[]`

### GET /supply-chains/:id
Get supply chain details with graph structure.

**Response:** `SupplyChainWithGraph`

### POST /supply-chains
Create new supply chain.

**Body:** `CreateSupplyChainDto`

**Response:** 
```json
{
  "message": "Supply chain successfully created!",
  "supplyChain": SupplyChainWithGraph
}
```

### PATCH /supply-chains/:id
Update supply chain.

**Body:** `UpdateSupplyChainDto`

**Response:**
```json
{
  "message": "Supply chain was updated successfully!",
  "updatedFields": Partial<SupplyChainWithGraph>
}
```

### DELETE /supply-chains/:id
Delete supply chain.

**Response:**
```json
{
  "message": "Supply chain successfully deleted!"
}
```

## 🐛 Known Limitations

1. **Graph Visualization**
   - Only shows tree structure (first path)
   - Cycles are detected but not fully visualized
   - No interactive graph manipulation

2. **Performance**
   - Large graphs (100+ nodes) may be slow to render
   - No pagination for connections in form

3. **Validation**
   - No check if nodes belong to same company
   - No validation of graph connectivity
   - No distance unit conversion

## 🚀 Future Enhancements

1. **Advanced Graph Features**
   - Interactive graph editor
   - Drag-and-drop node positioning
   - Zoom and pan controls
   - Multiple path visualization

2. **Analytics**
   - Total chain distance
   - Number of nodes
   - Average distance between nodes
   - Bottleneck detection

3. **Import/Export**
   - Export graph as JSON
   - Import from CSV
   - Visual export (PNG/SVG)

4. **Optimization**
   - Shortest path calculation
   - Route optimization
   - Cost analysis

5. **Collaboration**
   - Share chains with other companies
   - Version history
   - Comments and notes

## 📝 Usage Examples

### Example 1: Simple Linear Chain

```
Warehouse A → Distribution Center B (150 km) → Store C (75 km)
```

**Steps:**
1. Create supply chain "East Coast Distribution"
2. Add connection: Warehouse A → Distribution Center B, 150 km
3. Add connection: Distribution Center B → Store C, 75 km
4. Save

### Example 2: Hub-and-Spoke Network

```
Central Hub
├→ Regional Hub 1 (200 km)
│  ├→ Store A (50 km)
│  └→ Store B (60 km)
└→ Regional Hub 2 (250 km)
   ├→ Store C (40 km)
   └→ Store D (55 km)
```

**Steps:**
1. Create supply chain "National Distribution Network"
2. Add connections from Central Hub to Regional Hubs
3. Add connections from Regional Hubs to Stores
4. Save

## 🆘 Troubleshooting

### Issue: "You need at least 2 supply nodes to create connections"

**Solution:** Create supply nodes first at `/supply-nodes` before creating supply chains.

### Issue: "Duplicate connection in request"

**Solution:** Remove duplicate connections in the form. Each connection must be unique.

### Issue: "Supply chain wasn't found"

**Solution:** Ensure you have access to the supply chain and it belongs to your company.

### Issue: Graph not displaying

**Solution:** Check that connections are properly saved. Try refreshing the page.

## 📚 Related Documentation

- [Supply Nodes Guide](./SUPPLY_NODES_GUIDE.md)
- [Orders Guide](./ORDERS_GUIDE.md)
- [Cargos Guide](./CARGOS_GUIDE.md)
- [API Documentation](../tracking-system-server/README.md)

---

**Last Updated:** May 10, 2026
**Version:** 1.0.0
