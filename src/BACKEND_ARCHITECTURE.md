# Backend Architecture Overview

## 🏗️ Modular Edge Functions Structure

```
/supabase/functions/server/
│
├── index.tsx                   # Main router (connects all modules)
├── db.tsx                      # Database client & helpers
│
├── products.tsx                # Product management
├── orders.tsx                  # Order management
├── doctors.tsx                 # Doctor management
├── appointments.tsx            # Appointment booking
├── prescriptions.tsx           # Prescription handling
├── users.tsx                   # User management
└── analytics.tsx               # Analytics & reporting
```

---

## 📦 File Responsibilities

### `index.tsx` - Main Router
- **Purpose**: Entry point that routes requests to appropriate modules
- **Features**:
  - CORS configuration
  - Request logging
  - Error handling
  - Health check endpoint
  - Routes mounting

### `db.tsx` - Database Utilities
- **Purpose**: Shared database client and helper functions
- **Exports**:
  - `supabase` - Configured Supabase client
  - `successResponse(data, status)` - Standard success response
  - `errorResponse(error, status)` - Standard error response

### `products.tsx` - Product Management
- **Endpoints**: 5 endpoints
- **Features**:
  - List products with filtering (category, price range, search)
  - Get single product
  - Create/Update/Delete products
  - Automatic stock tracking

### `orders.tsx` - Order Management
- **Endpoints**: 6 endpoints
- **Features**:
  - List orders with filtering (status, customer)
  - Get single order
  - Create orders with auto-generated order numbers
  - Update order status
  - Full order updates
  - Delete orders

### `doctors.tsx` - Doctor Management
- **Endpoints**: 6 endpoints
- **Features**:
  - List doctors with filtering (specialization, availability, search)
  - Get single doctor
  - Check doctor availability for specific dates
  - Create/Update/Delete doctors
  - JSONB fields for education and languages

### `appointments.tsx` - Appointment Booking
- **Endpoints**: 6 endpoints
- **Features**:
  - List appointments with filtering (status, doctor, patient, date)
  - Get single appointment
  - Create appointments with time slot validation
  - Prevent double-booking
  - Update appointment status
  - Cancel appointments (soft delete)

### `prescriptions.tsx` - Prescription Handling
- **Endpoints**: 6 endpoints
- **Features**:
  - List prescriptions with filtering (status, patient)
  - Get single prescription
  - Submit prescriptions with file attachments
  - Update prescription status (approve/reject)
  - Full prescription updates
  - Delete prescriptions

### `users.tsx` - User Management
- **Endpoints**: 6 endpoints
- **Features**:
  - List users with filtering (role, search)
  - Get user by ID or email
  - Create users with duplicate check
  - Update user profiles
  - Delete users
  - Role-based access (customer/admin)

### `analytics.tsx` - Analytics & Reporting
- **Endpoints**: 6 endpoints
- **Features**:
  - Dashboard statistics (counts, totals)
  - Sales analytics over time
  - Product category distribution
  - Appointment statistics
  - Top selling products
  - Recent activity feed

---

## 🗄️ Database Tables

### Core Tables

| Table | Primary Key | Foreign Keys | Purpose |
|-------|-------------|--------------|---------|
| `products` | UUID | - | Medical products catalog |
| `users` | UUID | - | Customer & admin accounts |
| `doctors` | UUID | - | Healthcare professionals |
| `orders` | UUID | customer_id → users | Customer orders |
| `appointments` | UUID | patient_id → users<br>doctor_id → doctors | Doctor bookings |
| `prescriptions` | UUID | patient_id → users | Uploaded prescriptions |
| `reviews` | UUID | user_id → users | Product & doctor reviews |

### Key Features

✅ **UUID Primary Keys** - Globally unique identifiers  
✅ **Foreign Key Constraints** - Referential integrity  
✅ **JSONB Fields** - Flexible data (education, languages, items)  
✅ **Automatic Timestamps** - created_at, updated_at  
✅ **Indexes** - Optimized queries  
✅ **Check Constraints** - Data validation  
✅ **Row Level Security** - Access control  

---

## 🔐 Security Layers

