import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { 
  calculateMedicationEffectiveness, 
  getMedicationAdherenceForPeriod 
} from '@/lib/db/medication';
import { calculateMedicationImpactMetrics } from '@/lib/db/medication-impact';

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
    const medicationId = searchParams.get('medicationId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const days = searchParams.get('days');

    // Validate required parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Get medication impact data
    const impactMetrics = await calculateMedicationImpactMetrics(
      userId,
      startDate,
      endDate
    );

    // Get adherence data
    const adherenceData = getMedicationAdherenceForPeriod(
      userId,
      startDate,
      endDate
    );

    // If specific medication requested, calculate effectiveness
    let effectiveness = null;
    if (medicationId) {
      effectiveness = calculateMedicationEffectiveness(
        userId,
        parseInt(medicationId),
        days ? parseInt(days) : 30
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        impactMetrics,
        adherenceData,
        effectiveness
      }
    });

  } catch (error) {
    console.error('Error fetching medication impact data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medication impact data' },
      { status: 500 }
    );
  }
}