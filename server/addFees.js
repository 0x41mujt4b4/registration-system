"use server";
import {query} from '@/server/mysql';

export default async function addFees(fees) {
    try {
        // Insert the fees into the database
        const fees_query = 'INSERT INTO fees (student_id, fees_type, amount, payment_date) VALUES (?, ?, ?, ?)';
        const results = await query(fees_query, [fees.student_id, fees.fees_type, fees.amount, fees.date]);

        return results[0];
    } catch (error) {
        console.error('Error adding fees:', error);
        throw error;
    }
}