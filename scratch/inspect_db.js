const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ccospiksyvpryxkexhxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjb3NwaWtzeXZwcnl4a2V4aHhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTA2Mjc2NywiZXhwIjoyMDk0NjM4NzY3fQ.u6SxR3py1Tdm8epN1-LvTj2P-AWT30qQQqCvHiJC3Jc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*');
    
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  
  data.forEach((row, i) => {
    console.log(`\nRow ${i+1}:`);
    console.log('ID:', row.id);
    console.log('User ID:', row.user_id);
    const days = typeof row.days === 'string' ? JSON.parse(row.days) : row.days;
    if (days && days.length > 0) {
      console.log('Day 1 activities type:', typeof days[0].activities[0]);
      console.log('Day 1 activities sample:', days[0].activities[0]);
    }
  });
  
  // Let's also check if there are profiles in the database
  const { data: profiles } = await supabase.from('profiles').select('id, email');
  console.log('\nProfiles in DB:', profiles);
}

main();
