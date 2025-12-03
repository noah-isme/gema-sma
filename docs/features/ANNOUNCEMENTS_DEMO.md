# 🐛 Announcement Admin - Debugging Guide

## ❌ Error: "Gagal menyimpan pengumuman"

### Issue Location:
```
src/features/admin/announcements/AnnouncementManager.tsx (line 103)
```

### Root Causes:

#### 1. **Missing Required Fields**
The Announcement model has required fields that must be provided:
- `title` ✅ Required
- `content` ✅ Required  
- `category` ✅ Required (ENUM: KELAS, EVENT, TUGAS, NILAI, SISTEM)

#### 2. **Invalid Category Value**
Category must be one of the enum values. If you send anything else, Prisma will reject it.

#### 3. **Authentication Issues**
API requires authentication. Make sure you're logged in as admin.

---

## ✅ Fixes Applied:

### 1. **Added Logging** ✅
```typescript
console.log('POST /api/admin/announcements - Received data:', JSON.stringify(body, null, 2));
```

Now you can see what data is being sent in the server logs.

### 2. **Category Validation** ✅
```typescript
const validCategories = ['KELAS', 'EVENT', 'TUGAS', 'NILAI', 'SISTEM'];
const finalCategory = category && validCategories.includes(category) 
  ? category 
  : 'SISTEM';
```

Invalid categories are automatically converted to 'SISTEM'.

### 3. **Better Error Messages** ✅
```typescript
return NextResponse.json(
  { error: 'Failed to create announcement', details: error.message },
  { status: 500 }
);
```

Now errors include details about what went wrong.

### 4. **Null Handling for Optional Fields** ✅
```typescript
if (updateData.excerpt === '') updateData.excerpt = null;
if (updateData.link === '') updateData.link = null;
```

Empty strings are converted to null for optional fields.

---

## 🧪 How to Test:

### 1. **Check Server Logs**
Open terminal where dev server is running and watch for logs:
```bash
npm run dev
# Then try to create/edit announcement
# Look for console.log output
```

### 2. **Test with Browser Console**
Open browser console (F12) and check for errors:
```javascript
// Should see any fetch errors here
```

### 3. **Manual API Test**
Test API directly with curl:
```bash
# You need to be authenticated first
# Login to /admin, then get session cookie

curl -X POST http://localhost:3000/api/admin/announcements \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Announcement",
    "content": "Test content",
    "category": "SISTEM",
    "type": "info",
    "isImportant": false,
    "isActive": true
  }'
```

---

## 🔍 Common Issues & Solutions:

### Issue 1: "Unauthorized" (401)
**Cause**: Not logged in or session expired  
**Solution**: 
```bash
1. Go to /admin
2. Login with admin credentials
3. Try again
```

### Issue 2: "Category is required" (400)
**Cause**: Missing category field  
**Solution**: 
- Make sure category dropdown is filled
- Default should be "SISTEM"
- Check form data before submit

### Issue 3: "Failed to create announcement" (500)
**Cause**: Database error (usually validation)  
**Solution**:
```bash
1. Check server logs for details
2. Verify all required fields are present
3. Check if category is valid enum value
4. Ensure deadline is valid date format
```

### Issue 4: Empty strings causing issues
**Cause**: Optional fields sent as empty strings instead of null  
**Solution**: ✅ Fixed - API now converts empty strings to null

---

## 📝 Form Field Requirements:

### Required Fields:
- ✅ **Title** - Must not be empty
- ✅ **Content** - Must not be empty
- ✅ **Category** - Must be one of: KELAS, EVENT, TUGAS, NILAI, SISTEM

### Optional Fields:
- **Excerpt** - Short description (can be null)
- **Type** - Default: "info"
- **Important** - Boolean (default: false)
- **Active** - Boolean (default: true)
- **Show on Homepage** - Boolean (default: false)
- **Deadline** - Date (can be null)
- **Link** - URL (can be null)

---

## 🐛 Debugging Steps:

### Step 1: Check Form Data
Add console.log in `AnnouncementManager.tsx`:
```typescript
const handleSubmit = async (event) => {
  event.preventDefault();
  console.log('Form data being sent:', formData); // Add this
  // ...rest of code
}
```

### Step 2: Check API Response
Look at the actual error response:
```typescript
if (!response.ok) {
  const errorData = await response.json();
  console.error('API Error:', errorData); // Add this
  throw new Error('Gagal menyimpan pengumuman');
}
```

### Step 3: Check Server Logs
Watch the terminal where `npm run dev` is running for:
```
POST /api/admin/announcements - Received data: {
  "title": "...",
  "category": "...",
  ...
}
```

### Step 4: Check Database
Query the database directly:
```sql
SELECT * FROM announcements ORDER BY "createdAt" DESC LIMIT 5;
```

---

## ✅ Verification Checklist:

After fixes, verify:
- [ ] Can create new announcement
- [ ] Can edit existing announcement
- [ ] Category dropdown works
- [ ] Optional fields (excerpt, link, deadline) work
- [ ] Important checkbox works
- [ ] Active checkbox works
- [ ] Show on Homepage checkbox works
- [ ] Form resets after save
- [ ] Toast notification shows
- [ ] Announcement list updates
- [ ] No console errors

---

## 🚀 Quick Fix Commands:

```bash
# 1. Restart dev server
pkill -f "next dev"
npm run dev

# 2. Check if API is accessible
curl http://localhost:3000/api/admin/announcements

# 3. Test database connection
npx prisma db push

# 4. Regenerate Prisma client
npx prisma generate
```

---

## 📊 Expected Behavior:

### When Creating:
1. Fill form with required fields
2. Click "Tambahkan"
3. See loading state
4. See success toast
5. Form resets
6. New announcement appears in list

### When Editing:
1. Click edit on announcement
2. Form fills with existing data
3. Modify fields
4. Click "Simpan Perubahan"
5. See loading state
6. See success toast
7. Form resets
8. Updated announcement shows in list

---

## 🔧 Emergency Fixes:

### If form keeps failing:
```bash
# Option 1: Clear form and try again
# Click "Batal" then "Tambah Pengumuman" again

# Option 2: Refresh page
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Option 3: Clear browser cache
# Settings > Clear browsing data > Cached images and files

# Option 4: Use different browser
# Try Chrome, Firefox, or Edge
```

### If API keeps failing:
```bash
# Restart everything
pkill -f "next dev"
rm -rf .next
npm run dev
```

---

## 📞 Additional Help:

### Check These Files:
1. `src/app/api/admin/announcements/route.ts` - API logic
2. `src/features/admin/announcements/AnnouncementManager.tsx` - Form handler
3. `src/features/admin/announcements/components/AnnouncementForm.tsx` - Form UI
4. `prisma/schema.prisma` - Database schema

### Useful Logs:
```bash
# Watch server logs
npm run dev | grep "POST\|PATCH\|Error"

# Check Prisma logs
export DEBUG="prisma:*"
npm run dev
```

---

## ✨ Summary:

**Problem**: "Gagal menyimpan pengumuman" error  
**Cause**: Usually validation or missing required fields  
**Fixes Applied**:
- ✅ Added detailed logging
- ✅ Category validation
- ✅ Better error messages
- ✅ Null handling for optional fields
- ✅ Improved error details

**Status**: 🟢 Fixed and improved  
**Next Step**: Test creating/editing announcements

---

Last Updated: 2025-11-16
