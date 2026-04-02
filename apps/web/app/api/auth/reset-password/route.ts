import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

// Temporary storage for reset tokens (in production, use database)
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

function generateResetToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Request password reset
export async function POST(request: NextRequest) {
  try {
    const { email, type = 'user' } = await request.json();
    
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    
    // Check if user/contractor exists
    let exists = false;
    if (type === 'contractor') {
      const contractors = await sql`SELECT id FROM contractors WHERE email = ${email}`;
      exists = contractors.length > 0;
    } else {
      const users = await sql`SELECT id FROM users WHERE email = ${email}`;
      exists = users.length > 0;
    }
    
    if (!exists) {
      // Don't reveal if email exists for security
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }
    
    // Generate reset token
    const resetToken = generateResetToken();
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour
    resetTokens.set(resetToken, { email, expiresAt });
    
    // In production, send email with reset link
    // For now, just return the token (in production this would be emailed)
    console.log(`Reset token for ${email}: ${resetToken}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.',
      // Remove this in production - only for development
      resetToken 
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}

// Confirm password reset
export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword, type = 'user' } = await request.json();
    
    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: 'Token and new password are required' }, { status: 400 });
    }
    
    const resetData = resetTokens.get(token);
    
    if (!resetData || resetData.expiresAt < Date.now()) {
      resetTokens.delete(token);
      return NextResponse.json({ success: false, error: 'Invalid or expired reset token' }, { status: 400 });
    }
    
    // Update password
    if (type === 'contractor') {
      await sql`UPDATE contractors SET password_hash = ${newPassword} WHERE email = ${resetData.email}`;
    } else {
      await sql`UPDATE users SET password_hash = ${newPassword} WHERE email = ${resetData.email}`;
    }
    
    // Delete used token
    resetTokens.delete(token);
    
    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ success: false, error: 'Failed to reset password' }, { status: 500 });
  }
}
