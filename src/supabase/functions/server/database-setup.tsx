import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const databaseSetup = new Hono();

// Setup categories table and add category_id to products
databaseSetup.post('/setup-categories', async (c) => {
  try {
    console.log('Setting up categories table...');
    
    // Step 1: Create categories table using raw SQL
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT DEFAULT 'Package',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
    `;
    
    const { error: createTableError } = await supabase.rpc('exec_sql', { 
      sql: createCategoriesTable 
    });
    
    // If RPC doesn't work, try direct approach
    if (createTableError) {
      console.log('RPC approach failed, categories table may already exist or needs manual creation');
    }
    
    // Step 2: Add category_id column to products table if it doesn't exist
    const alterProductsTable = `
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'products' AND column_name = 'category_id'
        ) THEN
          ALTER TABLE products ADD COLUMN category_id UUID;
          CREATE INDEX idx_products_category_id ON products(category_id);
        END IF;
      END $$;
    `;
    
    const { error: alterError } = await supabase.rpc('exec_sql', { 
      sql: alterProductsTable 
    });
    
    if (alterError) {
      console.log('Alter table may have failed, column might already exist');
    }
    
    // Step 3: Add foreign key constraint
    const addForeignKey = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'products_category_id_fkey'
        ) THEN
          ALTER TABLE products 
          ADD CONSTRAINT products_category_id_fkey 
          FOREIGN KEY (category_id) 
          REFERENCES categories(id) 
          ON DELETE SET NULL;
        END IF;
      END $$;
    `;
    
    const { error: fkError } = await supabase.rpc('exec_sql', { 
      sql: addForeignKey 
    });
    
    if (fkError) {
      console.log('Foreign key constraint may already exist');
    }
    
    // Step 4: Verify tables exist
    const { data: categoriesCheck, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);
    
    if (checkError) {
      return errorResponse(
        'Categories table setup incomplete. Please create the table manually using the SQL provided in the documentation.',
        500
      );
    }
    
    return successResponse({
      message: 'Categories table setup completed successfully',
      instructions: 'You can now use the "Seed Categories" button to add default categories'
    });
    
  } catch (error) {
    console.error('Exception in database setup:', error);
    return errorResponse('Database setup failed. Manual table creation may be required.');
  }
});

// Get setup SQL for manual execution
databaseSetup.get('/setup-sql', async (c) => {
  const sql = `
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Package',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Add category_id column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID;

-- Create index on category_id
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Add foreign key constraint
ALTER TABLE products 
ADD CONSTRAINT IF NOT EXISTS products_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES categories(id) 
ON DELETE SET NULL;

-- Seed default categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Medicines', 'medicines', 'Prescription and over-the-counter medicines', 'Pill'),
  ('Medical Devices', 'devices', 'Healthcare and medical equipment', 'Stethoscope'),
  ('Wellness', 'wellness', 'Health supplements and vitamins', 'Heart'),
  ('Personal Care', 'personal-care', 'Personal hygiene and care products', 'Droplet'),
  ('Baby Care', 'baby-care', 'Baby and mother care products', 'Baby'),
  ('First Aid', 'first-aid', 'Emergency and first aid supplies', 'Cross')
ON CONFLICT (slug) DO NOTHING;
`;
  
  return c.text(sql, 200, {
    'Content-Type': 'text/plain',
  });
});

export default databaseSetup;
