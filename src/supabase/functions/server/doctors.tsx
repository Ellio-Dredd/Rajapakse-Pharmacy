import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const doctors = new Hono();

// Get all doctors with optional filtering
doctors.get('/', async (c) => {
  try {
    const specialization = c.req.query('specialization');
    const category = c.req.query('category');
    const available = c.req.query('available');
    const search = c.req.query('search');
    
    let query = supabase.from('doctors').select('*');
    
    if (specialization) {
      query = query.eq('specialization', specialization);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (available !== undefined) {
      query = query.eq('available', available === 'true');
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,specialization.ilike.%${search}%,about.ilike.%${search}%`);
    }
    
    const { data, error } = await query.order('rating', { ascending: false });
    
    if (error) {
      console.error('Error fetching doctors:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /doctors:', error);
    return errorResponse('Failed to fetch doctors');
  }
});

// Get single doctor by ID
doctors.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching doctor:', error);
      return errorResponse('Doctor not found', 404);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /doctors/:id:', error);
    return errorResponse('Failed to fetch doctor');
  }
});

// Create new doctor
doctors.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { name, specialization, experience, image, education, languages, about, category } = body;
    
    if (!name || !specialization || experience === undefined) {
      return errorResponse('Missing required fields: name, specialization, experience', 400);
    }
    
    const { data, error } = await supabase
      .from('doctors')
      .insert([{
        name,
        specialization,
        experience,
        image,
        education: education || [],
        languages: languages || [],
        about,
        category,
        rating: 0,
        reviews: 0,
        available: true,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating doctor:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data, 201);
  } catch (error) {
    console.error('Exception in POST /doctors:', error);
    return errorResponse('Failed to create doctor');
  }
});

// Update doctor
doctors.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('doctors')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating doctor:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PUT /doctors/:id:', error);
    return errorResponse('Failed to update doctor');
  }
});

// Delete doctor
doctors.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting doctor:', error);
      return errorResponse(error.message);
    }
    
    return successResponse({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Exception in DELETE /doctors/:id:', error);
    return errorResponse('Failed to delete doctor');
  }
});

// Get doctor availability
doctors.get('/:id/availability', async (c) => {
  try {
    const id = c.req.param('id');
    const date = c.req.query('date');
    
    if (!date) {
      return errorResponse('Date parameter is required', 400);
    }
    
    // Get all appointments for this doctor on the specified date
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('doctor_id', id)
      .eq('appointment_date', date)
      .in('status', ['pending', 'confirmed']);
    
    if (error) {
      console.error('Error fetching availability:', error);
      return errorResponse(error.message);
    }
    
    // Extract booked times
    const bookedTimes = appointments.map(apt => apt.appointment_time);
    
    return successResponse({ date, bookedTimes });
  } catch (error) {
    console.error('Exception in GET /doctors/:id/availability:', error);
    return errorResponse('Failed to fetch availability');
  }
});

export default doctors;
