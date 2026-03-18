-- =====================================================
-- Healthcare Platform Seed Data
-- =====================================================
-- Run this AFTER running 001_create_tables.sql
-- =====================================================

-- =====================================================
-- SEED CATEGORIES
-- =====================================================
INSERT INTO categories (name, slug, description, icon) VALUES
('Medicines', 'medicines', 'Prescription and over-the-counter medicines', 'Pill'),
('Medical Devices', 'devices', 'Healthcare and medical equipment', 'Stethoscope'),
('Wellness', 'wellness', 'Health supplements and vitamins', 'Heart'),
('Personal Care', 'personal-care', 'Personal hygiene and care products', 'Droplet'),
('Baby Care', 'baby-care', 'Baby and mother care products', 'Baby'),
('First Aid', 'first-aid', 'Emergency and first aid supplies', 'Cross')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED PRODUCTS
-- =====================================================
INSERT INTO products (name, category, price, stock, description, image, requires_prescription, rating, reviews) VALUES
('Paracetamol 500mg - 20 Tablets', 'medicines', 5.99, 245, 'Effective pain reliever and fever reducer. Take as directed by physician.', 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?w=400', false, 4.5, 234),
('Digital Blood Pressure Monitor', 'devices', 49.99, 56, 'Accurate digital blood pressure monitor with large display and memory function.', 'https://images.unsplash.com/photo-1763070282912-08b63e2eb427?w=400', false, 4.8, 156),
('Amoxicillin 250mg - 30 Capsules', 'medicines', 12.99, 12, 'Antibiotic used to treat bacterial infections. Requires valid prescription.', 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?w=400', true, 4.7, 145),
('Multivitamin Complex - 60 Capsules', 'wellness', 24.99, 189, 'Complete daily multivitamin with essential vitamins and minerals.', 'https://images.unsplash.com/photo-1768403305881-a7a82fd63512?w=400', false, 4.6, 389),
('Hand Sanitizer 500ml', 'personal-care', 8.99, 342, '70% alcohol-based hand sanitizer. Kills 99.9% of germs.', 'https://images.unsplash.com/photo-1760184762833-7c6bd9ef1415?w=400', false, 4.4, 567),
('Infrared Thermometer', 'devices', 34.99, 78, 'Non-contact infrared thermometer with quick and accurate readings.', 'https://images.unsplash.com/photo-1763070282912-08b63e2eb427?w=400', false, 4.5, 223),
('Omega-3 Fish Oil 1000mg', 'wellness', 19.99, 156, 'Premium quality fish oil with EPA and DHA for heart health.', 'https://images.unsplash.com/photo-1768403305881-a7a82fd63512?w=400', false, 4.8, 412),
('Face Masks - Box of 50', 'personal-care', 14.99, 423, '3-layer disposable face masks for everyday protection.', 'https://images.unsplash.com/photo-1760184762833-7c6bd9ef1415?w=400', false, 4.3, 689);

-- =====================================================
-- SEED DOCTORS
-- =====================================================
INSERT INTO doctors (name, specialization, experience, image, education, languages, about, rating, reviews, available, category) VALUES
('Dr. Michael Chen', 'Cardiologist', 15, 'https://images.unsplash.com/photo-1632054226038-ed6997bfce1f?w=400', 
 '["MD - Harvard Medical School", "Fellowship in Cardiology - Johns Hopkins", "Board Certified - American Board of Internal Medicine"]'::jsonb,
 '["English", "Mandarin", "Spanish"]'::jsonb,
 'Dr. Michael Chen is a highly experienced cardiologist with over 15 years of practice. He specializes in treating various heart conditions and is known for his patient-centered approach to care.',
 4.9, 324, true, 'cardiology'),

('Dr. Sarah Williams', 'Pediatrician', 12, 'https://images.unsplash.com/photo-1632054224477-c9cb3aae1b7e?w=400',
 '["MD - Stanford University", "Pediatric Residency - Children''s Hospital Boston", "Board Certified Pediatrician"]'::jsonb,
 '["English", "French"]'::jsonb,
 'Dr. Williams is passionate about providing comprehensive care for children from infancy through adolescence. She has a special interest in developmental pediatrics.',
 4.8, 267, true, 'pediatrics'),

('Dr. James Anderson', 'General Physician', 20, 'https://images.unsplash.com/photo-1575654402720-0af3480d1fad?w=400',
 '["MD - Yale School of Medicine", "Internal Medicine Residency - Mayo Clinic", "Board Certified - Internal Medicine"]'::jsonb,
 '["English"]'::jsonb,
 'Dr. Anderson has two decades of experience in family medicine. He focuses on preventive care and managing chronic conditions.',
 4.7, 512, true, 'general'),

('Dr. Emily Rodriguez', 'Dermatologist', 10, 'https://images.unsplash.com/photo-1632054224477-c9cb3aae1b7e?w=400',
 '["MD - Columbia University", "Dermatology Residency - NYU Langone", "Board Certified Dermatologist"]'::jsonb,
 '["English", "Spanish"]'::jsonb,
 'Dr. Rodriguez specializes in medical and cosmetic dermatology, with expertise in treating various skin conditions.',
 4.9, 198, true, 'dermatology'),

('Dr. Robert Kim', 'Orthopedic Surgeon', 18, 'https://images.unsplash.com/photo-1632054226038-ed6997bfce1f?w=400',
 '["MD - University of Pennsylvania", "Orthopedic Surgery Residency - Hospital for Special Surgery", "Sports Medicine Fellowship"]'::jsonb,
 '["English", "Korean"]'::jsonb,
 'Dr. Kim is an experienced orthopedic surgeon specializing in sports injuries and joint replacement surgery.',
 4.8, 445, false, 'orthopedics'),

('Dr. Lisa Martinez', 'Neurologist', 14, 'https://images.unsplash.com/photo-1632054224477-c9cb3aae1b7e?w=400',
 '["MD - Duke University", "Neurology Residency - Cleveland Clinic", "Board Certified Neurologist"]'::jsonb,
 '["English", "Spanish", "Portuguese"]'::jsonb,
 'Dr. Martinez specializes in diagnosing and treating disorders of the nervous system, with a focus on headache disorders and epilepsy.',
 4.9, 289, true, 'neurology');

-- =====================================================
-- SEED SAMPLE USERS
-- =====================================================
INSERT INTO users (email, name, phone, role, address) VALUES
('john.doe@example.com', 'John Doe', '+1 (555) 123-4567', 'customer', '123 Main St, New York, NY 10001'),
('jane.smith@example.com', 'Jane Smith', '+1 (555) 234-5678', 'customer', '456 Oak Ave, Boston, MA 02101'),
('admin@healthcare.com', 'Admin User', '+1 (555) 000-0000', 'admin', 'Healthcare+ HQ');

-- =====================================================
-- SEED SAMPLE ORDERS
-- =====================================================
INSERT INTO orders (order_number, customer_id, customer_name, customer_email, items, shipping_address, total, status, created_at) VALUES
('ORD-1707052001', 
 (SELECT id FROM users WHERE email = 'john.doe@example.com'),
 'John Doe', 
 'john.doe@example.com',
 '[{"id": "prod-1", "name": "Paracetamol 500mg - 20 Tablets", "quantity": 2, "price": 5.99}, {"id": "prod-2", "name": "Digital Blood Pressure Monitor", "quantity": 1, "price": 49.99}]'::jsonb,
 '123 Main St, New York, NY 10001',
 61.97,
 'completed',
 NOW() - INTERVAL '2 days'),

('ORD-1707052002',
 (SELECT id FROM users WHERE email = 'jane.smith@example.com'),
 'Jane Smith',
 'jane.smith@example.com',
 '[{"id": "prod-4", "name": "Multivitamin Complex - 60 Capsules", "quantity": 2, "price": 24.99}, {"id": "prod-7", "name": "Omega-3 Fish Oil 1000mg", "quantity": 1, "price": 19.99}]'::jsonb,
 '456 Oak Ave, Boston, MA 02101',
 69.97,
 'processing',
 NOW() - INTERVAL '1 day');

-- =====================================================
-- SEED SAMPLE APPOINTMENTS
-- =====================================================
INSERT INTO appointments (appointment_number, patient_id, patient_name, patient_email, patient_phone, doctor_id, doctor_name, appointment_date, appointment_time, symptoms, notes, status, created_at) VALUES
('APT-1707052001',
 (SELECT id FROM users WHERE email = 'john.doe@example.com'),
 'John Doe',
 'john.doe@example.com',
 '+1 (555) 123-4567',
 (SELECT id FROM doctors WHERE name = 'Dr. Michael Chen'),
 'Dr. Michael Chen',
 '2026-02-05',
 '09:00:00',
 'Chest pain and shortness of breath',
 'Patient reports symptoms for the past 3 days',
 'confirmed',
 NOW() - INTERVAL '3 days'),

('APT-1707052002',
 (SELECT id FROM users WHERE email = 'jane.smith@example.com'),
 'Jane Smith',
 'jane.smith@example.com',
 '+1 (555) 234-5678',
 (SELECT id FROM doctors WHERE name = 'Dr. Sarah Williams'),
 'Dr. Sarah Williams',
 '2026-02-06',
 '10:30:00',
 'Child has fever and cough',
 'Appointment for 5-year-old daughter',
 'pending',
 NOW() - INTERVAL '1 day');

-- =====================================================
-- VERIFY SEED DATA
-- =====================================================
SELECT 'Products seeded: ' || COUNT(*)::TEXT FROM products;
SELECT 'Doctors seeded: ' || COUNT(*)::TEXT FROM doctors;
SELECT 'Users seeded: ' || COUNT(*)::TEXT FROM users;
SELECT 'Orders seeded: ' || COUNT(*)::TEXT FROM orders;
SELECT 'Appointments seeded: ' || COUNT(*)::TEXT FROM appointments;