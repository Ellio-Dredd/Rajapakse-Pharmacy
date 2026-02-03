# Healthcare Platform - Backend Documentation

## 🚀 Backend Setup Complete!

Your Supabase backend is now fully configured with:
- ✅ RESTful API endpoints
- ✅ Key-value database storage
- ✅ Sample data seeding
- ✅ CORS enabled for frontend integration

---

## 📊 Database Structure

The backend uses Supabase's key-value store with the following data types:

### Products (`product:*`)
```typescript
{
  id: string;
  name: string;
  category: "medicines" | "devices" | "wellness" | "personal-care";
  price: number;
  stock: number;
  description: string;
  image: string;
  requiresPrescription: boolean;
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Orders (`order:*`)
```typescript
{
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
```

### Doctors (`doctor:*`)
```typescript
{
  id: string;
  name: string;
  specialization: string;
  experience: number;
  image: string;
  education: string[];
  languages: string[];
  about: string;
  rating: number;
  reviews: number;
  available: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}
```

### Appointments (`appointment:*`)
```typescript
{
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
```

### Prescriptions (`prescription:*`)
```typescript
{
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  address: string;
  notes?: string;
  files: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}
```

### Users (`user:*`)
```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔌 API Endpoints

Base URL: `https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5`

### Health Check
```
GET /health
```

### Database Seeding
```
POST /seed
```
Seeds the database with sample products, doctors, orders, and appointments.

---

### Products

#### Get All Products
```
GET /products
Response: { success: true, data: Product[] }
```

#### Get Product by ID
```
GET /products/:id
Response: { success: true, data: Product }
```

#### Create Product (Admin)
```
POST /products
Body: {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  requiresPrescription?: boolean;
}
Response: { success: true, data: Product }
```

#### Update Product (Admin)
```
PUT /products/:id
Body: Partial<Product>
Response: { success: true, data: Product }
```

#### Delete Product (Admin)
```
DELETE /products/:id
Response: { success: true, message: string }
```

---

### Orders

#### Get All Orders
```
GET /orders
Response: { success: true, data: Order[] }
```

#### Get Order by ID
```
GET /orders/:id
Response: { success: true, data: Order }
```

#### Create Order
```
POST /orders
Body: {
  customerName: string;
  customerEmail: string;
  items: Array<{ id, name, quantity, price }>;
  shippingAddress: string;
  total: number;
}
Response: { success: true, data: Order }
```

#### Update Order Status
```
PATCH /orders/:id/status
Body: { status: string }
Response: { success: true, data: Order }
```

---

### Doctors

#### Get All Doctors
```
GET /doctors
Response: { success: true, data: Doctor[] }
```

#### Get Doctor by ID
```
GET /doctors/:id
Response: { success: true, data: Doctor }
```

#### Create Doctor (Admin)
```
POST /doctors
Body: {
  name: string;
  specialization: string;
  experience: number;
  image?: string;
  education?: string[];
  languages?: string[];
  about?: string;
}
Response: { success: true, data: Doctor }
```

#### Update Doctor (Admin)
```
PUT /doctors/:id
Body: Partial<Doctor>
Response: { success: true, data: Doctor }
```

---

### Appointments

#### Get All Appointments
```
GET /appointments
Response: { success: true, data: Appointment[] }
```

#### Get Appointment by ID
```
GET /appointments/:id
Response: { success: true, data: Appointment }
```

#### Create Appointment
```
POST /appointments
Body: {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms?: string;
  notes?: string;
}
Response: { success: true, data: Appointment }
```

#### Update Appointment Status
```
PATCH /appointments/:id/status
Body: { status: string }
Response: { success: true, data: Appointment }
```

#### Cancel Appointment
```
DELETE /appointments/:id
Response: { success: true, data: Appointment }
```

---

### Prescriptions

#### Get All Prescriptions
```
GET /prescriptions
Response: { success: true, data: Prescription[] }
```

#### Submit Prescription
```
POST /prescriptions
Body: {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  patientAge?: number;
  address?: string;
  notes?: string;
  files: string[];
}
Response: { success: true, data: Prescription }
```

#### Update Prescription Status
```
PATCH /prescriptions/:id/status
Body: { status: string }
Response: { success: true, data: Prescription }
```

---

### Users

#### Get All Users (Admin)
```
GET /users
Response: { success: true, data: User[] }
```

#### Get User by ID
```
GET /users/:id
Response: { success: true, data: User }
```

#### Create/Update User Profile
```
PUT /users/:id
Body: Partial<User>
Response: { success: true, data: User }
```

---

### Analytics

#### Get Dashboard Statistics
```
GET /analytics/dashboard
Response: {
  success: true,
  data: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalAppointments: number;
    totalSales: number;
    pendingOrders: number;
    confirmedAppointments: number;
  }
}
```

---

## 🛠️ Usage in Frontend

### 1. Initialize Database with Sample Data

Open your browser console and run:

```javascript
const response = await fetch('https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5/seed', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptdnBybnJnZ3F1enJneHJkZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDc1NjMsImV4cCI6MjA4NTYyMzU2M30.yWF3RxUfc0FNLPeg-HviBKrNrPq8UDD7KCvNem657mM'
  }
});
const data = await response.json();
console.log(data);
```

### 2. Using the API Utility

Import and use the API helper functions in your components:

```typescript
import { productsAPI, ordersAPI, appointmentsAPI } from './utils/api';

// Get all products
const { data: products } = await productsAPI.getAll();

// Create an order
const order = await ordersAPI.create({
  customerName: "John Doe",
  customerEmail: "john@example.com",
  items: [...],
  shippingAddress: "123 Main St",
  total: 99.99
});

// Book an appointment
const appointment = await appointmentsAPI.create({
  patientName: "Jane Smith",
  patientEmail: "jane@example.com",
  doctorId: "doc-1",
  doctorName: "Dr. Michael Chen",
  date: "2026-02-10",
  time: "10:00 AM",
  symptoms: "Chest pain"
});
```

---

## 🔒 Security Notes

⚠️ **Important**: This is a prototype setup. For production use:

1. **Implement Authentication**: Add Supabase Auth for user login/signup
2. **Add Authorization**: Protect admin endpoints with role-based access control
3. **Validate Input**: Add comprehensive input validation
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **HIPAA Compliance**: If handling real patient data, ensure HIPAA compliance
6. **Environment Variables**: Never commit API keys to version control

---

## 📝 Next Steps

1. **Seed the database** using the `/seed` endpoint
2. **Test API endpoints** using Postman or curl
3. **Integrate with frontend** using the API utility functions
4. **Add authentication** for user management
5. **Deploy to production** with proper security measures

---

## 🐛 Debugging

### Check Server Logs
View logs in Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to Edge Functions → Logs

### Test Health Endpoint
```bash
curl https://zmvprnrggquzrgxrdetf.supabase.co/functions/v1/make-server-18234cd5/health
```

### Common Issues

**CORS Errors**: CORS is enabled for all origins. If you still face issues, check browser console.

**404 Errors**: Ensure the edge function is deployed and URL is correct.

**500 Errors**: Check Supabase logs for detailed error messages.

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Hono Framework](https://hono.dev/)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)

---

**Your healthcare platform backend is ready! 🎉**
