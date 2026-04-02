import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/api/utils/sql';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractor_id');
    
    if (!contractorId) {
      return NextResponse.json({ success: false, error: 'Contractor ID required' }, { status: 400 });
    }
    
    const ratings = await sql`
      SELECT r.*, u.name as user_name 
      FROM ratings r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.contractor_id = ${parseInt(contractorId)}
      ORDER BY r.created_at DESC
    `;
    
    return NextResponse.json({ success: true, ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch ratings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractor_id, user_id, rating, comment } = body;
    
    if (!contractor_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Invalid rating data' }, { status: 400 });
    }
    
    // Insert the rating
    const result = await sql`
      INSERT INTO ratings (contractor_id, user_id, rating, comment)
      VALUES (${contractor_id}, ${user_id || null}, ${rating}, ${comment || null})
      RETURNING *
    `;
    
    // Update contractor's average rating
    const stats = await sql`
      SELECT 
        AVG(rating)::DECIMAL(2,1) as avg_rating,
        COUNT(*)::INTEGER as total_ratings
      FROM ratings
      WHERE contractor_id = ${contractor_id}
    `;
    
    await sql`
      UPDATE contractors
      SET average_rating = ${stats[0].avg_rating},
          total_ratings = ${stats[0].total_ratings}
      WHERE id = ${contractor_id}
    `;
    
    return NextResponse.json({ success: true, rating: result[0] });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json({ success: false, error: 'Failed to create rating' }, { status: 500 });
  }
}
