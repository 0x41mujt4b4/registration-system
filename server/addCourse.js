import connectToDatabase from '@/server/mongodb';
import { ObjectId } from 'mongodb';

export default async function addCourse(course) {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('courses').insertOne({
            student_id: new ObjectId(course.student_id),
            course_name: course.course_name,
            course_level: course.course_level,
            session_type: course.session_type,
            session_time: course.session_time
        });
        return result;
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
}
