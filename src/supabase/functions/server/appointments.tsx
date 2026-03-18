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
    
    // Select all fields from appointments table
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
    
    // Transform the data to include properly formatted fields for the frontend
    const transformedData = await Promise.all(data.map(async (appointment: any) => {
      // Try to fetch doctor details if doctor_id exists
      let doctorSpecialty = 'N/A';
      let doctorImage = null;
      
      if (appointment.doctor_id) {
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('specialty, image')
          .eq('id', appointment.doctor_id)
          .single();
        
        if (doctorData) {
          doctorSpecialty = doctorData.specialty || 'N/A';
          doctorImage = doctorData.image;
        }
      }
      
      return {
        ...appointment,
        patient: appointment.patient_name,
        patientEmail: appointment.patient_email,
        doctor: appointment.doctor_name,
        doctorSpecialty: doctorSpecialty,
        doctorImage: doctorImage,
        type: appointment.appointment_type || 'In-person',
      };
    }));
    
    return successResponse(transformedData);
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
    console.log('Received appointment creation request with body:', JSON.stringify(body, null, 2));
    
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
      console.error('Missing required fields:', { patient_name, patient_email, doctor_id, appointment_date, appointment_time });
      return errorResponse('Missing required fields', 400);
    }
    
    // Validate UUIDs if provided
    if (patient_id && typeof patient_id === 'string' && patient_id !== '' && !patient_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error('Invalid patient_id UUID format:', patient_id);
      return errorResponse('Invalid patient ID format', 400);
    }
    
    if (!doctor_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error('Invalid doctor_id UUID format:', doctor_id);
      return errorResponse('Invalid doctor ID format', 400);
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
    
    // Only include patient_id if it's a valid UUID
    const insertData: any = {
      appointment_number: appointmentNumber,
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
    };
    
    // Only add patient_id if it exists and is valid
    if (patient_id && patient_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      insertData.patient_id = patient_id;
    }
    
    console.log('Inserting appointment with data:', JSON.stringify(insertData, null, 2));
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([insertData])
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

// Permanently delete appointment
appointments.delete('/:id/permanent', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Hard delete - permanently remove from database
    const { data, error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error deleting appointment:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in DELETE /appointments/:id/permanent:', error);
    return errorResponse('Failed to delete appointment');
  }
});

export default appointments;