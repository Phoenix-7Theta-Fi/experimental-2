import { NextRequest } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { createAppointment, getAvailableTimeSlots } from '@/lib/db/appointments';

export async function POST(request: NextRequest) {
  const userId = await getUserSession();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { practitionerId, date, timeSlot } = await request.json();

    // Validate input
    if (!practitionerId || !date || !timeSlot) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if date is in future
    if (new Date(date) < new Date()) {
      return Response.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    // Check if time slot is available
    const availableSlots = getAvailableTimeSlots(practitionerId, date);
    const slot = availableSlots.find(s => s.time === timeSlot);
    if (!slot || !slot.available) {
      return Response.json(
        { error: 'Time slot is not available' },
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = createAppointment(
      practitionerId,
      userId,
      date,
      timeSlot
    );

    return Response.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return Response.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const userId = await getUserSession();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Extract practitionerId and date from query params
    const { searchParams } = new URL(request.url);
    const practitionerId = searchParams.get('practitionerId');
    const date = searchParams.get('date');

    if (!practitionerId || !date) {
      return Response.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const availableSlots = getAvailableTimeSlots(
      parseInt(practitionerId),
      date
    );

    return Response.json(availableSlots);
  } catch (error) {
    console.error('Error getting available slots:', error);
    return Response.json(
      { error: 'Failed to get available slots' },
      { status: 500 }
    );
  }
}
