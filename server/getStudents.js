"use server";
import db from "@/server/mysql";

export default async function getStudents() {
  try {
    const connection = await db();
    // get all students and thier courses and fees from database
    const query = `SELECT 
                students.id AS id,
                students.name AS name,
                courses.session_type AS session,
                courses.course_name AS course,
                courses.course_level AS level,
                courses.session_time AS time,
                Fees.fees_type AS fees_type,
                Fees.amount AS amount
            FROM 
                students
            LEFT JOIN 
                courses ON students.id = courses.student_id
            LEFT JOIN 
                Fees ON students.id = Fees.student_id;`;
    const [rows] = await connection.execute(query);
    // console.log("rows: ", rows);
    return rows;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    // throw new Error('Failed to fetch user.');
  }
}
