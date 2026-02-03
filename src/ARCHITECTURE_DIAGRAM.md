# Healthcare Platform - System Architecture

## 🏗️ Complete System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Patient    │  │    Doctor    │  │    Admin     │         │
│  │   Portal     │  │   Booking    │  │  Dashboard   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
│                    ┌───────▼────────┐                           │
│                    │  /utils/api.ts │                           │
│                    │  API Utilities │                           │
│                    └───────┬────────┘                           │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   HTTP/HTTPS    │
                    │   Requests      │
                    └────────┬────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                    EDGE FUNCTION LAYER                         │
│   (Supabase Edge Functions - Deno Runtime)                    │
│                                                                │
│              ┌─────────────────────────┐                       │
│              │   index.tsx (Router)    │                       │
│              │  - CORS                 │                       │
│              │  - Logging              │                       │
│              │  - Error Handling       │                       │
│              └──────────┬──────────────┘                       │
│                         │                                       │
│         ┌───────────────┼───────────────┐                     │
│         │               │               │                     │
│    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐               │
│    │products │    │ orders  │    │ doctors │               │
│    │  .tsx   │    │  .tsx   │    │  .tsx   │   ...         │
│    └────┬────┘    └────┬────┘    └────┬────┘               │
│         │              │              │                      │
│         └──────────────┼──────────────┘                      │
│                        │                                      │
│                  ┌─────▼──────┐                              │
│                  │   db.tsx   │                              │
│                  │ - supabase │                              │
│                  │ - helpers  │                              │
│                  └─────┬──────┘                              │
└────────────────────────┼───────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │PostgreSQL│
                    │  Client  │
                    └────┬────┘
                         │
┌────────────────────────▼──────────────────────────────────────┐
│                    DATABASE LAYER                              │
│               (Supabase PostgreSQL)                            │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ products │  │  users   │  │ doctors  │  │  orders  │    │
│  │  table   │  │  table   │  │  table   │  │  table   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │              │             │           │
│  ┌────▼──────────┐  │         ┌────▼─────┐  ┌───▼──────┐   │
│  │ appointments  │──┼─────────│  reviews │  │prescription│   │
│  │    table      │  │         │  table   │  │   table    │   │
│  └───────────────┘  │         └──────────┘  └────────────┘   │
│                     │                                         │
│  ┌──────────────────▼────────────────┐                       │
│  │    Indexes & Constraints           │                       │
│  │  - Primary Keys (UUID)            │                       │
│  │  - Foreign Keys                   │                       │
│  │  - Unique Constraints             │                       │
│  │  - Check Constraints              │                       │
│  │  - B-tree Indexes                 │                       │
│  │  - GIN Indexes (Full-text)        │                       │
│  └───────────────────────────────────┘                       │
│                                                                │
│  ┌───────────────────────────────────┐                       │
│  │   Row Level Security (RLS)        │                       │
│  │  - Public: products, doctors      │                       │
│  │  - User-specific: orders, appts   │                       │
│  │  - Service role: full access      │                       │
│  └───────────────────────────────────┘                       │
└────────────────────────────────────────────────────────────────┘
```

---

## 📂 File Structure Breakdown

```
healthcare-platform/
│
├── 🎨 FRONTEND
│   ├── /components/
│   │   ├── LandingPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── DoctorsListingPage.tsx
│   │   ├── Admin*.tsx (5 admin pages)
│   │   └── ... (30+ components)
│   │
│   ├── /utils/
│   │   └── api.ts ⭐ (Frontend ↔ Backend bridge)
│   │
│   └── App.tsx
│
├── 🔧 BACKEND (Edge Functions)
│   ├── /supabase/functions/server/
│   │   ├── index.tsx          # Router
│   │   ├── db.tsx             # DB utilities
│   │   ├── products.tsx       # 5 endpoints
│   │   ├── orders.tsx         # 6 endpoints
│   │   ├── doctors.tsx        # 6 endpoints
│   │   ├── appointments.tsx   # 6 endpoints
│   │   ├── prescriptions.tsx  # 6 endpoints
│   │   ├── users.tsx          # 6 endpoints
│   │   └── analytics.tsx      # 6 endpoints
│   │
│   └── /supabase/migrations/
│       ├── 001_create_tables.sql  # Schema
│       └── 002_seed_data.sql      # Sample data
│
└── 📚 DOCUMENTATION
    ├── DATABASE_SETUP_GUIDE.md
    ├── BACKEND_ARCHITECTURE.md
    ├── MODULAR_BACKEND_COMPLETE.md
    └── ARCHITECTURE_DIAGRAM.md (this file)
