import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

// Session storage (in production, use Redis or database)
const sessions = new Map<string, { userId: number; email: string; expiresAt: number }>();

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Login endpoint
export async function POST(request: NextRequest) {
  try {
    const { email, password, type = 'user' } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    if (type === 'contractor') {
      // Contractor login
      const contractors = await sql`SELECT * FROM contractors WHERE email = ${email}`;
      
      if (contractors.length === 0) {
        return NextResponse.json({ success: false, error: 'Incorrect email or password' }, { status: 401 });
      }
      
      const contractor = contractors[0];
      
      // Verify password (plain text comparison for now, should use bcrypt in production)
      if (contractor.password_hash !== password) {
        return NextResponse.json({ success: false, error: 'Incorrect email or password' }, { status: 401 });
      }
      
      // Create session
      const sessionToken = generateSessionToken();
      const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
      sessions.set(sessionToken, { userId: contractor.id, email: contractor.email, expiresAt });
      
      const response = NextResponse.json({ 
        success: true, 
        user: {
          id: contractor.id,
          name: contractor.name,
          email: contractor.email,
          phone: contractor.phone,
          type: 'contractor'
        }
      });
      
      // Set session cookie
      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
      
      return response;
    } else {
      // User login
      const users = await sql`SELECT * FROM users WHERE email = ${email}`;
      
      if (users.length === 0) {
        return NextResponse.json({ success: false, error: 'Incorrect email or password' }, { status: 401 });
      }
      
      const user = users[0];
      
      // Verify password (plain text comparison for now, should use bcrypt in production)
      if (user.password_hash !== password) {
        return NextResponse.json({ success: false, error: 'Incorrect email or password' }, { status: 401 });
      }
      
      // Create session
      const sessionToken = generateSessionToken();
      const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
      sessions.set(sessionToken, { userId: user.id, email: user.email, expiresAt });
      
      const response = NextResponse.json({ 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          type: 'user'
        }
      });
      
      // Set session cookie
      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
      
      return response;
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}

// Get current session
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    const session = sessions.get(sessionToken);
    
    if (!session || session.expiresAt < Date.now()) {
      sessions.delete(sessionToken);
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }
    
    // Fetch user data
    const users = await sql`SELECT id, name, email, phone FROM users WHERE email = ${session.email}`;
    
    if (users.length > 0) {
      return NextResponse.json({ 
        success: true, 
        user: { ...users[0], type: 'user' }
      });
    }
    
    // Try contractor
    const contractors = await sql`SELECT id, name, email, phone FROM contractors WHERE email = ${session.email}`;
    
    if (contractors.length > 0) {
      return NextResponse.json({ 
        success: true, 
        user: { ...contractors[0], type: 'contractor' }
      });
    }
    
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ success: false, error: 'Failed to check session' }, { status: 500 });
  }
}

// Logout
export async function DELETE(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  
  if (sessionToken) {
    sessions.delete(sessionToken);
  }
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session');
  
  return response;
}
