import db from '@/server/mysql';

async function addStudent(form) {
    try {
        // Create a connection to the database
        const connection = await db();

        const student_query = 'INSERT INTO students (name, registration_date) VALUES (?, ?)'
        // Insert student info into the database
        const [result] = await connection.execute(student_query, [form.name, new Date()]);
        // get student id from the student_result object
        // const student_id = student_result.insertId;

        // Close the connection
        await connection.end();

        return result.insertId; // Return the ID of the inserted user
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}

module.exports = addStudent;