import { getDB } from '../src/lib/db';
import { User } from '../src/lib/db/users';

const listUsers = () => {
  const db = getDB();
  const users = db.prepare("SELECT * FROM users WHERE role = 'patient'").all() as User[];
  
  console.log('\nPatient Users:\n');
  users.forEach(user => {
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log(`Username: ${user.username}`);
    console.log(`Name: ${user.name}`);
    console.log('------------------------');
  });
};

listUsers();
