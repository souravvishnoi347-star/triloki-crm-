const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ibjzwgbptgflsooenvwi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlianp3Z2JwdGdmbHNvb2VudndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNzE4NjksImV4cCI6MjA5ODY0Nzg2OX0.n_bK7pTp6YurmFvV1b8i4MGa9-sF_cxgWEb_-pXUtPQ');

async function test() {
  const payload = {
    name: 'Test Lead ' + Date.now(),
    phone: '1234567890',
    destination: 'Goa',
    budget: 1000,
    notes: 'Testing',
    status: 'new_inquiry'
  };

  const { data, error } = await supabase.from('leads').insert(payload).select();
  console.log('Insert Data:', data);
  console.log('Insert Error:', error);
}

test();
