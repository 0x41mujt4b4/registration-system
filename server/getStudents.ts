import connectToDatabase from "@/server/mongodb";
import { IStudent } from "@/types";

export default async function getStudents(): Promise<IStudent[]> {
  try {
    const db = await connectToDatabase();
    
    const pipeline = [
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'student_id',
          as: 'course'
        }
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'fees',
          localField: '_id',
          foreignField: 'student_id',
          as: 'fees'
        }
      },
      {
        $unwind: {
          path: '$fees',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          student_number: '$receiptNumber',
          name: 1,
          session: '$course.session_type',
          course: '$course.course_name',
          level: '$course.course_level',
          time: '$course.session_time',
          fees_type: '$fees.fees_type',
          amount: '$fees.amount',
          payment_date: '$fees.payment_date'
        }
      },
      {
        $sort: { level: 1, payment_date: 1 } as Record<string, 1|-1>
      }
    ];

    const results = await db.collection('students').aggregate<IStudent>(pipeline).toArray();
    return results;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw error;
  }
}