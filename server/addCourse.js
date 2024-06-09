"use server";
import {query} from '@/server/mysql';

export default async function addCourse(course) {
    try {
        const courses_query = 'INSERT INTO courses (student_id, course_name, course_level, session_type, session_time) VALUES (?, ?, ?, ?, ?)';
        // Insert student info into the database
        const results = await query(courses_query, [
          course.student_id,
          course.course_name,
          course.course_level,
          course.session_type,
          course.session_time,
        ]);
        return results[0];
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
}
