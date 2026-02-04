import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const appointments = new Hono();

// Get all appointments with optional filtering
appointments.get('/', async (c) => {
  try {
    const status = c.req.query('status');
    const doctorId = c.req.query('doctorId');
    const patientId = c.req.query('patientId');
    const date = c.req.query('date');
    
    let query = supabase.from('appointments').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }
    
    if (date) {
      query = query.eq('appointment_date', date);
    }
    
    const { data, error } = await query.order('appointment_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /appointments:', error);
    return errorResponse('Failed to fetch appointments');
  }
});

// Get single appointment by ID
appointments.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching appointment:', error);
      return errorResponse('Appointment not found', 404);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /appointments/:id:', error);
    return errorResponse('Failed to fetch appointment');
  }
});

// Create new appointment
appointments.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      patient_id,
      patient_name,
      patient_email,
      patient_phone,
      doctor_id,
      doctor_name,
      appointment_date,
      appointment_time,
      symptoms,
      notes,
    } = body;
    
    if (!patient_name || !patient_email || !doctor_id || !appointment_date || !appointment_time) {
      return errorResponse('Missing required fields', 400);
    }
    
    // Check if the time slot is available
    const { data: existing, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', appointment_date)
      .eq('appointment_time', appointment_time)
      .in('status', ['pending', 'confirmed'])
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking availability:', checkError);
      return errorResponse('Failed to check availability');
    }
    
    if (existing) {
      return errorResponse('This time slot is already booked', 409);
    }
    
    // Generate appointment number
    const appointmentNumber = `APT-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        appointment_number: appointmentNumber,
        patient_id,
        patient_name,
        patient_email,
        patient_phone,
        doctor_id,
        doctor_name,
        appointment_date,
        appointment_time,
        symptoms,
        notes,
        status: 'pending',
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data, 201);
  } catch (error) {
    console.error('Exception in POST /appointments:', error);
    return errorResponse('Failed to create appointment');
  }
});

// Update appointment status
appointments.patch('/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status } = body;
    
    if (!status) {
      return errorResponse('Status is required', 400);
    }
    
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating appointment status:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PATCH /appointments/:id/status:', error);
    return errorResponse('Failed to update appointment status');
  }
});

// Update entire appointment
appointments.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('appointments')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating appointment:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PUT /appointments/:id:', error);
    return errorResponse('Failed to update appointment');
  }
});

// Cancel appointment
appointments.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Soft delete by setting status to cancelled
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error cancelling appointment:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in DELETE /appointments/:id:', error);
    return errorResponse('Failed to cancel appointment');
  }
});

export default appointments;