```

---

## 🔄 Request Flow Detail

```
1. USER ACTION
   │
   ▼
2. REACT COMPONENT
   │
   ▼
3. API UTILITY (/utils/api.ts)
   │  - Adds auth headers
   │  - Formats request
   │  - Handles errors
   ▼
4. HTTP REQUEST
   │  - HTTPS
   │  - JSON payload
   │  - Bearer token
   ▼
5. EDGE FUNCTION (index.tsx)
   │  - CORS check
   │  - Logging
   │  - Route matching
   ▼
6. ROUTE HANDLER (e.g., products.tsx)
   │  - Validate input
   │  - Business logic
   │  - Query building
   ▼
7. DATABASE CLIENT (db.tsx)
   │  - Supabase client
   │  - Query execution
   ▼
8. POSTGRESQL DATABASE
   │  - Check RLS policies
   │  - Execute query
   │  - Use indexes
   │  - Return data
   ▼
9. RESPONSE FORMATTING
   │  - successResponse() or errorResponse()
   │  - JSON serialization
   ▼
10. HTTP RESPONSE
    │  - Status code
    │  - JSON body
    │  - Headers
    ▼
11. API UTILITY
    │  - Parse response
    │  - Error handling
    │  - Return data
    ▼
12. REACT COMPONENT
    │  - Update state
    │  - Re-render UI
    ▼
13. USER SEES RESULT
```

---

## 🗄️ Database Relationships

```
                  ┌──────────┐
                  │  users   │
                  │  (UUID)  │
                  └────┬─────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌─────────┐   ┌────────────┐  ┌──────────────┐
    │ orders  │   │appointments│  │prescriptions │
    │         │   │            │  │              │
    │customer_│   │patient_id  │  │ patient_id   │
    │  id     │   │            │  │              │
    └─────────┘   └─────┬──────┘  └──────────────┘
                        │
                        │ doctor_id
                        ▼
                  ┌──────────┐
                  │ doctors  │
                  │  (UUID)  │
                  └──────────┘

         ┌──────────┐
         │ products │     ┌──────────┐
         │  (UUID)  │◄────│ reviews  │
         └──────────┘     │          │
                          │reviewable│
         ┌──────────┐     │  _type   │
         │ doctors  │◄────│reviewable│
         │  (UUID)  │     │   _id    │
         └──────────┘     └──────────┘
```

Legend:
- `─►` = Foreign Key relationship
- `(UUID)` = Primary Key type

---

## 📊 Data Flow Examples

### Example 1: Creating an Order

```
1. User clicks "Checkout" in cart
   ↓
2. React component calls ordersAPI.create()
   ↓
3. POST /orders with order data
   ↓
4. orders.tsx validates data
   ↓
5. Generates unique order_number
   ↓
6. INSERT into orders table
   ↓
7. Returns new order with ID
   ↓
8. Component shows confirmation
```

### Example 2: Booking an Appointment

```
1. User selects date & time
   ↓
2. React calls appointmentsAPI.create()
   ↓
3. POST /appointments
   ↓
4. appointments.tsx checks availability
   ↓
5. SELECT to find conflicts
   ↓
6. If available: INSERT appointment
   ↓
7. If conflict: Return 409 error
   ↓
8. Component shows result
```

### Example 3: Searching Products

```
1. User types in search box
   ↓
2. React calls productsAPI.getAll()
   ↓
3. GET /products?search=vitamin
   ↓
4. products.tsx builds query
   ↓
5. PostgreSQL full-text search
   ↓
6. Uses GIN index for speed
   ↓
7. Returns matching products
   ↓
