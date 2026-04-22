import connectToDatabase from '@/server/mongodb';
import { IStudent } from '@/types';

export default async function addStudent(student: IStudent & { date: string }) {
    try {
        const db = await connectToDatabase();
        // Atomic counter for incrementing receipt IDs
        const counter = await db.collection<{ _id: string, seq: number }>('counters').findOneAndUpdate(
            { _id: 'receiptId' },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        );
        const receiptNumber = counter?.seq || 1;

        const result = await db.collection('students').insertOne({
            name: student.name,
            registration_date: student.date,
            receiptNumber: receiptNumber
        });
        return { 
            id: result.insertedId.toString(),
            receiptNumber: receiptNumber
        };
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}