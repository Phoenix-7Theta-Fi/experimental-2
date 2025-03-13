import { getDB } from './index';

export interface Message {
  id: number;
  sender_id: number;
  practitioner_id: number;
  patient_id: number;
  content: string;
  created_at: string;
  read_at?: string;
}

export const getMessages = (practitionerId: number, patientId: number) => {
  const db = getDB();
  return db.prepare(`
    SELECT id, sender_id, practitioner_id, patient_id, content, created_at, read_at 
    FROM messages 
    WHERE practitioner_id = ? AND patient_id = ?
    ORDER BY created_at ASC
  `).all(practitionerId, patientId) as Message[];
};

export const sendMessage = (senderId: number, practitionerId: number, patientId: number, content: string) => {
  const db = getDB();
  const now = new Date().toISOString();
  
  return db.prepare(`
    INSERT INTO messages (sender_id, practitioner_id, patient_id, content, created_at)
    VALUES (?, ?, ?, ?, ?)
    RETURNING id, sender_id, practitioner_id, patient_id, content, created_at, read_at
  `).get(senderId, practitionerId, patientId, content, now) as Message;
};

export const markMessageAsRead = (messageId: number) => {
  const db = getDB();
  const now = new Date().toISOString();
  
  return db.prepare(`
    UPDATE messages
    SET read_at = ?
    WHERE id = ?
    RETURNING id, sender_id, practitioner_id, patient_id, content, created_at, read_at
  `).get(now, messageId) as Message;
};

export const getUnreadMessageCount = (userId: number, userRole: 'patient' | 'practitioner') => {
  const db = getDB();
  const field = userRole === 'patient' ? 'patient_id' : 'practitioner_id';
  
  return db.prepare(`
    SELECT COUNT(*) as count 
    FROM messages 
    WHERE ${field} = ? AND read_at IS NULL
  `).get(userId) as { count: number };
};
