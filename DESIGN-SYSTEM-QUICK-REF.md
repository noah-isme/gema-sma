# 🎨 GEMA DESIGN SYSTEM - QUICK REFERENCE

## Component Cheat Sheet

### 📦 Import
```tsx
import {
  AppHeader, AppSidebar, AdminTable, UserCard, 
  BadgeRole, FilterBar, AdminFormModal, FormInput, FormSelect
} from '@/components/design-system';
```

---

## 🎯 Component Usage

### 1. AppHeader
```tsx
<AppHeader 
  sectionTitle="Dashboard"
  showSearch={true}
  onMenuClick={() => setOpen(true)}
/>
```
**Features:** Logo, Search, Notifications, User Menu  
**Height:** `h-16` **Position:** `sticky top-0`

---

### 2. AppSidebar
```tsx
<AppSidebar
  collapsed={collapsed}
  onToggleCollapse={() => setCollapsed(!collapsed)}
  mobileOpen={open}
  onMobileClose={() => setOpen(false)}
/>
```
**Width:** `w-64` (expanded) / `w-20` (collapsed)  
**Features:** Grouped nav, Active indicator, Mobile drawer

---

### 3. AdminTable
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
    }
  ]}
  onSort={handleSort}
  zebra={true}
/>
```
**Features:** Sort, Hover, Zebra, Loading, Empty state

---

### 4. UserCard
```tsx
<UserCard
  name="Admin GEMA"
  email="admin@gema.com"
  role="admin"
  createdAt="2025-11-20"
  onEdit={() => handleEdit()}
  onDelete={() => handleDelete()}
/>
```
**Features:** Badge, Icons, Hover actions (desktop), Always visible (mobile)

---

### 5. BadgeRole
```tsx
<BadgeRole role="admin" size="md" />
```
**Roles:** `admin` `super_admin` `moderator` `teacher` `student`  
**Colors:** Blue, Orange, Purple, Green, Gray

---

### 6. FilterBar
```tsx
<FilterBar
  searchValue={search}
  onSearchChange={setSearch}
  filterValue={filter}
  onFilterChange={setFilter}
  filterOptions={[
    { value: 'all', label: 'All' },
    { value: 'admin', label: 'Admin' }
  ]}
  actionButton={{
    label: 'Add User',
    onClick: () => setShowForm(true)
  }}
/>
```
**Features:** Search, Filter dropdown, Action button

---

### 7. AdminFormModal
```tsx
<AdminFormModal
  isOpen={open}
  onClose={() => setOpen(false)}
  onSubmit={handleSubmit}
  title="Add Admin"
  submitLabel="Save"
  isSubmitting={loading}
>
  <FormInput ... />
  <FormSelect ... />
</AdminFormModal>
```
**Features:** Backdrop, Animation, Sticky footer, ESC close

---

### 8. FormInput
```tsx
<FormInput
  label="Email"
  name="email"
  type="email"
  value={data.email}
  onChange={handleChange}
  required
  error={errors.email}
  helperText="Optional help text"
/>
```
**Types:** `text` `email` `password` `number` `tel`

---

### 9. FormSelect
```tsx
<FormSelect
  label="Role"
  name="role"
  value={data.role}
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
| Type | Class | Usage |
|------|-------|-------|
| Primary | `blue-600` `blue-700` | Buttons, links, active |
| Success | `green-100` `green-700` | Teacher badge |
| Warning | `orange-100` `orange-700` | Super Admin badge |
| Danger | `red-50` `red-100` `red-600` | Delete, errors |
| Neutral | `gray-50` to `gray-900` | Text, borders, bg |

### Typography
| Level | Class | Usage |
|-------|-------|-------|
| Title | `text-3xl font-bold` | Page title |
| Heading | `text-lg font-semibold` | Section heading |
| Body | `text-sm` | Body text |
| Caption | `text-xs` | Helper text, labels |

### Spacing
| Size | Pixels | Usage |
|------|--------|-------|
| `p-1` | 4px | Minimal padding |
| `p-2` | 8px | Tight spacing |
| `p-3` | 12px | Button padding |
| `p-4` | 16px | Card padding |
| `p-6` | 24px | Section padding |
| `gap-2` | 8px | Icon-text gap |
| `gap-4` | 16px | Form field gap |

### Border Radius
| Class | Pixels | Usage |
|-------|--------|-------|
| `rounded-lg` | 8px | Buttons, inputs |
| `rounded-xl` | 12px | Cards, modals |
| `rounded-full` | 9999px | Badges, avatars |

### Shadows
| Class | Usage |
|-------|-------|
| `shadow-sm` | Header, subtle elevation |
| `shadow-md` | Card hover |
| `shadow-lg` | Modal, dropdown |
| `shadow-2xl` | Mobile drawer |

---

## 🏗️ Page Template

```tsx
"use client";

import { useState } from 'react';
import {
  AppHeader, AppSidebar, FilterBar, UserCard
} from '@/components/design-system';

export default function Page() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      
      <div className={`transition-all ${
        collapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <AppHeader
          sectionTitle="Page Title"
          onMenuClick={() => setMobileOpen(true)}
        />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Page Title
            </h1>
            <p className="text-gray-600 mt-1">
              Page description
            </p>
          </div>

          {/* Your content here */}
        </main>
      </div>
    </div>
  );
}
```

---

## ✅ Checklist for New Pages

- [ ] Import design system components
- [ ] Use AppHeader for top bar
- [ ] Use AppSidebar for navigation
- [ ] Apply `bg-gray-50` to main container
- [ ] Use `p-6 space-y-6` for content spacing
- [ ] Page title: `text-3xl font-bold`
- [ ] Description: `text-gray-600 mt-1`
- [ ] Use FilterBar for search/filter
- [ ] Use UserCard or AdminTable for data
- [ ] Use AdminFormModal for forms
- [ ] Use BadgeRole for role display
- [ ] Ensure mobile responsive
- [ ] Test collapsed sidebar
- [ ] Test mobile drawer

---

**Happy Building! 🚀**
