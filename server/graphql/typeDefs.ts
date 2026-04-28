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
    name: String
    username: String!
    role: String
    permissions: [String!]
    tenantId: String
  }

  type Tenant {
    id: ID!
    domain: String!
    name: String!
    dbName: String!
    status: String!
  }

  type RegistrationOptions {
    sessionOptions: [String!]!
    courseOptions: [String!]!
    levelOptions: [String!]!
    timeOptions: [String!]!
    feesTypeOptions: [String!]!
    defaultFeesAmount: Float!
  }

  type Query {
    getStudents: [Student]
    getUser(username: String!): User
    getUsers: [User!]
    getTenants: [Tenant!]
    getRegistrationOptions: RegistrationOptions!
  }

  type AddStudentPayload {
    id: ID!
    receiptNumber: Int!
  }

  type Mutation {
    addStudent(
      name: String!
      time: String!
      feesAmount: Float!
      feesType: String!
      course: String!
      level: String!
      session: String!
      paymentDate: String
    ): AddStudentPayload
    addCourse(
      student_id: ID!
      course_name: String
      course_level: String
      session_type: String
      session_time: String
    ): Course
    addFees(student_id: ID!, fees_type: String, amount: Float, date: String!): Fees
    addUser(name: String!, username: String!, tenantDomain: String!, password: String!, role: String, permissions: [String!]): ID
    updateUser(id: ID!, name: String, role: String, password: String, permissions: [String!]): User
    deleteUser(id: ID!): Boolean!
    addTenant(domain: String!, name: String, status: String): Tenant
    updateTenant(id: ID!, name: String, status: String): Tenant
    updateRegistrationOptions(
      sessionOptions: [String!]
      courseOptions: [String!]
      levelOptions: [String!]
      timeOptions: [String!]
      feesTypeOptions: [String!]
      defaultFeesAmount: Float
    ): RegistrationOptions!
  }
`;