8. Component displays results
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────┐
│  1. FRONTEND VALIDATION             │
│     - Input sanitization            │
│     - Format validation             │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  2. API AUTHENTICATION              │
│     - Bearer token                  │
│     - CORS policy                   │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  3. EDGE FUNCTION VALIDATION        │
│     - Required fields               │
│     - Data types                    │
│     - Business logic                │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  4. ROW LEVEL SECURITY (RLS)        │
│     - Per-row access control        │
│     - User isolation                │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  5. DATABASE CONSTRAINTS            │
│     - Check constraints             │
│     - Foreign keys                  │
│     - Unique constraints            │
│     - NOT NULL                      │
└─────────────────────────────────────┘
```

---

## 💾 Caching Strategy (Future)

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Redis    │────▶│   Edge     │────▶│ PostgreSQL │
│   Cache    │     │ Functions  │     │  Database  │
└────────────┘     └────────────┘     └────────────┘
     ▲                                        │
     │                                        │
     └────────────────────────────────────────┘
              Cache miss → DB query
```

---

## 📈 Scalability Path

```
Current Setup (1-1000 users)
    ↓
Add Connection Pooling (1000-10000 users)
    ↓
Add Caching Layer (10000-100000 users)
    ↓
Add Read Replicas (100000-1M users)
    ↓
Add Sharding (1M+ users)
```

---

## 🎯 API Endpoint Map

```
/make-server-18234cd5/
│
├── /health ──────────────── Health check
│
├── /products
│   ├── GET    / ─────────── List all (+ filters)
│   ├── GET    /:id ──────── Get single
│   ├── POST   / ─────────── Create
│   ├── PUT    /:id ──────── Update
│   └── DELETE /:id ──────── Delete
│
├── /orders
│   ├── GET    / ─────────── List all (+ filters)
│   ├── GET    /:id ──────── Get single
│   ├── POST   / ─────────── Create
│   ├── PATCH  /:id/status ─ Update status
│   ├── PUT    /:id ──────── Update full
│   └── DELETE /:id ──────── Delete
│
├── /doctors
│   ├── GET    / ─────────── List all (+ filters)
│   ├── GET    /:id ──────── Get single
│   ├── GET    /:id/availability ─ Check slots
│   ├── POST   / ─────────── Create
│   ├── PUT    /:id ──────── Update
│   └── DELETE /:id ──────── Delete
│
├── /appointments
│   ├── GET    / ─────────── List all (+ filters)
│   ├── GET    /:id ──────── Get single
│   ├── POST   / ─────────── Create (+ validation)
│   ├── PATCH  /:id/status ─ Update status
│   ├── PUT    /:id ──────── Update full
│   └── DELETE /:id ──────── Cancel
│
├── /prescriptions
│   ├── GET    / ─────────── List all (+ filters)
│   ├── GET    /:id ──────── Get single
│   ├── POST   / ─────────── Submit
│   ├── PATCH  /:id/status ─ Approve/Reject
│   ├── PUT    /:id ──────── Update
│   └── DELETE /:id ──────── Delete
│
├── /users
│   ├── GET    / ─────────── List all (+ filters)
│   ├── GET    /:id ──────── Get by ID
│   ├── GET    /email/:email Get by email
│   ├── POST   / ─────────── Create
│   ├── PUT    /:id ──────── Update
│   └── DELETE /:id ──────── Delete
│
└── /analytics
    ├── GET /dashboard ────── Overall stats
    ├── GET /sales ────────── Sales over time
    ├── GET /products-by-category ─ Distribution
    ├── GET /appointments-stats ─── Stats
    ├── GET /top-products ────── Best sellers
    └── GET /recent-activity ─── Recent events
```

---

## 🎨 Component → Endpoint Mapping

```
LandingPage
  └─▶ GET /products (featured)
  └─▶ GET /doctors (top rated)

ProductsPage
  └─▶ GET /products?category=...&search=...

CartPage
  └─▶ POST /orders (checkout)

DoctorsListingPage
  └─▶ GET /doctors?specialization=...

AppointmentBookingPage
  └─▶ GET /doctors/:id/availability
  └─▶ POST /appointments

AdminDashboardHome
  └─▶ GET /analytics/dashboard
  └─▶ GET /analytics/sales
  └─▶ GET /analytics/recent-activity

AdminProductManagement
  └─▶ GET /products
  └─▶ POST /products
  └─▶ PUT /products/:id
  └─▶ DELETE /products/:id

AdminOrderManagement
  └─▶ GET /orders
  └─▶ PATCH /orders/:id/status

AdminAppointmentManagement
  └─▶ GET /appointments
  └─▶ PATCH /appointments/:id/status
```

---

**Clear, scalable, professional architecture! 🚀**
