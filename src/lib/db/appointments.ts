import db from '.';
import { Appointment, TimeSlot } from '../types';

// Default time slots (9 AM to 5 PM)
const DEFAULT_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export function getAvailableTimeSlots(practitionerId: number, date: string): TimeSlot[] {
  // Get booked appointments for the given date and practitioner
  const bookedAppointments = db
    .prepare(
      `SELECT time_slot FROM appointments 
       WHERE practitioner_id = ? AND date = ? AND status != 'cancelled'`
    )
    .all(practitionerId, date) as { time_slot: string }[];

  const bookedSlots = new Set(bookedAppointments.map(a => a.time_slot));

  // Return all time slots with availability status
  return DEFAULT_TIME_SLOTS.map(time => ({
    time,
    available: !bookedSlots.has(time)
  }));
}

export function createAppointment(
  practitionerId: number,
  patientId: number,
  date: string,
  timeSlot: string
): Appointment {
  // Check if slot is available
  const existingAppointment = db
    .prepare(
      `SELECT id FROM appointments 
       WHERE practitioner_id = ? AND date = ? AND time_slot = ? AND status != 'cancelled'`
    )
    .get(practitionerId, date, timeSlot);

  if (existingAppointment) {
    throw new Error('Time slot is already booked');
  }

  // Insert new appointment
  const result = db
    .prepare(
      `INSERT INTO appointments (practitioner_id, patient_id, date, time_slot) 
       VALUES (?, ?, ?, ?) RETURNING *`
    )
    .get(practitionerId, patientId, date, timeSlot) as Appointment;

  return result;
}

export function getAppointmentsByUser(userId: number): Appointment[] {
  type AppointmentRow = {
    id: number;
    practitioner_id: number;
    patient_id: number;
    date: string;
    time_slot: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    practitioner_name: string;
    practitioner_username: string;
    practitioner_avatar_url: string;
    patient_name: string;
    patient_username: string;
    patient_avatar_url: string;
  };

  const appointments = db
    .prepare(
      `SELECT 
        a.*,
        p.name as practitioner_name, 
        p.username as practitioner_username,
        p.avatar_url as practitioner_avatar_url,
        pt.name as patient_name,
        pt.username as patient_username,
        pt.avatar_url as patient_avatar_url
       FROM appointments a
       JOIN users p ON a.practitioner_id = p.id
       JOIN users pt ON a.patient_id = pt.id
       WHERE a.patient_id = ? OR a.practitioner_id = ?
       ORDER BY date ASC, time_slot ASC`
    )
    .all(userId, userId) as AppointmentRow[];

  return appointments.map(row => ({
      id: row.id,
      practitioner_id: row.practitioner_id,
      patient_id: row.patient_id,
      date: row.date,
      time_slot: row.time_slot,
      status: row.status,
      created_at: row.created_at,
      practitioner: {
        id: row.practitioner_id,
        name: row.practitioner_name,
        username: row.practitioner_username,
        avatar_url: row.practitioner_avatar_url
      },
      patient: {
        id: row.patient_id,
        name: row.patient_name,
        username: row.patient_username,
        avatar_url: row.patient_avatar_url
      }
    })) as Appointment[];
}

export function updateAppointmentStatus(
  appointmentId: number,
  userId: number,
  status: 'confirmed' | 'cancelled'
): boolean {
  // Only allow users involved in the appointment to update its status
  const result = db
    .prepare(
      `UPDATE appointments 
       SET status = ?
       WHERE id = ? 
       AND (patient_id = ? OR practitioner_id = ?)
       RETURNING id`
    )
    .get(status, appointmentId, userId, userId);

  return !!result;
}
