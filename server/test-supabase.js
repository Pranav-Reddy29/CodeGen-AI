const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = 'https://kflqfwezexgvztqthrqn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbHFmd2V6ZXhndnp0cXRocnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzg1NjQ3NywiZXhwIjoyMDY5NDMyNDc3fQ.bWoTxszQ0dVy68PdiYK_KCOnR5Q0BtN2dknPjP7FWdU';

async function testSupabaseConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test 1: Check if tables exist
    console.log('\n📋 Checking tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError);
    } else {
      console.log('✅ Available tables:', tables.map(t => t.table_name));
    }
    
    // Test 2: Check users table
    console.log('\n👥 Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Error checking users:', usersError);
    } else {
      console.log(`✅ Users table accessible. Found ${users.length} users.`);
      if (users.length > 0) {
        console.log('Sample user:', users[0]);
      }
    }
    
    // Test 3: Check projects table
    console.log('\n📁 Checking projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);
    
    if (projectsError) {
      console.error('❌ Error checking projects:', projectsError);
    } else {
      console.log(`✅ Projects table accessible. Found ${projects.length} projects.`);
      if (projects.length > 0) {
        console.log('Sample project:', projects[0]);
      }
    }
    
    // Test 4: Create a test user if none exist
    if (!users || users.length === 0) {
      console.log('\n➕ Creating test user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('testpassword123', 10);
      
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert([
          {
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword
          }
        ])
        .select()
        .single();
      
      if (createUserError) {
        console.error('❌ Error creating test user:', createUserError);
      } else {
        console.log('✅ Test user created:', newUser);
        
        // Create a test project
        console.log('\n➕ Creating test project...');
        const { data: newProject, error: createProjectError } = await supabase
          .from('projects')
          .insert([
            {
              user_id: newUser.id,
              name: 'Sample React App',
              description: 'A sample React application for testing',
              language: 'React',
              code: 'import React from "react";\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello World!</h1>\n    </div>\n  );\n}\n\nexport default App;',
              tags: ['sample', 'react']
            }
          ])
          .select()
          .single();
        
        if (createProjectError) {
          console.error('❌ Error creating test project:', createProjectError);
        } else {
          console.log('✅ Test project created:', newProject);
        }
      }
    }
    
    console.log('\n🎉 Supabase connection test completed!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testSupabaseConnection(); 