// Test Supabase Connection
// Run this in browser console to test your Supabase connection

import { supabase } from './src/lib/supabaseClient';

async function testConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  // Test 1: Check categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*');
  
  if (catError) {
    console.error('❌ Categories error:', catError);
  } else {
    console.log('✅ Categories:', categories);
  }
  
  // Test 2: Check products
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*, category:categories(*)');
  
  if (prodError) {
    console.error('❌ Products error:', prodError);
  } else {
    console.log('✅ Products:', products);
  }
  
  // Test 3: Check connection
  const { data, error } = await supabase.from('categories').select('count');
  if (error) {
    console.error('❌ Connection error:', error.message);
    console.log('Possible issues:');
    console.log('1. Database tables not created');
    console.log('2. RLS policies blocking access');
    console.log('3. Invalid credentials');
  } else {
    console.log('✅ Connection successful');
  }
}

testConnection();
