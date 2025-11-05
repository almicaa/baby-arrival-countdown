import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sqjjlvmdfsagklkplwdk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxampsdm1kZnNhZ2tsa3Bsd2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzgxMTgsImV4cCI6MjA3NzkxNDExOH0.D6RQsAbInvkRhiYTDRtZtS8z8Ze4pySRJclLZruZzTU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
