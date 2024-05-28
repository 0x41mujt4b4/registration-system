"use server";
import db from '@/server/mysql';

export default async function addStudent(student) {
    try {
        // Create a connection to the database
        const connection = await db();
        console.log('adding student..');
        const student_query = 'INSERT INTO students (name, registration_date) VALUES (?, ?)'
        // Insert student info into the database
        const [result] = await connection.execute(student_query, [student.name, student.date]);
        // get student id from the student_result object
        // const student_id = student_result.insertId;
        console.log('added student successfly!');
        return result.insertId; // Return the ID of the inserted user
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}