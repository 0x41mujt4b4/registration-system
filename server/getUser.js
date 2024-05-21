import db from '@/server/mysql';

export default async function getUser(username) {
    try {
      const connection = await db();
      const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
      // await connection.end();
      return rows[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // throw new Error('Failed to fetch user.');
    }
  };