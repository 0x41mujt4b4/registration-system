"use server";
import {query} from "@/server/mysql";

export default async function getStudents() {
  try {
    const sql = `SELECT 
                students.id AS id,
                students.name AS name,
                courses.session_type AS session,
                courses.course_name AS course,
                courses.course_level AS level,
                courses.session_time AS time,
                Fees.fees_type AS fees_type,
                Fees.amount AS amount,
                Fees.payment_date AS payment_date
            FROM 
                students
            LEFT JOIN 
                courses ON students.id = courses.student_id
            LEFT JOIN 
                Fees ON students.id = Fees.student_id
            ORDER BY level ASC, payment_date;`;
    const results = await query(sql);
    return results;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw error;
  }
}