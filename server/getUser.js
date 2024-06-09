import {query} from '@/server/mysql';

export default async function getUser(username) {
    try {

      const results = await query('SELECT * FROM users WHERE username = ?', [username]);
      return results[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  };