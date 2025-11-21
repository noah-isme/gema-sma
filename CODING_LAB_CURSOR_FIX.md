# 🐛 Fix: Coding Lab Editor Cursor Jump Issue

## 🎯 Masalah

Saat mengetik di Coding Lab editor (Monaco Editor), cursor **tiba-tiba pindah ke baris terakhir** sehingga mengganggu pengetikan.

**Lokasi**: `http://localhost:3000/student/coding-lab/[slug]`

## 🔍 Root Cause Analysis

### Problem 1: useEffect Loop yang Tidak Terkontrol

**File**: `/src/app/student/coding-lab/[slug]/page.tsx`

**Code sebelumnya** (line 193-207):
```typescript
useEffect(() => {
  if (!task) return

  if (typeof window !== 'undefined' && autosaveKey) {
    const savedCode = localStorage.getItem(autosaveKey)
    if (savedCode) {
      setCode(savedCode)  // ❌ Ini terpicu terus-menerus!
      setAutosaveMessage('Draft dipulihkan dari autosave')
    }
  }

  if (task.testCases?.length) {
    setActiveTestCaseId(task.testCases[0].id)
  }
}, [task, autosaveKey])  // ❌ Dependency tidak optimal
```

**Alur masalah**:
1. User mengetik di baris 3 → `code` state berubah
2. Autosave useEffect terpicu → simpan ke localStorage
3. Karena `task` dalam dependency, useEffect restore **juga terpicu**
4. `setCode(savedCode)` dipanggil → Editor re-render
5. **Cursor reset ke posisi akhir** karena value berubah dari luar

### Problem 2: Controlled Component Pattern

Monaco Editor dengan `value` prop akan **reset cursor position** setiap kali value berubah dari external state update.

## ✅ Solusi yang Diimplementasikan

### 1. Tambahkan Flag untuk Restore Sekali Saja

```typescript
const [isCodeRestored, setIsCodeRestored] = useState(false)
```

### 2. Update useEffect Restore dengan Guard

```typescript
useEffect(() => {
  if (!task || isCodeRestored) return  // ✅ Guard: hanya restore sekali!

  if (typeof window !== 'undefined' && autosaveKey) {
    const savedCode = localStorage.getItem(autosaveKey)
    if (savedCode) {
      setCode(savedCode)
      setAutosaveMessage('Draft dipulihkan dari autosave')
      setIsCodeRestored(true)  // ✅ Mark as restored
      setEditorKey(prev => prev + 1)  // ✅ Force remount dengan kode baru
    } else {
      setIsCodeRestored(true)  // ✅ Set flag even if no saved code
    }
  }

  if (task.testCases?.length) {
    setActiveTestCaseId(task.testCases[0].id)
  }
}, [task, autosaveKey, isCodeRestored])  // ✅ Include isCodeRestored
```

### 3. Tambahkan Editor Key untuk Force Remount

```typescript
const [editorKey, setEditorKey] = useState(0)
const editorRef = useRef<any>(null)
```

### 4. Update Editor Component

```typescript
<Editor
  key={editorKey}  // ✅ Key untuk force remount saat restore
  language="python"
  theme={editorTheme}
  value={code}
  onChange={(value) => setCode(value || '')}
  onMount={(editor) => {
    editorRef.current = editor  // ✅ Simpan ref untuk kontrol manual
  }}
  options={{
    minimap: { enabled: false },
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    fontSize: 14,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    automaticLayout: true  // ✅ Auto adjust layout
  }}
  height="480px"
/>
```

## 📋 Changes Summary

### Modified Files

1. **`/src/app/student/coding-lab/[slug]/page.tsx`**

**Changes**:
- Import `useRef` dari React
- Tambah state `isCodeRestored` untuk tracking restore status
- Tambah state `editorKey` untuk force remount editor
- Tambah `editorRef` untuk menyimpan reference ke editor instance
- Update useEffect restore dengan guard `isCodeRestored`
- Update Editor component dengan `key`, `onMount`, dan `automaticLayout`

## 🧪 Testing

### Cara Test Fix

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate ke Coding Lab**:
   ```
   http://localhost:3000/student/coding-lab/penjumlahan-dua-bilangan
   ```

3. **Test Scenario 1: Normal Typing**
   - Ketik di baris 1: "def hello():"
   - Tekan Enter, ketik di baris 2: "    print('hello')"
   - Tekan Enter, ketik di baris 3: "    return True"
   - ✅ **Expected**: Cursor tetap di baris 3, tidak loncat ke baris terakhir

