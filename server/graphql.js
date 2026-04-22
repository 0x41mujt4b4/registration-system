import { createSchema } from 'graphql-yoga';
import getStudents from './getStudents';
import getUser from './getUser';
import addStudent from './addStudent';
import addCourse from './addCourse';
import addFees from './addFees';
import addUser from './addUser';
import { hash } from 'bcrypt';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Student {
      id: ID!
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

    type Mutation {
      addStudent(name: String!, date: String!): ID
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
      getUser: async (_, { username }) => {
        return await getUser(username);
      }
    },
    Mutation: {
      addStudent: async (_, { name, date }) => {
        // Convert date string to Date object if necessary, but addStudent in SQL expects standard type
        // The date argument from client could be ISO string
        const id = await addStudent({ name, date: new Date(date) });
        return id;
      },
      addCourse: async (_, args) => {
        await addCourse(args);
        return { id: "0", ...args }; 
      },
      addFees: async (_, args) => {
        await addFees({ ...args, date: new Date(args.date) });
        return { id: "0", ...args };
      },
      addUser: async (_, { username, password, role }) => {
        const hashedPassword = await hash(password, 10);
        const userRole = role || 'user';
        const id = await addUser({ username, password: hashedPassword, role: userRole });
        return id;
      }
    }
  }
});
