export const typeDefs = /* GraphQL */ `
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
    addCourse(
      student_id: ID!
      course_name: String
      course_level: String
      session_type: String
      session_time: String
    ): Course
    addFees(student_id: ID!, fees_type: String, amount: Float, date: String!): Fees
    addUser(username: String!, password: String!, role: String): ID
  }
`;
