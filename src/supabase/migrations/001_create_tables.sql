-- =====================================================
-- Healthcare Platform Database Schema
-- =====================================================
-- 
-- IMPORTANT: Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste this script → Run
--
-- This creates all necessary tables with proper relationships,
-- indexes, and constraints for optimal performance.
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('medicines', 'devices', 'wellness', 'personal-care')),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    description TEXT,
    image VARCHAR(500),
    requires_prescription BOOLEAN DEFAULT false,
    rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    reviews INTEGER DEFAULT 0 CHECK (reviews >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for category filtering
CREATE INDEX idx_products_category ON products(category);
-- Index for searching by name
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
-- Index for price range queries
CREATE INDEX idx_products_price ON products(price);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);
-- Index for role-based queries
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- DOCTORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience INTEGER NOT NULL CHECK (experience >= 0),
    image VARCHAR(500),
    education JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    about TEXT,
    rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    reviews INTEGER DEFAULT 0 CHECK (reviews >= 0),
    available BOOLEAN DEFAULT true,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for specialization filtering
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
-- Index for availability
CREATE INDEX idx_doctors_available ON doctors(available);
-- Index for category
CREATE INDEX idx_doctors_category ON doctors(category);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    shipping_address TEXT NOT NULL,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for customer lookups
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
-- Index for order number lookups
CREATE INDEX idx_orders_order_number ON orders(order_number);
-- Index for status filtering
CREATE INDEX idx_orders_status ON orders(status);
-- Index for date range queries
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- =====================================================
-- APPOINTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    doctor_name VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    symptoms TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for patient lookups
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
-- Index for doctor lookups
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
-- Index for appointment number
CREATE INDEX idx_appointments_number ON appointments(appointment_number);
-- Index for date queries
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
-- Index for status filtering
CREATE INDEX idx_appointments_status ON appointments(status);
-- Composite index for doctor availability
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);

-- =====================================================
-- PRESCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20),
    patient_age INTEGER CHECK (patient_age > 0 AND patient_age < 150),
    address TEXT,
    notes TEXT,
    files JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for patient lookups
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
-- Index for prescription number
CREATE INDEX idx_prescriptions_number ON prescriptions(prescription_number);
-- Index for status filtering
CREATE INDEX idx_prescriptions_status ON prescriptions(status);

-- =====================================================
-- REVIEWS TABLE (for products and doctors)
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reviewable_type VARCHAR(50) NOT NULL CHECK (reviewable_type IN ('product', 'doctor')),
    reviewable_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, reviewable_type, reviewable_id)
);

-- Index for fetching reviews by entity
CREATE INDEX idx_reviews_reviewable ON reviews(reviewable_type, reviewable_id);
-- Index for user reviews
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for products and doctors
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view doctors" ON doctors FOR SELECT USING (true);

-- Authenticated users can view their own data
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = customer_id::text);
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid()::text = patient_id::text);
CREATE POLICY "Users can view own prescriptions" ON prescriptions FOR SELECT USING (auth.uid()::text = patient_id::text);
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);

-- Allow service role full access (for admin operations)
CREATE POLICY "Service role has full access to products" ON products USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role has full access to users" ON users USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role has full access to doctors" ON doctors USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role has full access to orders" ON orders USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role has full access to appointments" ON appointments USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role has full access to prescriptions" ON prescriptions USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- INDEXES FOR FULL-TEXT SEARCH
-- =====================================================

-- Full-text search for products
CREATE INDEX idx_products_search ON products USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- Full-text search for doctors
CREATE INDEX idx_doctors_search ON doctors USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(specialization, '') || ' ' || coalesce(about, ''))
);

-- =====================================================
-- INITIAL COMMENTS
-- =====================================================

COMMENT ON TABLE products IS 'Medical products, devices, wellness items, and personal care products';
COMMENT ON TABLE users IS 'Customer and admin user accounts';
COMMENT ON TABLE doctors IS 'Healthcare professionals available for appointments';
COMMENT ON TABLE orders IS 'Customer orders for products';
COMMENT ON TABLE appointments IS 'Doctor appointment bookings';
COMMENT ON TABLE prescriptions IS 'Uploaded prescriptions for verification';
COMMENT ON TABLE reviews IS 'User reviews for products and doctors';
