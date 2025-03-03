import { NextRequest } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { updateAppointmentStatus } from '@/lib/db/appointments';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserSession();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    
    if (!status || !['confirmed', 'cancelled'].includes(status)) {
      return Response.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updated = updateAppointmentStatus(
      parseInt(params.id),
      userId,
      status
    );

    if (!updated) {
      return Response.json(
        { error: 'Failed to update appointment status' },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return Response.json(
      { error: 'Failed to update appointment status' },
      { status: 500 }
    );
  }
}
