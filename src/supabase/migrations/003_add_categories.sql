-- =====================================================
-- ADD CATEGORIES FEATURE TO EXISTING DATABASE
-- =====================================================
-- Copy and paste this entire script into Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- =====================================================

-- =====================================================
-- STEP 1: Create Categories Table
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Package',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- =====================================================
-- STEP 2: Add category_id Column to Products Table
-- =====================================================
DO $$ 
BEGIN
    -- Add category_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'category_id'
    ) THEN
        ALTER TABLE products ADD COLUMN category_id UUID;
    END IF;
END $$;

-- Create index on category_id for fast filtering
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- =====================================================
-- STEP 3: Add Foreign Key Constraint
-- =====================================================
DO $$
BEGIN
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_category_id_fkey'
        AND table_name = 'products'
    ) THEN
        ALTER TABLE products 
        ADD CONSTRAINT products_category_id_fkey 
        FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON DELETE SET NULL;
    END IF;
END $$;

-- =====================================================
-- STEP 4: Add Trigger for updated_at on Categories
-- =====================================================
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 5: Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access for categories
DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories" 
    ON categories 
    FOR SELECT 
    USING (true);

-- Service role has full access
DROP POLICY IF EXISTS "Service role has full access to categories" ON categories;
CREATE POLICY "Service role has full access to categories" 
    ON categories 
    USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- STEP 6: Seed Default Categories
-- =====================================================
INSERT INTO categories (name, slug, description, icon) VALUES
    ('Medicines', 'medicines', 'Prescription and over-the-counter medicines', 'Pill'),
    ('Medical Devices', 'devices', 'Healthcare and medical equipment', 'Stethoscope'),
    ('Wellness', 'wellness', 'Health supplements and vitamins', 'Heart'),
    ('Personal Care', 'personal-care', 'Personal hygiene and care products', 'Droplet'),
    ('Baby Care', 'baby-care', 'Baby and mother care products', 'Baby'),
    ('First Aid', 'first-aid', 'Emergency and first aid supplies', 'Cross')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STEP 7: (Optional) Link Existing Products to Categories
-- =====================================================
-- This maps your existing products' category field to the new category_id

-- Update products with category 'medicines'
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'medicines')
WHERE category = 'medicines' AND category_id IS NULL;

-- Update products with category 'devices'
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'devices')
WHERE category = 'devices' AND category_id IS NULL;

-- Update products with category 'wellness'
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'wellness')
WHERE category = 'wellness' AND category_id IS NULL;

-- Update products with category 'personal-care'
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'personal-care')
WHERE category = 'personal-care' AND category_id IS NULL;

-- Update products with category 'baby-care'
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'baby-care')
WHERE category = 'baby-care' AND category_id IS NULL;

-- Update products with category 'first-aid'
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'first-aid')
WHERE category = 'first-aid' AND category_id IS NULL;

-- =====================================================
-- STEP 8: Verify the Setup
-- =====================================================
-- Check categories count
SELECT 'Categories created: ' || COUNT(*)::TEXT as result FROM categories;

-- Check products linked to categories
SELECT 
    'Products linked to categories: ' || 
    COUNT(*)::TEXT || 
    ' out of ' || 
    (SELECT COUNT(*)::TEXT FROM products) || 
    ' total products' as result
FROM products 
WHERE category_id IS NOT NULL;

-- Show category breakdown
SELECT 
    c.name as category_name,
    COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.name;

-- =====================================================
-- DONE! 🎉
-- =====================================================
-- Your categories system is now set up!
-- You can now:
-- 1. Visit /admin/categories to manage categories
-- 2. Use the API to create/update/delete categories
-- 3. Assign products to categories
-- =====================================================
