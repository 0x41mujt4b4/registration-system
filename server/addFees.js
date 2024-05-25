import db from '@/server/mysql';

async function addFees(form) {
    try {
        // Create a connection to the database
        const connection = await db();

        // Insert the fees into the database
        const fees_query = 'INSERT INTO fees (student_id, fees_type, amount, payment_date) VALUES (?, ?, ?, ?)'
        const [result] = await connection.execute(fees_query, [student_id, form.fees_type, form.amount, new Date()]);

        // Close the connection
        await connection.end();

        return result; // Return the ID of the inserted user
    } catch (error) {
        console.error('Error adding fees:', error);
        throw error;
    }
}

module.exports = addFees;