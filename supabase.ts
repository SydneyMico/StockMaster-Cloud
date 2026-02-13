
import { createClient } from '@supabase/supabase-js';

// Verified connection parameters
const supabaseUrl = 'https://isehhrtbccfllbnmocoy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZWhocnRiY2NmbGxibm1vY295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTI2MDAsImV4cCI6MjA4NDU2ODYwMH0.a3wD6scbjSqIj_d6PHquZcB7o6wKDd77HBwsZcNP4Kc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
