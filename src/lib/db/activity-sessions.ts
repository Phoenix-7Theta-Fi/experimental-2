import database from './index';
import type { Database } from 'better-sqlite3';

export interface ActivitySession {
  id: string;
  status: 'STARTING' | 'ACTIVE' | 'ENDING' | 'CLOSED';
  activityId: number;
  activityType: string;
  conversation: Array<{ role: 'user' | 'assistant'; content: string }>;
  startTime: number;
  lastActivity: number;
}

// Create or update session in database
export function upsertSession(
  sessionId: string,
  data: Partial<ActivitySession>
): void {
  const stmt = database.prepare(
    'SELECT value FROM session_store WHERE key = ?'
  );
  const existingValue = stmt.get(`activity_session:${sessionId}`) as { value: string } | undefined;

  const sessionData = existingValue
    ? { ...JSON.parse(existingValue.value), ...data }
    : data;

  const updateStmt = database.prepare(
    `INSERT OR REPLACE INTO session_store (key, value) VALUES (?, ?)`
  );
  
  updateStmt.run(`activity_session:${sessionId}`, JSON.stringify(sessionData));
}

// Get session from database
export function getSession(sessionId: string): ActivitySession | null {
  const stmt = database.prepare(
    'SELECT value FROM session_store WHERE key = ?'
  );
  
  const result = stmt.get(`activity_session:${sessionId}`) as { value: string } | undefined;

  if (!result) return null;

  try {
    return JSON.parse(result.value) as ActivitySession;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
}

// Delete session from database
export function deleteSession(sessionId: string): void {
  const stmt = database.prepare(
    'DELETE FROM session_store WHERE key = ?'
  );
  stmt.run(`activity_session:${sessionId}`);
}

// Clean up old sessions (utility function)
export function cleanupOldSessions(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
  const cutoffTime = Date.now() - maxAgeMs;
  
  const selectStmt = database.prepare(
    "SELECT key, value FROM session_store WHERE key LIKE 'activity_session:%'"
  );
  const deleteStmt = database.prepare(
    'DELETE FROM session_store WHERE key = ?'
  );
  
  const oldSessions = selectStmt.all() as Array<{ key: string; value: string }>;

  for (const session of oldSessions) {
    try {
      const data = JSON.parse(session.value);
      if (data.lastActivity < cutoffTime) {
        deleteStmt.run(session.key);
      }
    } catch (error) {
      console.error('Error processing session cleanup:', error);
    }
  }
}