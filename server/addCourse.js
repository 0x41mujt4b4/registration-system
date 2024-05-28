"use server";
import db from "@/server/mysql";

export default async function addCourse(course) {
  try {
    // Create a connection to the database
    const connection = await db();
    console.log("adding course..");
    // Insert the course into the database
    const courses_query =
      "INSERT INTO courses (student_id, course_name, course_level, session_type, session_time) VALUES (?, ?, ?, ?, ?)";
    const [result] = await connection.execute(courses_query, [
      course.student_id,
      course.course_name,
      course.course_level,
      course.session_type,
      course.session_time,
    ]);

    console.log("added course successfly!");
    return result[0]; // Return the ID of the inserted user
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
}
