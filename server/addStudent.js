"use server";
import {query} from '@/server/mysql';

export default async function addStudent(student) {
    try {
        const student_query = 'INSERT INTO students (name, registration_date) VALUES (?, ?)'
        // Insert student info into the database
        const results = await query(student_query, [student.name, student.date]);
        return results.insertId; // Return the ID of the inserted user
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}