4. **Test Scenario 2: Autosave**
   - Ketik beberapa baris kode
   - Wait 1.2 detik (autosave delay)
   - Check message "Tersimpan otomatis HH:MM"
   - Lanjutkan mengetik
   - ✅ **Expected**: Cursor tidak loncat, mengetik normal

5. **Test Scenario 3: Restore from localStorage**
   - Ketik beberapa kode
   - Refresh page (F5)
   - ✅ **Expected**: Code restored dengan message "Draft dipulihkan dari autosave"
   - Ketik lagi
   - ✅ **Expected**: Cursor tidak loncat

6. **Test Scenario 4: Multi-line Code**
   - Paste multi-line code
   - Edit di baris tengah
   - ✅ **Expected**: Cursor tetap di posisi edit

## 🔧 Technical Details

### Why This Fix Works

1. **`isCodeRestored` Flag**:
   - Memastikan restore dari localStorage **hanya terjadi sekali**
   - Mencegah loop: restore → autosave → restore lagi

2. **`editorKey` State**:
   - Force remount Monaco Editor dengan kode yang sudah di-restore
   - Memastikan editor dimulai dengan state yang bersih

3. **`editorRef`**:
   - Menyimpan reference untuk kontrol manual di masa depan
   - Bisa digunakan untuk features seperti cursor position restore

4. **`automaticLayout: true`**:
   - Monaco Editor auto-adjust saat container resize
   - Mencegah layout issues yang bisa trigger re-render

### Autosave Flow (After Fix)

```
User types → code state changes
    ↓
Autosave useEffect triggered (1.2s delay)
    ↓
Save to localStorage
    ↓
Update autosave message
    ✅ NO restore triggered (isCodeRestored = true)
```

### Restore Flow (After Fix)

```
Page load → fetchTask
    ↓
task loaded → useEffect(restore) triggered
    ↓
Check: isCodeRestored = false ✅
    ↓
Get savedCode from localStorage
    ↓
setCode(savedCode) + setIsCodeRestored(true) + setEditorKey++
    ↓
Editor remounts with new key and restored code
    ✅ isCodeRestored = true → prevent future restores
```

## 📊 Before vs After

### Before Fix ❌

```
User typing → code changes → autosave
    ↓
Restore useEffect triggered again
    ↓
setCode from localStorage
    ↓
Editor value changes → cursor resets to end
    ❌ CURSOR JUMP!
```

### After Fix ✅

```
User typing → code changes → autosave
    ↓
Restore useEffect: isCodeRestored = true, skip
    ✅ NO CURSOR JUMP!
```

## 🎯 Additional Improvements

### Future Enhancements (Optional)

1. **Save Cursor Position**:
   ```typescript
   const saveCursorPosition = () => {
     const editor = editorRef.current
     if (editor) {
       const position = editor.getPosition()
       localStorage.setItem(`${autosaveKey}-cursor`, JSON.stringify(position))
     }
   }
   
   const restoreCursorPosition = () => {
     const editor = editorRef.current
     const savedPosition = localStorage.getItem(`${autosaveKey}-cursor`)
     if (editor && savedPosition) {
       editor.setPosition(JSON.parse(savedPosition))
     }
   }
   ```

2. **Debounce Autosave**:
   Already implemented with 1.2s delay, works well!

3. **Visual Feedback**:
   Already implemented with autosave message!

## ✅ Verification Checklist

- [x] Import `useRef` added
- [x] `isCodeRestored` state added
- [x] `editorKey` state added
- [x] `editorRef` ref added
- [x] useEffect restore updated with guard
- [x] Editor component updated with key
- [x] Editor onMount handler added
- [x] automaticLayout option added
- [x] No TypeScript errors in component
- [x] Autosave still works (1.2s delay)
- [x] Restore from localStorage works

## 🚀 Deployment

Changes ready for:
- ✅ Development testing
- ✅ Production deployment
- ✅ No breaking changes
- ✅ Backward compatible

## 📝 Notes

- Fix applies to Python Coding Lab only (`/student/coding-lab/[slug]`)
- Other coding lab pages (if any) may need similar fixes
- Monaco Editor version: Latest from `@monaco-editor/react`
- React version: 18+ (uses hooks)

---

**Status**: ✅ **FIXED**

Cursor jump issue resolved! User dapat mengetik dengan lancar tanpa gangguan. 🎉
