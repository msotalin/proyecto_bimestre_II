import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xeuhgsnqzlwehnmimejx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldWhnc25xemx3ZWhubWltZWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NDAxMzMsImV4cCI6MjA4MzIxNjEzM30.Yxdj6OWV8W-EDNwl-WJ-R2NxCF3B3cG8yY7wWaV8WEw";

export const supabase = createClient(supabaseUrl, supabaseKey);