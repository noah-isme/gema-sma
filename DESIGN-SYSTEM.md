# 🎨 GEMA Admin Design System

## Enterprise-Grade Reusable Component Library

Sistem desain modular yang konsisten, scalable, dan mudah digunakan untuk GEMA Admin Dashboard.

---

## 📦 Component Structure

```
design-system/
├── layout/
│   ├── AppHeader.tsx          # Top navigation bar
│   └── AppSidebar.tsx         # Sidebar navigation
├── data-display/
│   ├── AdminTable.tsx         # Premium table component
│   ├── UserCard.tsx           # Card-based user display
│   ├── BadgeRole.tsx          # Role badges
│   └── FilterBar.tsx          # Search & filter bar
├── forms/
│   ├── AdminFormModal.tsx     # Modal form container
│   ├── FormInput.tsx          # Text input field
│   └── FormSelect.tsx         # Dropdown select
└── index.ts                   # Central exports
```

---

## 🎯 1. LAYOUT COMPONENTS

### AppHeader

**Purpose:** Sticky top navigation dengan branding, search, dan user menu.

**Props:**
```typescript
interface AppHeaderProps {
  sectionTitle?: string;      // Page title
  showSearch?: boolean;        // Toggle search bar
  onMenuClick?: () => void;    // Mobile menu handler
}
```

**Usage:**
```tsx
<AppHeader 
  sectionTitle="Dashboard" 
  showSearch={true}
  onMenuClick={() => setMobileMenuOpen(true)}
/>
```

**Features:**
- ✅ GEMA Mini Logo
- ✅ Global Search Bar (desktop)
- ✅ Notification Bell with badge
- ✅ User Avatar Dropdown (Profile, Settings, Logout)
- ✅ Responsive (mobile center title)
- ✅ Sticky positioning with shadow

**Tailwind Classes:**
```
h-16 px-6 bg-white border-b shadow-sm sticky top-0 z-30
```

---

### AppSidebar

**Purpose:** Grouped navigation dengan collapsible feature.

**Props:**
```typescript
interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}
```

**Usage:**
```tsx
<AppSidebar
  collapsed={sidebarCollapsed}
  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
  mobileOpen={mobileMenuOpen}
  onMobileClose={() => setMobileMenuOpen(false)}
/>
```

**Features:**
- ✅ 5 Section Groups (Dashboard, Pembelajaran, Komunitas, Pengguna, Sistem)
- ✅ Active indicator (4px left bar + bg-blue-50)
- ✅ Collapsible (w-64 → w-20)
- ✅ Mobile drawer with spring animation
- ✅ Section headers (uppercase, tracking-wider)

**Tailwind Classes:**
```
w-64 bg-white border-r h-screen flex flex-col
```

---

## 📊 2. DATA DISPLAY COMPONENTS

### AdminTable

**Purpose:** Premium table dengan sorting, hover, dan zebra stripes.

**Props:**
```typescript
interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
  zebra?: boolean;
}
```

**Usage:**
```tsx
<AdminTable
  data={users}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Role', 
      render: (user) => <BadgeRole role={user.role} />
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'right',
      render: (user) => <ActionButtons user={user} />
    }
  ]}
  onSort={handleSort}
  zebra={true}
/>
```

**Features:**
- ✅ Sticky header
- ✅ Sortable columns
- ✅ Hover row highlight
- ✅ Zebra stripes (subtle)
- ✅ Loading skeleton
- ✅ Empty state
- ✅ Custom cell rendering

**Header Style:**
```
bg-gray-50 text-xs font-semibold uppercase tracking-wider
```

**Row Style:**
```
hover:bg-gray-50 border-b border-gray-100
```

---

### UserCard

**Purpose:** Card-based user display untuk mobile & desktop alternatif.

**Props:**
```typescript
interface UserCardProps {
  name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'moderator' | 'teacher' | 'student';
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

**Usage:**
```tsx
<UserCard
  name="Admin GEMA"
  email="admin@gema.com"
  role="admin"
  createdAt="2025-11-20"
  onEdit={() => handleEdit(user)}
  onDelete={() => handleDelete(user.id)}
/>
```

**Features:**
- ✅ Role badge dengan warna
- ✅ Email & created date dengan icons
- ✅ Hover actions (desktop: opacity 0→100)
- ✅ Mobile actions (always visible)
- ✅ Shadow elevation on hover

**Tailwind Classes:**
```
rounded-xl border p-6 hover:shadow-md hover:border-gray-300
```

---

### BadgeRole

**Purpose:** Consistent role badges dengan color system.

**Props:**
```typescript
interface BadgeRoleProps {
  role: 'admin' | 'super_admin' | 'moderator' | 'teacher' | 'student';
  size?: 'sm' | 'md';
}
```

**Usage:**
```tsx
<BadgeRole role="admin" size="md" />
```

**Color System:**
- **Admin:** `bg-blue-100 text-blue-700`
- **Super Admin:** `bg-orange-100 text-orange-700`
- **Moderator:** `bg-purple-100 text-purple-700`
- **Teacher:** `bg-green-100 text-green-700`
- **Student:** `bg-gray-100 text-gray-700`

---

### FilterBar

**Purpose:** Search & filter dengan action button.

**Props:**
```typescript
interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: Array<{ value: string; label: string }>;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}
```

**Usage:**
```tsx
<FilterBar
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search admin by name..."
  filterValue={roleFilter}
  onFilterChange={setRoleFilter}
  filterOptions={[
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' }
  ]}
  actionButton={{
    label: 'Tambah Admin',
    onClick: () => setShowForm(true)
  }}
