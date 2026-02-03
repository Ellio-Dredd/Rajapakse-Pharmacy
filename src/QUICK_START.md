# 🚀 Quick Start Guide

## ⚡ Get Your Backend Running in 5 Minutes

### Step 1: Open Supabase SQL Editor (1 min)

1. Click this link: https://supabase.com/dashboard/project/zmvprnrggquzrgxrdetf/editor
2. Click **"New Query"** button

### Step 2: Create Tables (2 min)

1. Open the file: `/supabase/migrations/001_create_tables.sql`
2. **Select ALL** text (Ctrl+A / Cmd+A)
3. **Copy** (Ctrl+C / Cmd+C)
4. **Paste** into SQL Editor (Ctrl+V / Cmd+V)
5. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
6. Wait for "Success. No rows returned" message ✅

### Step 3: Add Sample Data (1 min)

1. Click **"New Query"** again
2. Open the file: `/supabase/migrations/002_seed_data.sql`
3. **Select ALL** text (Ctrl+A / Cmd+A)
4. **Copy** (Ctrl+C / Cmd+C)
5. **Paste** into SQL Editor (Ctrl+V / Cmd+V)
6. Click **"Run"** button
7. You should see multiple success messages ✅

### Step 4: Verify Setup (1 min)

1. Go to **"Table Editor"** in Supabase Dashboard
2. Click on **"products"** table - should see 8 products ✅
3. Click on **"doctors"** table - should see 6 doctors ✅
4. Click on **"orders"** table - should see 2 orders ✅

### Step 5: Test API (30 seconds)

Open your browser console and run:

```javascript
fetch('https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5/products', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptdnBybnJnZ3F1enJneHJkZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDc1NjMsImV4cCI6MjA4NTYyMzU2M30.yWF3RxUfc0FNLPeg-HviBKrNrPq8UDD7KCvNem657mM'
  }
})
.then(r => r.json())
.then(d => console.log('Products:', d));
```

You should see 8 products in the console! ✅

---

## ✅ Done! Your Backend is Ready

You now have:
- ✅ 7 database tables with proper schema
- ✅ 41+ API endpoints ready to use
- ✅ Sample data for testing
- ✅ Modular, scalable architecture
- ✅ Security policies enabled
- ✅ Indexes for performance

---

## 🎯 What You Can Do Now

### Test the Frontend
Your existing frontend already works with the new backend! Just refresh your app.

### Try Some API Calls

```javascript
// In browser console or your React components

// Get all products
const products = await fetch('https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5/products', {
  headers: { 'Authorization': 'Bearer YOUR_KEY' }
}).then(r => r.json());

// Filter products by category
const medicines = await fetch('https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5/products?category=medicines', {
  headers: { 'Authorization': 'Bearer YOUR_KEY' }
}).then(r => r.json());

// Get all doctors
const doctors = await fetch('https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5/doctors', {
  headers: { 'Authorization': 'Bearer YOUR_KEY' }
}).then(r => r.json());

// Get dashboard analytics
const analytics = await fetch('https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5/analytics/dashboard', {
  headers: { 'Authorization': 'Bearer YOUR_KEY' }
}).then(r => r.json());
```

### Use the API Utility (Recommended)

```javascript
import { productsAPI, doctorsAPI, ordersAPI } from './utils/api';

// Much easier!
const { data: products } = await productsAPI.getAll();
const { data: doctors } = await doctorsAPI.getAll();
const order = await ordersAPI.create({ ... });
```

---

## 📚 Need More Info?

| Documentation | What's Inside |
|---------------|---------------|
| `DATABASE_SETUP_GUIDE.md` | Detailed setup with troubleshooting |
| `BACKEND_ARCHITECTURE.md` | How everything works |
| `MODULAR_BACKEND_COMPLETE.md` | Complete overview of changes |
| `ARCHITECTURE_DIAGRAM.md` | Visual diagrams |
| `BACKEND_README.md` | Full API documentation |

---

## 🐛 Something Not Working?

### No tables showing up?
→ Make sure you ran BOTH SQL files (001 and 002)

### API returns errors?
→ Check Supabase Function logs in Dashboard

### No data in tables?
→ Verify you ran `002_seed_data.sql`

### CORS errors?
→ Clear browser cache and try again

---

## 🎉 You're All Set!

Your healthcare platform has:
- ✨ Professional database structure
- ✨ Modular backend code
- ✨ 41+ production-ready endpoints
- ✨ Sample data for testing
- ✨ Security built-in
- ✨ Performance optimized

**Start building! 💪**

---

## 📖 Learning Resources

### Database Tables
```sql
products        -- 8 sample products
users           -- 3 sample users  
doctors         -- 6 sample doctors
orders          -- 2 sample orders
appointments    -- 2 sample appointments
prescriptions   -- (empty, ready for use)
reviews         -- (empty, ready for use)
```

### API Modules
```
products.tsx        5 endpoints
orders.tsx          6 endpoints  
doctors.tsx         6 endpoints
appointments.tsx    6 endpoints
prescriptions.tsx   6 endpoints
users.tsx           6 endpoints
analytics.tsx       6 endpoints
```

### Key Features
- ✅ Advanced filtering (category, price, search)
- ✅ Time slot validation (prevent double-booking)
- ✅ Availability checking (for doctors)
- ✅ Duplicate prevention (email uniqueness)
- ✅ Foreign key relationships (data integrity)
- ✅ Row Level Security (access control)
- ✅ Automatic timestamps (created_at, updated_at)

---

**Happy coding! 🚀**

Questions? Check the documentation files listed above.
