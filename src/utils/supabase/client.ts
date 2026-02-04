import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Database types for TypeScript (optional but recommended)
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  requires_prescription: boolean;
  created_at: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  rating: number;
  consultation_fee: number;
  image_url: string;
  available_days: string[];
  available_hours: string;
  created_at: string;
};

export type Appointment = {
  id: string;
  user_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  shipping_address: string;
  created_at: string;
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  created_at: string;
};

export type Prescription = {
  id: string;
  user_id: string;
  image_url: string;
  status: string;
  notes: string;
  created_at: string;
};
