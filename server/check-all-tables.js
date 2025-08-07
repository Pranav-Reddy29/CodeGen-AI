const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = 'https://kflqfwezexgvztqthrqn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbHFmd2V6ZXhndnp0cXRocnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzg1NjQ3NywiZXhwIjoyMDY5NDMyNDc3fQ.bWoTxszQ0dVy68PdiYK_KCOnR5Q0BtN2dknPjP7FWdU';

async function checkAllTables() {
  try {
    console.log('🔍 Checking all tables in the database...');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check for all tables using a different approach
    console.log('\n📋 Checking for all tables...');
    
    // Try to get all tables using a direct query
    const { data: tables, error } = await supabase
      .rpc('get_all_tables');
    
    if (error) {
      console.log('Trying alternative method...');
      
      // Try to check common table names that might contain your data
      const possibleTables = [
        'users', 'projects', 'user', 'project', 'code_projects', 
        'user_projects', 'snippets', 'code_snippets', 'templates',
        'postgres_table_0', 'postgres_table_1', 'postgres_table_2', 'postgres_table_3'
      ];
      
      console.log('\n🔍 Checking for common table names...');
      
      for (const tableName of possibleTables) {
        try {
          const { data, error: tableError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (!tableError) {
            console.log(`✅ Table '${tableName}' exists`);
            
            // Get count of records
            const { count, error: countError } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });
            
            if (!countError) {
              console.log(`   📊 Contains ${count} records`);
              
              // If it has data, show a sample
              if (count > 0) {
                const { data: sample } = await supabase
                  .from(tableName)
                  .select('*')
                  .limit(1);
                
                console.log(`   📄 Sample record:`, sample[0]);
              }
            }
          }
        } catch (e) {
          // Table doesn't exist, continue
        }
      }
    } else {
      console.log('Available tables:', tables);
    }
    
    console.log('\n🎯 Summary:');
    console.log('- Current project URL: kflqfwezexgvztqthrqn.supabase.co');
    console.log('- This appears to be a fresh project with only test data');
    console.log('- Your original data is likely in a different Supabase project');
    
  } catch (error) {
    console.error('❌ Error checking tables:', error);
  }
}

checkAllTables(); 