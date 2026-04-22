import connectToDatabase from '@/server/mongodb';

export default async function addStudent(student) {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('students').insertOne({
            name: student.name,
            registration_date: student.date
        });
        return result.insertedId.toString(); // Return the ID of the inserted user as a string
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}