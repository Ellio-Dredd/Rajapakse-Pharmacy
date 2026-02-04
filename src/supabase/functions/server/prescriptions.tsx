import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const prescriptions = new Hono();

// Get all prescriptions with optional filtering
prescriptions.get('/', async (c) => {
  try {
    const status = c.req.query('status');
    const patientId = c.req.query('patientId');
    
    let query = supabase.from('prescriptions').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching prescriptions:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /prescriptions:', error);
    return errorResponse('Failed to fetch prescriptions');
  }
});

// Get single prescription by ID
prescriptions.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching prescription:', error);
      return errorResponse('Prescription not found', 404);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in GET /prescriptions/:id:', error);
    return errorResponse('Failed to fetch prescription');
  }
});

// Submit prescription
prescriptions.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      patient_id,
      patient_name,
      patient_email,
      patient_phone,
      patient_age,
      address,
      notes,
      files,
    } = body;
    
    if (!patient_name || !patient_email || !files || files.length === 0) {
      return errorResponse('Missing required fields: patient_name, patient_email, files', 400);
    }
    
    // Generate prescription number
    const prescriptionNumber = `RX-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([{
        prescription_number: prescriptionNumber,
        patient_id,
        patient_name,
        patient_email,
        patient_phone,
        patient_age,
        address,
        notes,
        files,
        status: 'pending',
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting prescription:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data, 201);
  } catch (error) {
    console.error('Exception in POST /prescriptions:', error);
    return errorResponse('Failed to submit prescription');
  }
});

// Update prescription status
prescriptions.patch('/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status } = body;
    
    if (!status) {
      return errorResponse('Status is required', 400);
    }
    
    const { data, error } = await supabase
      .from('prescriptions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating prescription status:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PATCH /prescriptions/:id/status:', error);
    return errorResponse('Failed to update prescription status');
  }
});

// Update entire prescription
prescriptions.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('prescriptions')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating prescription:', error);
      return errorResponse(error.message);
    }
    
    return successResponse(data);
  } catch (error) {
    console.error('Exception in PUT /prescriptions/:id:', error);
    return errorResponse('Failed to update prescription');
  }
});

// Delete prescription
prescriptions.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting prescription:', error);
      return errorResponse(error.message);
    }
    
    return successResponse({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Exception in DELETE /prescriptions/:id:', error);
    return errorResponse('Failed to delete prescription');
  }
});

export default prescriptions;
