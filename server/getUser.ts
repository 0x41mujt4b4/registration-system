import connectToDatabase from '@/server/mongodb';
import { IUser } from '@/types';

export default async function getUser(username: string): Promise<IUser | null> {
    try {
      const db = await connectToDatabase();
      const user = await db.collection('users').findOne({ username: username }) as unknown as IUser | null;
      return user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
}