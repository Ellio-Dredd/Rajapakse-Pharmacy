import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const products = new Hono();

// Get all products with optional filtering
products.get('/', async (c) => {
  try {
    const category = c.req.query('category');
    const categoryId = c.req.query('category_id');
    const search = c.req.query('search');
    const minPrice = c.req.query('minPrice');
    const maxPrice = c.req.query('maxPrice');
    
    // Check if categories table exists by attempting a simple query
    let categoriesExist = false;
    try {
      const { error: checkError } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      categoriesExist = !checkError;
    } catch (e) {
      categoriesExist = false;
    }
    
    // Build query with optional category join
    let query = supabase.from('products').select('*');
    
    // Only join categories if the table exists and has proper relationship
    if (categoriesExist) {
      try {
        query = supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name, slug, icon)
          `);
      } catch (e) {
        // Fall back to basic query if join fails
        console.log('Categories join not available, using basic query');
        query = supabase.from('products').select('*');
      }
    }
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    } else if (category) {
      // Support both category_id and legacy category field
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /products:', error);
    return errorResponse('Failed to fetch products');
  }
});

// Get single product by ID
products.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return errorResponse('Product not found', 404);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /products/:id:', error);
    return errorResponse('Failed to fetch product');
  }
});

// Create new product
products.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { name, category, category_id, price, stock, description, image_url, sku, requires_prescription } = body;
    
    if (!name || price === undefined || stock === undefined) {
      return errorResponse('Missing required fields: name, price, stock', 400);
    }
    
    // Build the insert object dynamically
    const insertData: any = {
      name,
      price,
      stock,
      description: description || null,
      image: image_url || null,
      sku: sku || null,
      requires_prescription: requires_prescription || false,
    };
    
    // Add category_id if provided
    if (category_id) {
      insertData.category_id = category_id;
    }
    
    // Add legacy category field if provided (for backwards compatibility)
    if (category) {
      insertData.category = category;
    } else if (!category_id) {
      // If neither category nor category_id is provided, use a default
      insertData.category = 'Uncategorized';
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([insertData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data, 201);
  } catch (error) {
    console.error('Exception in POST /products:', error);
    return errorResponse('Failed to create product');
  }
});

// Update product
products.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { name, category, category_id, price, stock, description, image_url, sku, requires_prescription } = body;
    
    // Build the update object dynamically
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image = image_url;
    if (sku !== undefined) updateData.sku = sku;
    if (requires_prescription !== undefined) updateData.requires_prescription = requires_prescription;
    
    // Handle category fields
    if (category_id !== undefined) {
      updateData.category_id = category_id;
    }
    
    if (category !== undefined) {
      updateData.category = category;
    } else if (category_id && !category) {
      // If category_id is provided but category is not, set a default
      updateData.category = 'General';
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PUT /products/:id:', error);
    return errorResponse('Failed to update product');
  }
});

// Delete product
products.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return errorResponse(error.message);
    }
    
    return successResponse({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Exception in DELETE /products/:id:', error);
    return errorResponse('Failed to delete product');
  }
});

export default products;