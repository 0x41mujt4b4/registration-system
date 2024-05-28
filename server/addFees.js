"use server";
import db from '@/server/mysql';

export default async function addFees(fees) {
    try {
        // Create a connection to the database
        const connection = await db();
        console.log('adding fees..');
        // Insert the fees into the database
        const fees_query = 'INSERT INTO fees (student_id, fees_type, amount, payment_date) VALUES (?, ?, ?, ?)'
        const [result] = await connection.execute(fees_query, [fees.student_id, fees.fees_type, fees.amount, fees.date]);

        console.log('added fees successfly!');
        return result[0]; // Return the ID of the inserted user
    } catch (error) {
        console.error('Error adding fees:', error);
        throw error;
    }
}