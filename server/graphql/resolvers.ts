import { hash } from "bcrypt";
import { z } from "zod";
import addCourse from "@/server/addCourse";
import addFees from "@/server/addFees";
import addStudent from "@/server/addStudent";
import addUser from "@/server/addUser";
import getStudents from "@/server/getStudents";
import getUser from "@/server/getUser";
import { ICourse, IFees } from "@/types";

const getUserArgsSchema = z.object({
  username: z.string().min(1),
});

const addStudentArgsSchema = z.object({
  name: z.string().min(1),
  date: z.string(),
});

const addCourseArgsSchema = z.object({
  student_id: z.string().min(1),
  course_name: z.string().optional(),
  course_level: z.string().optional(),
  session_type: z.string().optional(),
  session_time: z.string().optional(),
});

const addFeesArgsSchema = z.object({
  student_id: z.string().min(1),
  fees_type: z.string().optional(),
  amount: z.number().optional(),
  date: z.string(),
});

const addUserArgsSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.string().optional(),
});

export const resolvers = {
  Query: {
    getStudents: async () => getStudents(),
    getUser: async (_: unknown, rawArgs: unknown) => {
      const { username } = getUserArgsSchema.parse(rawArgs);
      return getUser(username);
    },
  },
  Mutation: {
    addStudent: async (_: unknown, rawArgs: unknown) => {
      const { name, date } = addStudentArgsSchema.parse(rawArgs);
      return addStudent({ name, date: new Date(date).toISOString() });
    },
    addCourse: async (_: unknown, rawArgs: unknown) => {
      const args = addCourseArgsSchema.parse(rawArgs) as ICourse;
      await addCourse(args);
      return { id: "0", ...args };
    },
    addFees: async (_: unknown, rawArgs: unknown) => {
      const args = addFeesArgsSchema.parse(rawArgs) as IFees;
      await addFees({ ...args, date: new Date(args.date!).toISOString() });
      return { id: "0", ...args };
    },
    addUser: async (_: unknown, rawArgs: unknown) => {
      const { username, password, role } = addUserArgsSchema.parse(rawArgs);
      const hashedPassword = await hash(password, 10);
      const userRole = role || "user";
      return addUser({ username, password: hashedPassword, role: userRole });
    },
  },
};
