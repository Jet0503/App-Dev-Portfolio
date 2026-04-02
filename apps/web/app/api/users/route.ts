import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();
    
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }
    
    // Check if email already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 400 });
    }
    
    // Create user (storing password as plain text for now - should use bcrypt in production)
    const result = await sql`
      INSERT INTO users (name, email, phone, password_hash)
      VALUES (${name}, ${email}, ${phone}, ${password})
      RETURNING id, name, email, phone, created_at
    `;
    
    return NextResponse.json({ success: true, user: result[0] });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const users = await sql`SELECT id, name, email, phone, created_at FROM users WHERE id = ${id}`;
      if (users.length === 0) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, user: users[0] });
    }
    
    const users = await sql`SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC`;
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}
