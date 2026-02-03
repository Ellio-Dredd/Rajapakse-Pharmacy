import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const products = new Hono();

// Get all products with optional filtering
products.get('/', async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    const minPrice = c.req.query('minPrice');
    const maxPrice = c.req.query('maxPrice');
    
    let query = supabase.from('products').select('*');
    
    if (category) {
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
    const { name, category, price, stock, description, image, requires_prescription } = body;
    
    if (!name || !category || price === undefined || stock === undefined) {
      return errorResponse('Missing required fields: name, category, price, stock', 400);
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        category,
        price,
        stock,
        description,
        image,
        requires_prescription: requires_prescription || false,
      }])
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
    
    const { data, error } = await supabase
      .from('products')
      .update(body)
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
