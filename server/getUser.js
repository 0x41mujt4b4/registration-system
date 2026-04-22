import connectToDatabase from '@/server/mongodb';

export default async function getUser(username) {
    try {
      const db = await connectToDatabase();
      const user = await db.collection('users').findOne({ username: username });
      return user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
}