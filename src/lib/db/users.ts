import { getDB } from './index';
import { hashPassword } from '../auth';

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'patient' | 'practitioner';
  username?: string;
  name?: string;
  avatar_url?: string;
  practitioner_id?: number;
}

export interface Tweet {
  id: number;
  user_id: number;
  content: string;
  tag: string;
  created_at: string;
  likes_count?: number;
  liked_by_user?: boolean;
}

export const getUserByUsername = (username: string) => {
  const db = getDB();
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
};

export const getUserByEmail = (email: string) => {
  const db = getDB();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
};

export const getUserTweets = (userId: number, currentUserId: number) => {
  const db = getDB();
  return db.prepare(`
    SELECT 
      t.*, u.username, u.name, u.role, u.avatar_url,
      COUNT(DISTINCT l.id) as likes_count,
      EXISTS(SELECT 1 FROM likes WHERE tweet_id = t.id AND user_id = ?) as liked_by_user
    FROM tweets t
    JOIN users u ON t.user_id = u.id
    LEFT JOIN likes l ON t.id = l.tweet_id
    WHERE t.user_id = ?
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `).all(currentUserId, userId) as (Tweet & { username: string; name: string; role: string; avatar_url: string })[];
};

export const getPatientsByPractitioner = (practitionerId: number) => {
  const db = getDB();
  return db.prepare(`
    SELECT id, email, username, name, avatar_url, practitioner_id 
    FROM users 
    WHERE role = 'patient' AND practitioner_id = ?
  `).all(practitionerId) as (Omit<User, 'password' | 'role'>)[];
};

export const assignPatientToPractitioner = (patientId: number, practitionerId: number) => {
  const db = getDB();
  return db.prepare(`
    UPDATE users 
    SET practitioner_id = ? 
    WHERE id = ? AND role = 'patient'
    RETURNING id
  `).get(practitionerId, patientId);
};

export const seedUsers = async () => {
  const db = getDB();
  const users = [
    { email: 'dr.smith@example.com', password: 'password123', role: 'practitioner', username: 'drsmith', name: 'Dr. John Smith', avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { email: 'dr.jones@example.com', password: 'password123', role: 'practitioner', username: 'drjones', name: 'Dr. Sarah Jones', avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { email: 'dr.patel@example.com', password: 'password123', role: 'practitioner', username: 'drpatel', name: 'Dr. Raj Patel', avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { email: 'alice@example.com', password: 'password123', role: 'patient', username: 'alice', name: 'Alice Cooper', avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { email: 'bob@example.com', password: 'password123', role: 'patient', username: 'bob', name: 'Bob Wilson', avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { email: 'carol@example.com', password: 'password123', role: 'patient', username: 'carol', name: 'Carol Martinez', avatar_url: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { email: 'david@example.com', password: 'password123', role: 'patient', username: 'david', name: 'David Chen', avatar_url: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { email: 'emma@example.com', password: 'password123', role: 'patient', username: 'emma', name: 'Emma Watson', avatar_url: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { email: 'frank@example.com', password: 'password123', role: 'patient', username: 'frank', name: 'Frank Johnson', avatar_url: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { email: 'grace@example.com', password: 'password123', role: 'patient', username: 'grace', name: 'Grace Lee', avatar_url: 'https://randomuser.me/api/portraits/women/5.jpg' }
  ] as const;

  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  
  if (existingUsers.count === 0) {
    // First insert practitioners
    const practitionerStmt = db.prepare(`
      INSERT INTO users (email, password, role, username, name, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const user of users.filter(u => u.role === 'practitioner')) {
      const hashedPassword = await hashPassword(user.password);
      practitionerStmt.run(
        user.email,
        hashedPassword,
        user.role,
        user.username,
        user.name,
        user.avatar_url
      );
    }

    // Get Dr. Sarah Jones's ID
    const drJones = db.prepare("SELECT id FROM users WHERE email = ?")
      .get('dr.jones@example.com') as { id: number };

    // Then insert patients with Dr. Jones as their practitioner
    const patientStmt = db.prepare(`
      INSERT INTO users (email, password, role, username, name, avatar_url, practitioner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const user of users.filter(u => u.role === 'patient')) {
      const hashedPassword = await hashPassword(user.password);
      patientStmt.run(
        user.email,
        hashedPassword,
        user.role,
        user.username,
        user.name,
        user.avatar_url,
        drJones.id
      );
    }
  }

  console.log('Users seeded successfully');
};
