# Danh Sách Files Cần Sửa/Tạo Mới

## 🔧 Files Cần Sửa Đổi (Từ Template)

### 1. Authentication & Layout
- `src/app/layout.tsx` - Thay ClerkProvider bằng AuthProvider custom
- `src/components/layout/app-sidebar.tsx` - Update navigation items
- `src/components/layout/user-nav.tsx` - Custom user menu với logout
- `src/app/globals.css` - Giữ nguyên styling

### 2. Dashboard & Routes
- `src/app/dashboard/layout.tsx` - Protected route wrapper
- `src/app/dashboard/page.tsx` - Dashboard overview
- `src/app/dashboard/overview/@*` - Dashboard widgets (sửa data source)

### 3. Product → Sample Migration
- `src/app/dashboard/product/` → `src/app/dashboard/samples/`
- `src/features/products/` → `src/features/samples/`
- `src/constants/data.ts` - Remove mock data, add API types

### 4. User Management (Giữ cấu trúc, sửa data)
- `src/features/auth/components/user-auth-form.tsx`
- `src/features/auth/components/sign-in-view.tsx`

## 🆕 Files Cần Tạo Mới

### 1. API Integration
```
src/lib/
├── api-client.ts              # Axios client with auth
├── auth.ts                    # Auth utilities
├── permissions.ts             # Permission checking
└── storage.ts                 # Token storage

src/types/
├── api.ts                     # API response types
├── auth.ts                    # Auth types
├── sample.ts                  # Sample types
└── user.ts                    # User types
```

### 2. Authentication System
```
src/providers/
├── auth-provider.tsx          # Auth context provider
└── query-provider.tsx        # React Query provider

src/hooks/
├── use-auth.ts               # Auth hook
├── use-api.ts                # API hooks
├── use-samples.ts            # Sample data hooks
└── use-permissions.ts        # Permission hooks

src/components/auth/
├── login-form.tsx            # Custom login form
├── protected-route.tsx       # Route protection
└── permission-guard.tsx      # Permission checking
```

### 3. Sample Management (Thay thế Product)
```
src/app/dashboard/samples/
├── page.tsx                  # Sample list page
├── [sampleId]/
│   └── page.tsx             # Sample detail page
└── new/
    └── page.tsx             # Create sample page

src/features/samples/
├── components/
│   ├── sample-listing.tsx    # Sample table
│   ├── sample-form.tsx       # Create/Edit form
│   ├── sample-filters.tsx    # Advanced filters
│   └── sample-tables/
│       ├── columns.tsx       # Table columns
│       ├── cell-action.tsx   # Row actions
│       └── index.tsx         # Table component
└── hooks/
    ├── use-samples.ts        # Sample data hooks
    └── use-sample-filters.ts # Filter hooks
```

### 4. Public Homepage
```
src/app/
├── page.tsx                  # Public homepage
└── (public)/
    ├── layout.tsx           # Public layout
    └── about/
        └── page.tsx         # About page

src/components/public/
├── hero-section.tsx         # Homepage hero
├── product-showcase.tsx     # Sample showcase
└── public-header.tsx        # Public navigation
```

### 5. User & Category Management
```
src/app/dashboard/users/
├── page.tsx                 # User list
├── [userId]/
│   └── page.tsx            # User detail
└── new/
    └── page.tsx            # Create user

src/app/dashboard/categories/
├── page.tsx                # Category list
└── new/
    └── page.tsx           # Create category

src/features/users/
└── components/
    ├── user-listing.tsx    # User table
    ├── user-form.tsx       # User form
    └── role-assignment.tsx # Role management

src/features/categories/
└── components/
    ├── category-listing.tsx # Category table
    └── category-form.tsx    # Category form
```

### 6. Configuration Files
```
next.config.js               # Next.js config
tailwind.config.js          # Tailwind config (có sẵn)
components.json             # ShadCN config (có sẵn)
.env.local                  # Environment variables
.env.example                # Environment template
```

## 📊 Data Flow Architecture

### 1. Authentication Flow
```
Login Form → API Call → JWT Token → Store in Cookie → Redirect to Dashboard
```

### 2. API Integration Pattern
```
Component → Custom Hook → API Client → Go Server → Database
```

### 3. Permission Checking
```
Route Access → Permission Guard → API Permission Check → Component Rendering
```

## 🛠️ Implementation Order

### Phase 1: Core Setup
1. Setup project structure
2. Install dependencies
3. Configure API client
4. Create auth system

### Phase 2: Authentication
1. Custom auth provider
2. Login/logout functionality
3. Protected routes
4. Permission system

### Phase 3: Sample Management
1. Convert product to sample
2. API integration
3. CRUD operations
4. Advanced filtering

### Phase 4: User Management
1. User listing
2. Role management
3. Permission assignment

### Phase 5: Polish & Features
1. Public homepage
2. Error handling
3. Loading states
4. Responsive design

## 🔍 Key Template Modifications

### Remove Clerk Dependencies
- Remove `@clerk/nextjs` package
- Replace `ClerkProvider` with custom `AuthProvider`
- Update `middleware.ts` for custom auth

### Update Navigation
- Modify sidebar navigation items
- Add permission-based menu visibility
- Update user dropdown menu

### Data Integration
- Replace mock data with API calls
- Add loading states
- Implement error handling

### Styling Consistency
- Keep existing dark/light theme
- Maintain ShadCN UI components
- Preserve responsive design