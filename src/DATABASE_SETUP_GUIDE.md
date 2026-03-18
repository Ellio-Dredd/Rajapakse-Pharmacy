# Healthcare Platform - Database Setup Guide

## 🎯 Overview

This guide will help you set up proper database tables in Supabase instead of using the key-value store. The new architecture uses:

- **Proper PostgreSQL tables** with relationships, indexes, and constraints
- **Modular Edge Functions** - separate files for each domain
- **Row Level Security (RLS)** for data protection
- **Optimized queries** with indexes

---

## 📋 Prerequisites

- Supabase project created (you already have this)
- Access to Supabase Dashboard
- Project URL: `https://zmvprnrggquzrgxrdetf.supabase.co`

---

## 🚀 Step-by-Step Setup

### Step 1: Access Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: `zmvprnrggquzrgxrdetf`
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Create Database Tables

1. Copy the entire content from `/supabase/migrations/001_create_tables.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
4. Wait for confirmation message: "Success. No rows returned"

This creates 7 tables:
- ✅ `products` - Medical products and supplies
- ✅ `users` - Customer and admin accounts
- ✅ `doctors` - Healthcare professionals
- ✅ `orders` - Customer orders
- ✅ `appointments` - Doctor appointments
- ✅ `prescriptions` - Uploaded prescriptions
- ✅ `reviews` - Product and doctor reviews

### Step 3: Seed Sample Data

1. Click **"New Query"** again
2. Copy the entire content from `/supabase/migrations/002_seed_data.sql`
3. Paste it into the SQL Editor
4. Click **"Run"**
5. You should see messages confirming data was inserted

This populates:
- ✅ 8 Sample products
- ✅ 6 Sample doctors
- ✅ 3 Sample users
- ✅ 2 Sample orders
- ✅ 2 Sample appointments

### Step 4: Verify Tables

1. Go to **"Table Editor"** in the left sidebar
2. You should see all 7 tables listed
3. Click on each table to view the data

---

## 📁 New Backend Architecture

Your backend is now modular with separate files:

```
/supabase/functions/server/
├── index.tsx              # Main router - connects all modules
├── db.tsx                 # Database client & helper functions
├── products.tsx           # Product endpoints
├── orders.tsx             # Order endpoints
├── doctors.tsx            # Doctor endpoints
├── appointments.tsx       # Appointment endpoints
├── prescriptions.tsx      # Prescription endpoints
├── users.tsx              # User endpoints
├── analytics.tsx          # Analytics endpoints
└── kv_store.tsx           # (Legacy - can be removed after migration)
```

---

## 🔌 API Endpoints (No Changes)

Your frontend code doesn't need to change! All endpoints remain the same:

**Base URL**: `https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5`

### Products
- `GET /products` - Get all products (with filters: category, search, minPrice, maxPrice)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Orders
- `GET /orders` - Get all orders (with filters: status, customerId)
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order
- `PATCH /orders/:id/status` - Update order status
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

### Doctors
- `GET /doctors` - Get all doctors (with filters: specialization, category, available, search)
- `GET /doctors/:id` - Get doctor by ID
- `GET /doctors/:id/availability` - Get doctor availability for a date
- `POST /doctors` - Create doctor
- `PUT /doctors/:id` - Update doctor
- `DELETE /doctors/:id` - Delete doctor

### Appointments
- `GET /appointments` - Get all appointments (with filters: status, doctorId, patientId, date)
- `GET /appointments/:id` - Get appointment by ID
- `POST /appointments` - Create appointment (with time slot validation)
- `PATCH /appointments/:id/status` - Update appointment status
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

### Prescriptions
- `GET /prescriptions` - Get all prescriptions (with filters: status, patientId)
- `GET /prescriptions/:id` - Get prescription by ID
- `POST /prescriptions` - Submit prescription
- `PATCH /prescriptions/:id/status` - Update prescription status
- `PUT /prescriptions/:id` - Update prescription
- `DELETE /prescriptions/:id` - Delete prescription

### Users
- `GET /users` - Get all users (with filters: role, search)
- `GET /users/:id` - Get user by ID
- `GET /users/email/:email` - Get user by email
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Analytics
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/sales` - Sales over time (query param: days)
- `GET /analytics/products-by-category` - Product distribution
- `GET /analytics/appointments-stats` - Appointment statistics
- `GET /analytics/top-products` - Best selling products (query param: limit)
- `GET /analytics/recent-activity` - Recent orders & appointments (query param: limit)

---

## 🆕 New Features

### 1. Advanced Filtering

```javascript
// Filter products by category and price range
GET /products?category=medicines&minPrice=10&maxPrice=50

// Search doctors by name or specialization
GET /doctors?search=cardio

// Get confirmed appointments for a specific date
GET /appointments?status=confirmed&date=2026-02-05
```

### 2. Time Slot Validation

Appointments now check for conflicts:

```javascript
// This will fail if the time slot is already booked
POST /appointments
{
  "doctor_id": "...",
  "appointment_date": "2026-02-05",
  "appointment_time": "09:00:00"
}
```

### 3. Doctor Availability Check

```javascript
// Get booked time slots for a doctor on a specific date
GET /doctors/{id}/availability?date=2026-02-05

Response: {
  "success": true,
  "data": {
    "date": "2026-02-05",
    "bookedTimes": ["09:00:00", "10:30:00", "14:00:00"]
  }
}
```

### 4. Enhanced Analytics

```javascript
// Get sales data for the last 30 days
GET /analytics/sales?days=30

// Get top 5 selling products
GET /analytics/top-products?limit=5

// Get recent activity
GET /analytics/recent-activity?limit=20
```

