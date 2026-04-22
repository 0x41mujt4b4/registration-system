import { createSchema } from 'graphql-yoga';
import getStudents from './getStudents';
import getUser from './getUser';
import addStudent from './addStudent';
import addCourse from './addCourse';
import addFees from './addFees';
import addUser from './addUser';
import { hash } from 'bcrypt';
import { ICourse, IFees, IStudent, IUser } from '@/types';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Student {
      id: ID!
      student_number: Int
      name: String!
      registration_date: String
      session: String
      course: String
      level: String
      time: String
      fees_type: String
      amount: Float
      payment_date: String
    }
    
    type Course {
      id: ID!
      student_id: ID!
      course_name: String
      course_level: String
      session_type: String
      session_time: String
    }
    
    type Fees {
      id: ID!
      student_id: ID!
      fees_type: String
      amount: Float
      payment_date: String
    }

    type User {
      id: ID!
      username: String!
      role: String
    }

    type Query {
      getStudents: [Student]
      getUser(username: String!): User
    }

    type AddStudentPayload {
      id: ID!
      receiptNumber: Int!
    }

    type Mutation {
      addStudent(name: String!, date: String!): AddStudentPayload
      addCourse(student_id: ID!, course_name: String, course_level: String, session_type: String, session_time: String): Course
      addFees(student_id: ID!, fees_type: String, amount: Float, date: String!): Fees
      addUser(username: String!, password: String!, role: String): ID
    }
  `,
  resolvers: {
    Query: {
      getStudents: async () => {
        return await getStudents();
      },
      getUser: async (_: any, { username }: { username: string }) => {
        return await getUser(username);
      }
    },
    Mutation: {
      addStudent: async (_: any, { name, date }: { name: string, date: string }) => {
        const result = await addStudent({ name, date: new Date(date).toISOString() });
        return result;
      },
      addCourse: async (_: any, args: ICourse) => {
        await addCourse(args);
        return { id: "0", ...args }; 
      },
      addFees: async (_: any, args: IFees) => {
        await addFees({ ...args, date: new Date(args.date!).toISOString() });
        return { id: "0", ...args };
      },
      addUser: async (_: any, { username, password, role }: IUser) => {
        const hashedPassword = await hash(password!, 10);
        const userRole = role || 'user';
        const id = await addUser({ username, password: hashedPassword, role: userRole });
        return id;
      }
    }
  }
});
