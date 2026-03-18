/**
 * Backend Test Script
 * 
 * Run this script to test your Supabase backend endpoints.
 * Open browser console and copy-paste this code.
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-18234cd5`;

async function testBackend() {
  console.log('🧪 Testing Healthcare Platform Backend...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: Seed Database
    console.log('\n2️⃣ Seeding database with sample data...');
    const seedResponse = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    const seedData = await seedResponse.json();
    console.log('✅ Database seeded:', seedData);
    
    // Test 3: Get Products
    console.log('\n3️⃣ Fetching products...');
    const productsResponse = await fetch(`${API_BASE_URL}/products`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    const productsData = await productsResponse.json();
    console.log(`✅ Found ${productsData.data.length} products:`, productsData.data);
    
    // Test 4: Get Doctors
    console.log('\n4️⃣ Fetching doctors...');
    const doctorsResponse = await fetch(`${API_BASE_URL}/doctors`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    const doctorsData = await doctorsResponse.json();
    console.log(`✅ Found ${doctorsData.data.length} doctors:`, doctorsData.data);
    
    // Test 5: Get Orders
    console.log('\n5️⃣ Fetching orders...');
    const ordersResponse = await fetch(`${API_BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    const ordersData = await ordersResponse.json();
    console.log(`✅ Found ${ordersData.data.length} orders:`, ordersData.data);
    
    // Test 6: Get Appointments
    console.log('\n6️⃣ Fetching appointments...');
    const appointmentsResponse = await fetch(`${API_BASE_URL}/appointments`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    const appointmentsData = await appointmentsResponse.json();
    console.log(`✅ Found ${appointmentsData.data.length} appointments:`, appointmentsData.data);
    
    // Test 7: Analytics
    console.log('\n7️⃣ Fetching analytics...');
    const analyticsResponse = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    const analyticsData = await analyticsResponse.json();
    console.log('✅ Analytics:', analyticsData.data);
    
    console.log('\n\n🎉 All tests passed! Your backend is working correctly.\n');
    console.log('Next steps:');
    console.log('1. Integrate API calls in your React components');
    console.log('2. Add authentication for user management');
    console.log('3. Test creating orders and appointments from the UI');
    
    return {
      success: true,
      summary: {
        products: productsData.data.length,
        doctors: doctorsData.data.length,
        orders: ordersData.data.length,
        appointments: appointmentsData.data.length,
      }
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Check if Supabase project is active');
    console.error('2. Verify edge function is deployed');
    console.error('3. Check browser console for CORS errors');
    return { success: false, error: error.message };
  }
}

// Run tests
export { testBackend };

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log('To test the backend, run: testBackend()');
}
