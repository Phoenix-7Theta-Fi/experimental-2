import { getPatientInsights } from '@/lib/db/health-insights';
import type { HealthSection } from '@/lib/types/insights';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('patientId');
    const section = searchParams.get('section') as HealthSection | null;

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const insights = getPatientInsights(
      parseInt(patientId),
      section || undefined
    );

    return NextResponse.json(insights);

  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
