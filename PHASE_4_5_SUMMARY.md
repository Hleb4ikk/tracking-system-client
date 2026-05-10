# Phase 4.5: Company Management & Invitations

## ✅ Completed Features

### 1. Company Onboarding Flow
**Files Created:**
- `src/pages/company/CompanyOnboardingPage.tsx`
- `src/routes/CompanyRequiredRoute.tsx`
- `src/schemas/company.schemas.ts`
- `src/components/ui/LoadingOverlay.tsx`

**Features:**
- Three-mode onboarding interface:
  - **Select Mode**: Choose between creating company or joining with invitation
  - **Create Mode**: Form to create new company (title, description)
  - **Join Mode**: Form to accept invitation by ID
- Automatic user refresh after company creation/joining
- Redirect to dashboard after successful onboarding
- Protection: Users without company_id are redirected to `/onboarding`
- Consistent design with auth pages (gray background, white cards)
- Full dark mode support

**API Integration:**
- `POST /companies` - Create company
- `PATCH /invitations/:id/accept` - Accept invitation
- `GET /users/me` - Refresh user data

### 2. Invitations Management
**Files Created:**
- `src/pages/company/InvitationsPage.tsx`
- `src/schemas/invitation.schemas.ts`
- `src/api/invitations.api.ts` (updated)

**Features:**
- **List Invitations**: Display all company invitations with:
  - Recipient email
  - Role badge
  - Days until expiration
  - Invitation ID with copy button
  - Delete button
- **Create Invitation**: Modal form with:
  - Email input (validated)
  - Role selection (co-founder, logistician, expeditor, courier)
  - Expiration days (1-30, default 7)
- **Delete Invitation**: Confirmation dialog before deletion
- **Copy Invitation ID**: One-click copy to clipboard with visual feedback
- **Role-based Access**: Only co-founders and logisticians can manage invitations
- **Empty State**: Helpful message when no invitations exist
- **Loading States**: Spinners during data fetching and operations

**API Integration:**
- `GET /invitations` - List company invitations (with optional filters)
- `POST /invitations` - Create new invitation
- `DELETE /invitations/:id` - Delete invitation
- `PATCH /invitations/:id/accept` - Accept invitation (already implemented)

### 3. API Layer Updates
**Updated Files:**
- `src/api/invitations.api.ts`
- `src/api/company.api.ts`
- `src/api/index.ts`

**New API Methods:**
```typescript
// Invitations API
invitationsApi.getInvitations(query?: InvitationQuery): Promise<Invitation[]>
invitationsApi.createInvitation(data: CreateInvitationDto): Promise<CreateInvitationResponse>
invitationsApi.deleteInvitation(invitationId: string): Promise<DeleteInvitationResponse>
invitationsApi.acceptInvitation(invitationId: string): Promise<AcceptInvitationResponse>

// Company API (updated to match backend)
companyApi.getUserCompany(): Promise<{ company: Company }>
companyApi.createCompany(data: CreateCompanyDto): Promise<{ message: string; company: Company }>
companyApi.updateCompany(data: UpdateCompanyDto): Promise<{ message: string; updatedFields: Partial<Company> }>
companyApi.deleteCompany(): Promise<{ message: string }>
```

### 4. Validation Schemas
**Created:**
- `src/schemas/company.schemas.ts`:
  - `createCompanySchema` - Company creation validation
  - `acceptInvitationSchema` - Invitation ID validation
- `src/schemas/invitation.schemas.ts`:
  - `createInvitationSchema` - Invitation creation validation

### 5. Routing Updates
**Updated:** `src/routes/index.tsx`
- Added `/onboarding` route (protected by ProtectedRoute only)
- Added `/company/invitations` route → InvitationsPage
- Wrapped AppLayout with CompanyRequiredRoute
- All main app routes now require company membership

**Updated:** `src/constants/index.ts`
- Added `ROUTES.COMPANY_ONBOARDING = '/onboarding'`

### 6. UI Components
**Created:**
- `LoadingOverlay` - Full-screen loading indicator with message

**Used:**
- Button (with size="sm" and variant="danger")
- Badge (with variant="primary")
- Modal
- Card
- Input
- Spinner

## 🔄 User Flow

### New User Registration:
1. Register → Login
2. Auth check (App.tsx)
3. No company_id → Redirect to `/onboarding`
4. Choose: Create Company or Join with Invitation
5. After success → Redirect to `/dashboard`

### Invitation Management (Co-Founder/Logistician):
1. Navigate to `/company/invitations`
2. View all active invitations
3. Create new invitation:
   - Enter email
   - Select role
   - Set expiration (optional)
4. Copy invitation ID to share
5. Delete expired/unused invitations

### Accepting Invitation:
1. Receive invitation ID from team member
2. Go to `/onboarding`
3. Choose "Join with Invitation"
4. Enter invitation ID
5. Accept → Join company → Redirect to dashboard

## 🎨 Design Consistency
- Gray background (`bg-gray-50 dark:bg-gray-900`) matching auth pages
- White cards for content
- Blue primary color for actions
- Purple accent for invitation-related actions
- Full dark mode support
- Responsive design (mobile-friendly)

## 🔐 Security & Permissions
- **Company Creation**: Any authenticated user without company
- **Invitation Management**: Only co-founders and logisticians
- **Invitation Acceptance**: Any authenticated user without company
- **Main App Access**: Requires company membership

## 📊 Backend Endpoints Used
```
POST   /companies                    - Create company
GET    /companies                    - Get user's company
PATCH  /companies                    - Update company
DELETE /companies                    - Delete company

GET    /invitations                  - List invitations (with filters)
POST   /invitations                  - Create invitation
DELETE /invitations/:id              - Delete invitation
PATCH  /invitations/:id/accept       - Accept invitation

GET    /users/me                     - Get current user
```

## 🚀 Next Steps
- Phase 5: Orders Management (CRUD)
- Phase 6: Cargos Management (CRUD)
- Phase 11: Complete company management (team members, settings)

## 📝 Notes
- Invitation IDs are UUIDs that need to be shared manually (copy/paste)
- Invitations auto-expire based on `days_to_delete` field
- Backend has a cron job that decrements `days_to_delete` daily
- Users can only be in one company at a time
- Company title must be unique across the system

---

**Date:** May 10, 2026  
**Status:** ✅ Complete  
**Next Phase:** Phase 5 - Orders Management
