import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const categories = new Hono();

// Initialize categories table if it doesn't exist
async function ensureCategoriesTable() {
  try {
    // Check if table exists by trying to select from it
    const { error: checkError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.message.includes('does not exist')) {
      console.log('Categories table does not exist. Creating via RPC...');
      // Note: Table should be created via database seeding button
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking categories table:', error);
    return false;
  }
}

// Get all categories
categories.get('/', async (c) => {
  try {
    await ensureCategoriesTable();
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /categories:', error);
    return errorResponse('Failed to fetch categories');
  }
});

// Get single category by ID
categories.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching category:', error);
      return errorResponse('Category not found', 404);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /categories/:id:', error);
    return errorResponse('Failed to fetch category');
  }
});

// Get category with product count
categories.get('/:id/products', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Get category details
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (categoryError) {
      console.error('Error fetching category:', categoryError);
      return errorResponse('Category not found', 404);
    }
    
    // Get products for this category
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', id);
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      return errorResponse(productsError.message);
    }
    
    return successResponse({
      ...category,
      product_count: products?.length || 0,
      products: products || []
    });
  } catch (error) {
    console.error('Exception in GET /categories/:id/products:', error);
    return errorResponse('Failed to fetch category products');
  }
});

// Create new category
categories.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { name, description, slug, icon } = body;
    
    if (!name) {
      return errorResponse('Missing required field: name', 400);
    }
    
    // Generate slug if not provided
    const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name,
        description,
        slug: categorySlug,
        icon: icon || 'Package'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data, 201);
  } catch (error) {
    console.error('Exception in POST /categories:', error);
    return errorResponse('Failed to create category');
  }
});

// Update category
categories.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // Update slug if name is changed
    if (body.name && !body.slug) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    const { data, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating category:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PUT /categories/:id:', error);
    return errorResponse('Failed to update category');
  }
});

// Delete category
categories.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Check if category has products
    const { data: products, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);
    
    if (checkError) {
      console.error('Error checking category products:', checkError);
      return errorResponse(checkError.message);
    }
    
    if (products && products.length > 0) {
      return errorResponse('Cannot delete category with existing products. Please reassign or delete products first.', 400);
    }
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return errorResponse(error.message);
    }
    
    return successResponse({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Exception in DELETE /categories/:id:', error);
    return errorResponse('Failed to delete category');
  }
});

// Seed default categories
categories.post('/seed', async (c) => {
  try {
    const defaultCategories = [
      {
        name: 'Medicines',
        slug: 'medicines',
        description: 'Prescription and over-the-counter medicines',
        icon: 'Pill'
      },
      {
        name: 'Medical Devices',
        slug: 'devices',
        description: 'Healthcare and medical equipment',
        icon: 'Stethoscope'
      },
      {
        name: 'Wellness',
        slug: 'wellness',
        description: 'Health supplements and vitamins',
        icon: 'Heart'
      },
      {
        name: 'Personal Care',
        slug: 'personal-care',
        description: 'Personal hygiene and care products',
        icon: 'Droplet'
      },
      {
        name: 'Baby Care',
        slug: 'baby-care',
        description: 'Baby and mother care products',
        icon: 'Baby'
      },
      {
        name: 'First Aid',
        slug: 'first-aid',
        description: 'Emergency and first aid supplies',
        icon: 'Cross'
      }
    ];
    
    const { data, error } = await supabase
      .from('categories')
      .upsert(defaultCategories, { onConflict: 'slug' })
      .select();
    
    if (error) {
      console.error('Error seeding categories:', error);
      return errorResponse(error.message);
    }
    
    return successResponse({ 
      message: 'Categories seeded successfully',
      categories: data
    });
  } catch (error) {
    console.error('Exception in POST /categories/seed:', error);
    return errorResponse('Failed to seed categories');
  }
});

export default categories;
