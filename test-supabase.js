const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hunytjesvkwkuitdkabk.supabase.co';
const supabaseKey = 'sb_publishable_UJQBNTaDkkwkMuxJnTW65w_Lx8S9vVI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Attempting signup...");
  const { data, error } = await supabase.auth.signUp({
    email: 'arjunk.patil2311@gmail.com',
    password: 'password123456'
  });
  
  if (error) {
    console.error("Error signing up:", error);
  } else {
    console.log("Success:", data);
  }
}

test();
