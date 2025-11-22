import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // عرض الخطأ في التطبيق بدلاً من رميه مباشرة في المستوى الأعلى (top level)
    console.error('Supabase URL and Anon Key must be provided in environment variables.');
    // يمكن استخدام طريقة بديلة مثل إرجاع كائن غير وظيفي أو استخدام كائن mock
    // لكن الأفضل هو ترك الخطأ كما هو للسماح بالتعطيل المبكر في بيئة التطوير
    // وتنبيه المطور
    // For Production: You might want a softer fail, but in development, this is correct.
    toast.error('Supabase keys are missing. Payment and Auth features are disabled.');
    // A mock client or throwing an error is appropriate here. Let's keep the throw but clarify.
    throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)