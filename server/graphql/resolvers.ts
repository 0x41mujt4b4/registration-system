import { z } from "zod";
import {
  createGatewayStudent,
  createGatewayTenant,
  createGatewayUser,
  deleteGatewayUser,
  getGatewayStudents,
  getGatewayTenants,
  getGatewayUser,
  getGatewayUsers,
  getGatewayRegistrationOptions,
  updateGatewayTenant,
  updateGatewayRegistrationOptions,
  updateGatewayUser,
} from "@/server/visionGatewayClient";
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
  name: z.string().min(2),
  username: z.string().min(1).regex(/^\S+$/, "Username must not contain spaces"),
  tenantDomain: z.string().min(3).regex(/^\S+$/, "Tenant domain must not contain spaces"),
  password: z.string().min(6),
  role: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

const addTenantArgsSchema = z.object({
  domain: z.string().min(3).regex(/^\S+$/, "Tenant domain must not contain spaces"),
  name: z.string().optional(),
  status: z.string().optional(),
});

const updateUserArgsSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).optional(),
  role: z.string().optional(),
  password: z.string().min(6).optional(),
  permissions: z.array(z.string()).optional(),
});

const updateTenantArgsSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  status: z.string().optional(),
});

const updateRegistrationOptionsArgsSchema = z.object({
  sessionOptions: z.array(z.string()).optional(),
  courseOptions: z.array(z.string()).optional(),
  levelOptions: z.array(z.string()).optional(),
  timeOptions: z.array(z.string()).optional(),
  feesTypeOptions: z.array(z.string()).optional(),
  defaultFeesAmount: z.number().nonnegative().optional(),
});

export type GraphQLContext = {
  session?: {
    user?: {
      gatewayToken?: string;
      role?: string;
      permissions?: string[];
      tenantDomain?: string;
      isMasterTenant?: boolean;
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

function requireAdmin(context: GraphQLContext): void {
  const role = context.session?.user?.role;
  if (role !== "admin") {
    throw new Error("Insufficient role");
  }
}

function requireTenantAdmin(context: GraphQLContext): void {
  requireAdmin(context);
}

function requireMasterTenantAdmin(context: GraphQLContext): void {
  requireAdmin(context);
  if (context.session?.user?.isMasterTenant !== true) {
    throw new Error("Tenant management is allowed only for master tenant users");
  }
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
    getUsers: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireTenantAdmin(context);
      const accessToken = requireAccessToken(context);
      const users = await getGatewayUsers(accessToken);
      return users.map((user) => ({
        id: user.id ?? user._id ?? user.email,
        name: user.name ?? "",
        username: user.email,
        role: user.role ?? "user",
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
        tenantId: user.tenantId ?? "",
      }));
    },
    getTenants: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireMasterTenantAdmin(context);
      const accessToken = requireAccessToken(context);
      const tenants = await getGatewayTenants(accessToken);
      return tenants.map((tenant) => ({
        id: tenant.id ?? tenant._id ?? tenant.domain,
        domain: tenant.domain,
        name: tenant.name,
        dbName: tenant.dbName,
        status: tenant.status,
        bootstrapAdminEmail: tenant.bootstrapAdminEmail,
        bootstrapAdminPassword: tenant.bootstrapAdminPassword,
      }));
    },
    getRegistrationOptions: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const accessToken = requireAccessToken(context);
      return getGatewayRegistrationOptions(accessToken);
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
    addUser: async (_: unknown, rawArgs: unknown, context: GraphQLContext) => {
      requireTenantAdmin(context);
      const accessToken = requireAccessToken(context);
      const { name, username, tenantDomain, password, role, permissions } = addUserArgsSchema.parse(rawArgs);
      const effectiveTenantDomain = context.session?.user?.isMasterTenant === true
        ? tenantDomain
        : (context.session?.user?.tenantDomain ?? tenantDomain);
      return createGatewayUser({ name, username, tenantDomain: effectiveTenantDomain, password, role, permissions }, accessToken);
    },
    updateUser: async (_: unknown, rawArgs: unknown, context: GraphQLContext) => {
      requireTenantAdmin(context);
      const accessToken = requireAccessToken(context);
      const { id, name, role, password, permissions } = updateUserArgsSchema.parse(rawArgs);
      const user = await updateGatewayUser(id, { name, role, password, permissions }, accessToken);
      return {
        id: user.id ?? user._id ?? user.email,
        name: user.name ?? "",
        username: user.email,
        role: user.role ?? "user",
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
        tenantId: user.tenantId ?? "",
      };
    },
    deleteUser: async (_: unknown, rawArgs: unknown, context: GraphQLContext) => {
      requireTenantAdmin(context);
      const accessToken = requireAccessToken(context);
      const { id } = z.object({ id: z.string().min(1) }).parse(rawArgs);
      return deleteGatewayUser(id, accessToken);
    },
    addTenant: async (_: unknown, rawArgs: unknown, context: GraphQLContext) => {
      requireMasterTenantAdmin(context);
      const accessToken = requireAccessToken(context);
      const { domain, name, status } = addTenantArgsSchema.parse(rawArgs);
      const tenant = await createGatewayTenant({ domain, name, status }, accessToken);
      return {
        id: tenant.id ?? tenant._id ?? tenant.domain,
        domain: tenant.domain,
        name: tenant.name,
        dbName: tenant.dbName,
        status: tenant.status,
        bootstrapAdminEmail: tenant.bootstrapAdminEmail,
        bootstrapAdminPassword: tenant.bootstrapAdminPassword,
      };
    },
    updateTenant: async (_: unknown, rawArgs: unknown, context: GraphQLContext) => {
      requireMasterTenantAdmin(context);
      const accessToken = requireAccessToken(context);
      const { id, name, status } = updateTenantArgsSchema.parse(rawArgs);
      const tenant = await updateGatewayTenant(id, { name, status }, accessToken);
      return {
        id: tenant.id ?? tenant._id ?? tenant.domain,
        domain: tenant.domain,
        name: tenant.name,
        dbName: tenant.dbName,
        status: tenant.status,
        bootstrapAdminEmail: tenant.bootstrapAdminEmail,
        bootstrapAdminPassword: tenant.bootstrapAdminPassword,
      };
    },
    updateRegistrationOptions: async (_: unknown, rawArgs: unknown, context: GraphQLContext) => {
      requireTenantAdmin(context);
      const accessToken = requireAccessToken(context);
      const args = updateRegistrationOptionsArgsSchema.parse(rawArgs);
      return updateGatewayRegistrationOptions(args, accessToken);
    },
  },
};
