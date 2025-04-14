import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { getDB } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { date, recoveryScore } = await request.json();

    // Validate input
    if (!date || typeof recoveryScore !== 'number' || recoveryScore < 0 || recoveryScore > 100) {
      return NextResponse.json(
        { error: 'Invalid recovery score. Must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    const db = getDB();
    
    // Update or insert recovery score
    const result = db.prepare(`
      UPDATE yoga_metrics 
      SET recovery_score = ? 
      WHERE user_id = ? AND date = ?
    `).run(recoveryScore, userId, date);

    if (result.changes === 0) {
      // If no record exists, create new one with default values
      db.prepare(`
        INSERT INTO yoga_metrics (
          user_id, date, 
          spine_flexibility, hip_flexibility, shoulder_flexibility,
          balance_score, overall_flexibility, recovery_score
        ) VALUES (?, ?, 70, 70, 70, 70, 70, ?)
      `).run(userId, date, recoveryScore);
    }

    return NextResponse.json({
      success: true,
      date,
      recoveryScore
    });

  } catch (error) {
    console.error('Error updating recovery score:', error);
    return NextResponse.json(
      { error: 'Failed to update recovery score' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const db = getDB();
    const recoveryScores = db.prepare(`
      SELECT date, recovery_score
      FROM yoga_metrics
      WHERE user_id = ?
        AND date BETWEEN ? AND ?
      ORDER BY date ASC
    `).all(userId, startDate, endDate);

    return NextResponse.json({
      success: true,
      recoveryScores
    });

  } catch (error) {
    console.error('Error fetching recovery scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recovery scores' },
      { status: 500 }
    );
  }
}