import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const users = new Hono();

// Get all users with optional filtering
users.get('/', async (c) => {
  try {
    const role = c.req.query('role');
    const search = c.req.query('search');
    
    let query = supabase.from('users').select('*');
    
    if (role) {
      query = query.eq('role', role);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /users:', error);
    return errorResponse('Failed to fetch users');
  }
});

// Get single user by ID
users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return errorResponse('User not found', 404);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /users/:id:', error);
    return errorResponse('Failed to fetch user');
  }
});

// Get user by email
users.get('/email/:email', async (c) => {
  try {
    const email = c.req.param('email');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching user by email:', error);
      return errorResponse('User not found', 404);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /users/email/:email:', error);
    return errorResponse('Failed to fetch user');
  }
});

// Create new user
users.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, phone, role, address } = body;
    
    if (!email || !name) {
      return errorResponse('Missing required fields: email, name', 400);
    }
    
    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (existing) {
      return errorResponse('User with this email already exists', 409);
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email,
        name,
        phone,
        role: role || 'customer',
        address,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data, 201);
  } catch (error) {
    console.error('Exception in POST /users:', error);
    return errorResponse('Failed to create user');
  }
});

// Update user
users.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('users')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PUT /users/:id:', error);
    return errorResponse('Failed to update user');
  }
});

// Delete user
users.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting user:', error);
      return errorResponse(error.message);
    }
    
    return successResponse({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Exception in DELETE /users/:id:', error);
    return errorResponse('Failed to delete user');
  }
});

export default users;
