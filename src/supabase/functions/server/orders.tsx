import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const orders = new Hono();

// Get all orders with optional filtering
orders.get('/', async (c) => {
  try {
    const status = c.req.query('status');
    const customerId = c.req.query('customerId');
    
    let query = supabase.from('orders').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (customerId) {
      query = query.eq('customer_id', customerId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /orders:', error);
    return errorResponse('Failed to fetch orders');
  }
});

// Get single order by ID
orders.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching order:', error);
      return errorResponse('Order not found', 404);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /orders/:id:', error);
    return errorResponse('Failed to fetch order');
  }
});

// Create new order
orders.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { customer_id, customer_name, customer_email, items, shipping_address, total } = body;
    
    if (!customer_name || !customer_email || !items || !shipping_address || total === undefined) {
      return errorResponse('Missing required fields', 400);
    }
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_id,
        customer_name,
        customer_email,
        items,
        shipping_address,
        total,
        status: 'pending',
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data, 201);
  } catch (error) {
    console.error('Exception in POST /orders:', error);
    return errorResponse('Failed to create order');
  }
});

// Update order status
orders.patch('/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status } = body;
    
    if (!status) {
      return errorResponse('Status is required', 400);
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating order status:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PATCH /orders/:id/status:', error);
    return errorResponse('Failed to update order status');
  }
});

// Update entire order
orders.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('orders')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating order:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PUT /orders/:id:', error);
    return errorResponse('Failed to update order');
  }
});

// Delete order
orders.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting order:', error);
      return errorResponse(error.message);
    }
    
    return successResponse({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Exception in DELETE /orders/:id:', error);
    return errorResponse('Failed to delete order');
  }
});

export default orders;
