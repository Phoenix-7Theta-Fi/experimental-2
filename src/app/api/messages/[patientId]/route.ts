import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { getMessages, sendMessage, markMessageAsRead } from '@/lib/db/messages';

export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  const userId = await getUserSession();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDB();
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId) as { role: 'patient' | 'practitioner' };

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const patientId = parseInt(params.patientId);
  
  // Verify relationship
  if (user.role === 'practitioner') {
    const isValid = db.prepare(`
      SELECT 1 FROM users 
      WHERE id = ? AND practitioner_id = ? AND role = 'patient'
    `).get(patientId, userId);

    if (!isValid) {
      return NextResponse.json({ error: 'Not authorized for this patient' }, { status: 403 });
    }
  } else if (user.role === 'patient' && userId !== patientId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  let practitionerId: number;
  if (user.role === 'practitioner') {
    practitionerId = userId;
  } else {
    const result = db.prepare('SELECT practitioner_id FROM users WHERE id = ?').get(patientId) as { practitioner_id: number };
    practitionerId = result.practitioner_id;
  }

  const messages = getMessages(practitionerId, patientId);
  return NextResponse.json(messages);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  const userId = await getUserSession();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { content, practitionerId } = data;

  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'Invalid message content' }, { status: 400 });
  }

  if (typeof practitionerId !== 'number') {
    return NextResponse.json({ error: 'Invalid practitioner ID' }, { status: 400 });
  }

  const db = getDB();
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId) as { role: 'patient' | 'practitioner' };

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const patientId = parseInt(params.patientId);
  
  // Verify relationship similar to GET
  try {
    let finalPractitionerId: number;
    let finalPatientId: number;

    if (user.role === 'practitioner') {
      // Verify practitioner is authorized for this patient
      const isValid = db.prepare(`
        SELECT 1 FROM users 
        WHERE id = ? AND practitioner_id = ? AND role = 'patient'
      `).get(patientId, userId);

      if (!isValid) {
        return NextResponse.json({ error: 'Not authorized for this patient' }, { status: 403 });
      }

      if (userId !== practitionerId) {
        return NextResponse.json({ error: 'Invalid practitioner ID' }, { status: 403 });
      }

      finalPractitionerId = userId;
      finalPatientId = patientId;
    } else {
      // For patients
      if (userId !== patientId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      // Verify the practitioner is actually their practitioner
      const result = db.prepare('SELECT practitioner_id FROM users WHERE id = ? AND practitioner_id = ?')
        .get(patientId, practitionerId);
      if (!result) {
        return NextResponse.json({ error: 'Invalid practitioner relationship' }, { status: 403 });
      }

      finalPractitionerId = practitionerId;
      finalPatientId = userId;
    }

    const message = sendMessage(userId, finalPractitionerId, finalPatientId, content);
    return NextResponse.json(message);
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  const userId = await getUserSession();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { messageId } = data;

  if (!messageId || typeof messageId !== 'number') {
    return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
  }

  const message = markMessageAsRead(messageId);
  return NextResponse.json(message);
}
