import connectToDatabase from '@/server/mongodb';
import { ObjectId } from 'mongodb';

export default async function addFees(fees) {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('fees').insertOne({
            student_id: new ObjectId(fees.student_id),
            fees_type: fees.fees_type,
            amount: fees.amount,
            payment_date: fees.date
        });
        return result;
    } catch (error) {
        console.error('Error adding fees:', error);
        throw error;
    }
}