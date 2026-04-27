import { z } from "zod";
import { createGatewayStudent, createGatewayUser, getGatewayStudents, getGatewayUser } from "@/server/visionGatewayClient";
import { IStudent } from "@/types";

const getUserArgsSchema = z.object({
  username: z.string().min(1),
});

const addStudentArgsSchema = z.object({
  name: z.string().min(1),
  time: z.string().min(1),
  feesAmount: z.number(),
  feesType: z.string().min(1),
  course: z.string().min(1),
  level: z.string().min(1),
  session: z.string().min(1),
  paymentDate: z.string().datetime().optional(),
});

const addUserArgsSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type GraphQLContext = {
  session?: {
    user?: {
      gatewayToken?: string;
    };
  } | null;
};

function requireAccessToken(context: GraphQLContext): string {
  const token = context.session?.user?.gatewayToken;
  if (!token) {
    throw new Error("Authentication required. Please sign in again.");
  }
  return token;
}

function toIsoTimestamp(value: string | undefined): string | undefined {
  if (value == null || value === "") return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function mapGatewayStudentToGraphQL(student: {
  id?: string;
  _id?: string;
  name: string;
  course?: string;
  level?: string;
  session?: string;
  time?: string;
  feesType?: string;
  feesAmount?: number;
  studentNumber?: number;
  paymentDate?: string;
}): IStudent {
  return {
    id: student.id ?? student._id ?? `${student.name}-${Date.now()}`,
    student_number: student.studentNumber,
    name: student.name,
    session: student.session,
    course: student.course,
    level: student.level,
    time: student.time,
    fees_type: student.feesType,
    amount: student.feesAmount,
    payment_date: toIsoTimestamp(student.paymentDate),
  };
}

export const resolvers = {
  Query: {
    getStudents: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const accessToken = requireAccessToken(context);
      const students = await getGatewayStudents(accessToken);
      return students.map(mapGatewayStudentToGraphQL);
    },
    getUser: async (_: unknown, rawArgs: unknown) => {
      const { username } = getUserArgsSchema.parse(rawArgs);
      return getGatewayUser(username);
    },
  },
  Mutation: {
    addStudent: async (_: unknown, rawArgs: unknown, context: GraphQLContext) => {
      const accessToken = requireAccessToken(context);
      const args = addStudentArgsSchema.parse(rawArgs);
      const student = await createGatewayStudent(args, accessToken);
      const receiptNumber = student.studentNumber ?? 0;
      return {
        id: student.id ?? student._id ?? `${student.name}-${Date.now()}`,
        receiptNumber,
      };
    },
    addCourse: async () => {
      return { id: "0" };
    },
    addFees: async () => {
      return { id: "0" };
    },
    addUser: async (_: unknown, rawArgs: unknown) => {
      const { username, password } = addUserArgsSchema.parse(rawArgs);
      return createGatewayUser(username, password);
    },
  },
};