### 1. Row Level Security (RLS)
```sql
-- Public read access
products, doctors → Anyone can SELECT

-- User-specific data
orders → Users see only their own
appointments → Users see only their own
prescriptions → Users see only their own

-- Admin access
All tables → Service role has full access
```

### 2. API Authentication
- Bearer token authentication
- Service role for admin operations
- Public anon key for general access

### 3. Data Validation
- SQL check constraints
- Required fields validation
- Type checking
- Format validation

---

## 🔄 Request Flow

```
Client Request
    ↓
index.tsx (Router)
    ↓
CORS Middleware
    ↓
Logger Middleware
    ↓
Route Handler (e.g., products.tsx)
    ↓
Database Query (via db.tsx)
    ↓
Response (successResponse/errorResponse)
    ↓
Client
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🚀 Performance Optimizations

### 1. Database Indexes
- Primary key indexes (automatic)
- Foreign key indexes
- Category/status indexes
- Full-text search indexes
- Composite indexes for common queries

### 2. Query Optimization
- Select only needed columns
- Use filters to reduce data transfer
- Leverage PostgreSQL query planner
- JSONB indexing for nested data

### 3. Connection Pooling
- Supabase handles connection pooling
- Efficient database connections
- Automatic scaling

---

## 📈 Scalability Features

✅ **Modular Architecture** - Easy to extend with new modules  
✅ **Stateless Functions** - Horizontal scaling ready  
✅ **Database Indexes** - Fast queries at scale  
✅ **JSONB Flexibility** - Adapt schema without migrations  
✅ **Edge Function CDN** - Global distribution  
✅ **Connection Pooling** - Handle concurrent requests  

---

## 🛠️ Development Workflow

### Adding a New Endpoint

1. **Create new file** (e.g., `reviews.tsx`)
```typescript
import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const reviews = new Hono();

reviews.get('/', async (c) => {
  // Implementation
});

export default reviews;
```

2. **Import in `index.tsx`**
```typescript
import reviews from "./reviews.tsx";
```

3. **Mount route**
```typescript
app.route("/make-server-18234cd5/reviews", reviews);
```

### Modifying Existing Endpoint

1. Open the relevant file (e.g., `products.tsx`)
2. Modify the handler function
3. Save - Edge Function auto-deploys
4. Test the endpoint

---

## 🧪 Testing Strategy

### 1. Unit Testing
- Test individual route handlers
- Mock database calls
- Verify response format

### 2. Integration Testing
- Test full request flow
- Real database queries
- Check data integrity

### 3. Load Testing
- Stress test endpoints
- Monitor performance
- Optimize slow queries

---

## 📦 Dependencies

```json
{
  "npm:hono": "Web framework",
  "npm:hono/cors": "CORS middleware",
  "npm:hono/logger": "Request logging",
  "npm:@supabase/supabase-js@2": "Database client"
}
```

---

## 🎯 Best Practices

### 1. Error Handling
✅ Always use try-catch blocks  
✅ Log errors with context  
✅ Return meaningful error messages  
✅ Use appropriate HTTP status codes  

### 2. Input Validation
✅ Validate required fields  
✅ Check data types  
✅ Sanitize user input  
✅ Validate business logic  

### 3. Response Consistency
✅ Use `successResponse()` for success  
✅ Use `errorResponse()` for errors  
✅ Include relevant data/error info  
✅ Return proper status codes  

### 4. Database Queries
✅ Select only needed columns  
✅ Use indexes for filters  
✅ Avoid N+1 queries  
✅ Handle null values  

### 5. Code Organization
✅ One domain per file  
✅ Related endpoints together  
✅ Shared utilities in `db.tsx`  
✅ Clear function names  

---

## 🔮 Future Enhancements

- [ ] Add GraphQL layer for flexible queries
- [ ] Implement rate limiting
- [ ] Add request caching
- [ ] WebSocket support for real-time features
- [ ] Batch operations endpoints
- [ ] Export/Import data endpoints
- [ ] Audit logging for admin actions
- [ ] API versioning (v1, v2)
- [ ] OpenAPI/Swagger documentation
- [ ] Automated testing suite

---

## 📚 Resources

- **Hono Docs**: https://hono.dev/
- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Edge Functions Guide**: https://supabase.com/docs/guides/functions

---

**Clean, modular, scalable backend architecture! 🎉**
