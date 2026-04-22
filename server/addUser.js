import connectToDatabase from '@/server/mongodb';

export default async function addUser(user) {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('users').insertOne({
            username: user.username,
            password: user.password,
            role: user.role
        });
        return result.insertedId.toString(); // Return the ID of the inserted user
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}