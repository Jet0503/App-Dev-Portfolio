import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, currentPassword, newPassword } = body;
    
    if (!id || !currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    // Verify current password
    const contractor = await sql`SELECT password_hash FROM contractors WHERE id = ${id}`;
    
    if (contractor.length === 0) {
      return NextResponse.json({ success: false, error: 'Contractor not found' }, { status: 404 });
    }
    
    if (contractor[0].password_hash !== currentPassword) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });
    }
    
    // Update password
    await sql`UPDATE contractors SET password_hash = ${newPassword} WHERE id = ${id}`;
    
    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating contractor password:', error);
    return NextResponse.json({ success: false, error: 'Failed to update password' }, { status: 500 });
  }
}
