import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";

const auth = new Hono();

// Get Supabase client
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Signup endpoint
auth.post("/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({
        success: false,
        error: "Email, password, and name are required",
      }, 400);
    }

    const supabase = getSupabaseAdmin();

    // Create user with admin client
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({
        success: false,
        error: error.message,
      }, 400);
    }

    // Create user record in users table
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: email,
          name: name,
          role: 'customer',
          created_at: new Date().toISOString(),
        },
      ]);

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Don't fail the signup if database insert fails, user is already created
    }

    return c.json({
      success: true,
      message: "User created successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
      },
    });
  } catch (error: any) {
    console.error('Signup endpoint error:', error);
    return c.json({
      success: false,
      error: error.message || "Failed to create user",
    }, 500);
  }
});

// Get current user info (requires authentication)
auth.get("/me", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log('Auth header received:', authHeader ? 'Present' : 'Missing');
    
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      console.log('No access token found in Authorization header');
      return c.json({
        success: false,
        error: "No authorization token provided",
      }, 401);
    }

    console.log('Access token:', accessToken.substring(0, 20) + '...');

    const supabase = getSupabaseAdmin();

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    console.log('GetUser result:', { userId: user?.id, error: error?.message });

    if (error || !user) {
      console.log('User validation failed:', error?.message);
      return c.json({
        success: false,
        error: "Unauthorized",
      }, 401);
    }

    // Get user details from database
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError) {
      console.error('Database query error:', dbError);
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        ...userData,
      },
    });
  } catch (error: any) {
    console.error('Get user endpoint error:', error);
    return c.json({
      success: false,
      error: error.message || "Failed to get user info",
    }, 500);
  }
});

// Logout endpoint
auth.post("/logout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({
        success: false,
        error: "No authorization token provided",
      }, 401);
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      console.error('Logout error:', error);
      return c.json({
        success: false,
        error: error.message,
      }, 400);
    }

    return c.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error('Logout endpoint error:', error);
    return c.json({
      success: false,
      error: error.message || "Failed to logout",
    }, 500);
  }
});

export default auth;