/>
```

**Features:**
- ✅ Search input dengan icon
- ✅ Filter dropdown
- ✅ Action button (primary CTA)
- ✅ Responsive (stack on mobile)

---

## 📝 3. FORM COMPONENTS

### AdminFormModal

**Purpose:** Modal container untuk forms dengan sticky footer.

**Props:**
```typescript
interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  title: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  children: ReactNode;
}
```

**Usage:**
```tsx
<AdminFormModal
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  onSubmit={handleSubmit}
  title="Tambah Admin Baru"
  submitLabel="Simpan"
  isSubmitting={isSubmitting}
>
  <FormInput label="Full Name" name="name" {...} />
  <FormInput label="Email" name="email" type="email" {...} />
  <FormSelect label="Role" name="role" options={roleOptions} {...} />
</AdminFormModal>
```

**Features:**
- ✅ Center modal with backdrop
- ✅ Smooth enter/exit animations
- ✅ Scrollable content area
- ✅ Sticky footer with actions
- ✅ ESC to close
- ✅ Loading state

---

### FormInput

**Purpose:** Styled text input dengan validation.

**Props:**
```typescript
interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}
```

**Usage:**
```tsx
<FormInput
  label="Email Address"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="admin@example.com"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>
```

**Features:**
- ✅ Label with required indicator
- ✅ Validation error display
- ✅ Helper text
- ✅ Disabled state
- ✅ Focus ring

---

### FormSelect

**Purpose:** Styled dropdown dengan validation.

**Props:**
```typescript
interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}
```

**Usage:**
```tsx
<FormSelect
  label="Role"
  name="role"
  value={formData.role}
  onChange={handleChange}
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' }
  ]}
  required
/>
```

---

## 🎨 Design Tokens

### Colors
```css
Primary:   blue-600, blue-700
Success:   green-100, green-700
Warning:   orange-100, orange-700
Danger:    red-50, red-100, red-600, red-700
Neutral:   gray-50, gray-100, gray-200, gray-600, gray-900
```

### Typography
```css
Title:     text-3xl font-bold
Heading:   text-lg font-semibold
Body:      text-sm
Caption:   text-xs
```

### Spacing
```css
Base: 4px (p-1 to p-6)
Gap:  gap-2, gap-3, gap-4, gap-6
```

### Borders
```css
Radius:  rounded-lg (8px), rounded-xl (12px)
Width:   border (1px)
```

### Shadows
```css
sm:   shadow-sm     (subtle elevation)
md:   shadow-md     (card hover)
lg:   shadow-lg     (modal/dropdown)
```

---

## 🚀 Usage Example

**Complete Page Implementation:**

```tsx
"use client";

import { useState } from 'react';
import {
  AppHeader,
  AppSidebar,
  FilterBar,
  UserCard,
  AdminFormModal,
  FormInput,
  FormSelect
} from '@/components/design-system';

export default function AdminUsersPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      
      <div className={`transition-all ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <AppHeader
          sectionTitle="Kelola Admin"
          onMenuClick={() => setMobileOpen(true)}
        />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Admin</h1>
            <p className="text-gray-600 mt-1">Atur akses administrator sistem</p>
          </div>

          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            filterValue={roleFilter}
            onFilterChange={setRoleFilter}
            filterOptions={[
              { value: 'all', label: 'All Roles' },
              { value: 'admin', label: 'Admin' }
            ]}
            actionButton={{
              label: 'Tambah Admin',
              onClick: () => setShowForm(true)
            }}
          />

          <div className="space-y-4">
            {users.map(user => (
              <UserCard key={user.id} {...user} />
            ))}
          </div>

          <AdminFormModal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmit}
            title="Tambah Admin"
          >
            <FormInput label="Name" name="name" {...} />
            <FormInput label="Email" name="email" {...} />
            <FormSelect label="Role" name="role" {...} />
          </AdminFormModal>
        </main>
      </div>
    </div>
  );
}
```

---

## ✅ Benefits

### For Developers:
- 🎯 **Drag & Drop** - Import dan gunakan langsung
- 🔄 **Consistent** - Semua halaman terasa satu kesatuan
- 📦 **Modular** - Tidak perlu redesign per halaman
- 🚀 **Fast** - Hemat waktu development

### For Users:
- 💎 **Premium Feel** - Enterprise-grade design
- 🎨 **Polished** - Attention to detail
- 📱 **Responsive** - Mobile-first approach
- ♿ **Accessible** - ARIA labels, focus states

---

## 📚 Import Path

```tsx
import {
  AppHeader,
  AppSidebar,
  AdminTable,
  UserCard,
  BadgeRole,
  FilterBar,
  AdminFormModal,
  FormInput,
  FormSelect
} from '@/components/design-system';
```

---

**STATUS: ✅ DESIGN SYSTEM COMPLETE & READY TO USE**

Semua komponen sudah production-ready, fully typed dengan TypeScript, dan mengikuti best practices React & Tailwind CSS! 🎉
