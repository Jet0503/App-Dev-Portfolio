import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contractor = await sql`SELECT * FROM contractors WHERE id = ${id}`;
    
    if (contractor.length === 0) {
      return NextResponse.json({ success: false, error: 'Contractor not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, contractor: contractor[0] });
  } catch (error) {
    console.error('Error fetching contractor:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contractor' }, { status: 500 });
  }
}
