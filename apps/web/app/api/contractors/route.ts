import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let contractors;
    if (category) {
      contractors = await sql`SELECT * FROM contractors WHERE category = ${category} ORDER BY tier DESC, name ASC`;
    } else {
      contractors = await sql`SELECT * FROM contractors ORDER BY category, tier DESC, name ASC`;
    }
    
    return NextResponse.json(contractors);
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contractors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company_name, category, phone, email, experience_years, location, document_url, password, user_id } = body;
    
    if (!name || !category || !phone || !experience_years || !password || !user_id) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if user already has a contractor profile
    const existing = await sql`SELECT id FROM contractors WHERE user_id = ${user_id}`;
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'You already have a contractor profile. Each user can only create one contractor profile.' }, { status: 400 });
    }
    
    // Auto-calculate tier based on years of experience
    const years = parseInt(experience_years);
    let tier: string;
    if (years < 5) {
      tier = 'Bronze';
    } else if (years < 10) {
      tier = 'Silver';
    } else {
      tier = 'Gold';
    }
    
    const result = await sql`
      INSERT INTO contractors (name, company_name, category, tier, phone, email, experience_years, location, document_url, password_hash, user_id)
      VALUES (${name}, ${company_name || null}, ${category}, ${tier}, ${phone}, ${email || null}, ${years}, ${location || null}, ${document_url || null}, ${password}, ${user_id})
      RETURNING *
    `;
    
    return NextResponse.json({ success: true, contractor: result[0] });
  } catch (error) {
    console.error('Error creating contractor:', error);
    return NextResponse.json({ success: false, error: 'Failed to create contractor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, password } = body;
    
    if (!id || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    // Verify password
    const contractor = await sql`SELECT password_hash FROM contractors WHERE id = ${id}`;
    
    if (contractor.length === 0) {
      return NextResponse.json({ success: false, error: 'Contractor not found' }, { status: 404 });
    }
    
    if (contractor[0].password_hash !== password) {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }
    
    // Delete contractor
    await sql`DELETE FROM contractors WHERE id = ${id}`;
    
    // Also delete all ratings for this contractor
    await sql`DELETE FROM ratings WHERE contractor_id = ${id}`;
    
    return NextResponse.json({ success: true, message: 'Contractor profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting contractor:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete contractor' }, { status: 500 });
  }
}