---

## 🔒 Security Features

### Row Level Security (RLS)

The database now has RLS policies:

- **Public Access**: Products and doctors are visible to everyone
- **User Data**: Users can only view their own orders, appointments, and prescriptions
- **Admin Access**: Service role has full access to all tables
- **Data Integrity**: Foreign key constraints ensure referential integrity

### Automatic Timestamps

All tables have automatic `updated_at` triggers that update on every modification.

### Data Validation

- Check constraints ensure valid data (e.g., price >= 0, rating between 0-5)
- Unique constraints prevent duplicates (e.g., unique email for users)
- Not null constraints ensure required fields are provided

---

## 📊 Database Schema Overview

### Products Table
```sql
id (UUID, PK)
name (VARCHAR)
category (VARCHAR) - medicines, devices, wellness, personal-care
price (DECIMAL)
stock (INTEGER)
description (TEXT)
image (VARCHAR)
requires_prescription (BOOLEAN)
rating (DECIMAL)
reviews (INTEGER)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Users Table
```sql
id (UUID, PK)
email (VARCHAR, UNIQUE)
name (VARCHAR)
phone (VARCHAR)
role (VARCHAR) - customer, admin
address (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Doctors Table
```sql
id (UUID, PK)
name (VARCHAR)
specialization (VARCHAR)
experience (INTEGER)
image (VARCHAR)
education (JSONB)
languages (JSONB)
about (TEXT)
rating (DECIMAL)
reviews (INTEGER)
available (BOOLEAN)
category (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Orders Table
```sql
id (UUID, PK)
order_number (VARCHAR, UNIQUE)
customer_id (UUID, FK → users)
customer_name (VARCHAR)
customer_email (VARCHAR)
items (JSONB)
shipping_address (TEXT)
total (DECIMAL)
status (VARCHAR) - pending, processing, shipped, completed, cancelled
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Appointments Table
```sql
id (UUID, PK)
appointment_number (VARCHAR, UNIQUE)
patient_id (UUID, FK → users)
patient_name (VARCHAR)
patient_email (VARCHAR)
patient_phone (VARCHAR)
doctor_id (UUID, FK → doctors)
doctor_name (VARCHAR)
appointment_date (DATE)
appointment_time (TIME)
symptoms (TEXT)
notes (TEXT)
status (VARCHAR) - pending, confirmed, completed, cancelled
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Prescriptions Table
```sql
id (UUID, PK)
prescription_number (VARCHAR, UNIQUE)
patient_id (UUID, FK → users)
patient_name (VARCHAR)
patient_email (VARCHAR)
patient_phone (VARCHAR)
patient_age (INTEGER)
address (TEXT)
notes (TEXT)
files (JSONB)
status (VARCHAR) - pending, approved, rejected
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Reviews Table
```sql
id (UUID, PK)
user_id (UUID, FK → users)
reviewable_type (VARCHAR) - product, doctor
reviewable_id (UUID)
rating (INTEGER) 1-5
comment (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 🧪 Testing the New Setup

### 1. Test Health Endpoint

```bash
curl https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-02T...",
  "message": "Healthcare Platform API is running"
}
```

### 2. Test Products Endpoint

```bash
curl https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5/products \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 3. Test from Frontend

Your existing API utility (`/utils/api.ts`) will work without any changes!

```javascript
import { productsAPI } from './utils/api';

// This will now query the proper database tables
const { data } = await productsAPI.getAll();
console.log(data);
```

---

## 🔄 Migration from KV Store

If you have existing data in the KV store, you can migrate it:

1. Fetch all data from KV store using the old endpoints
2. Transform the data to match the new schema
3. Insert into the new tables using the POST endpoints

Or simply use the seed script which provides fresh sample data.

---

## 🐛 Troubleshooting

### Issue: "relation 'products' does not exist"
**Solution**: Run the `001_create_tables.sql` migration in SQL Editor

### Issue: "No rows returned" after seeding
**Solution**: Check the Table Editor to verify data was inserted

### Issue: Edge function not updating
**Solution**: Edge functions auto-deploy. Check the Functions tab in Supabase Dashboard

### Issue: CORS errors
**Solution**: CORS is already configured. Clear browser cache and retry

### Issue: 404 errors
**Solution**: Ensure you're using the correct endpoint paths with `/make-server-18234cd5/` prefix

---

## 📚 Next Steps

1. ✅ Run the SQL migrations (Steps 2-3 above)
2. ✅ Test the API endpoints
3. ✅ Update frontend components to use the API (already done via `/utils/api.ts`)
4. 🔄 Add authentication using Supabase Auth
5. 🔄 Implement file uploads for prescriptions using Supabase Storage
6. 🔄 Add real-time subscriptions for live updates
7. 🔄 Deploy to production

---

## 🎉 Benefits of This Setup

✅ **Proper Database Structure** - Normalized tables with relationships  
✅ **Better Performance** - Indexed queries, optimized lookups  
✅ **Data Integrity** - Foreign keys, constraints, validations  
✅ **Scalability** - Can handle thousands of records efficiently  
✅ **Security** - Row Level Security policies  
✅ **Modularity** - Separate files for each domain  
✅ **Maintainability** - Clean, organized code structure  
✅ **Type Safety** - PostgreSQL ensures data types  
✅ **Advanced Queries** - Full SQL capabilities  
✅ **Automatic Timestamps** - created_at/updated_at handled automatically  

---

**Your healthcare platform now has enterprise-grade database architecture! 🚀**

For questions or issues, check the Supabase docs: https://supabase.com/docs
