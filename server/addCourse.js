import db from '@/server/mysql';

async function addCourse(form) {
    try {
        // Create a connection to the database
        const connection = await db();

        // Insert the course into the database
        const courses_query = 'INSERT INTO courses (student_id, course_name, course_level, session_type, session_time) VALUES (?, ?, ?, ?, ?)'
        const [result] = await connection.execute(courses_query, [student_id, form.course_name, form.course_level, form.session_type, form.session_time]);

        // Close the connection
        await connection.end();

        return result; // Return the ID of the inserted user
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
}

module.exports = addCourse;