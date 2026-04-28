import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginToGatewayWithProfile } from "@/server/visionGatewayClient";

type AuthUser = {
  id?: string;
  username?: string;
  role?: string;
  gatewayToken?: string;
  permissions?: string[];
  tenantId?: string;
  tenantDomain?: string;
  tenantDbName?: string;
  isMasterTenant?: boolean;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = typeof credentials?.username === "string" ? credentials.username.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!username || !password) return null;

        try {
          const gatewayAuth = await loginToGatewayWithProfile(username, password);

          return {
            id: username,
            username,
            role: gatewayAuth.role,
            permissions: gatewayAuth.permissions,
            gatewayToken: gatewayAuth.accessToken,
            tenantId: gatewayAuth.tenantId,
            tenantDomain: gatewayAuth.tenantDomain,
            tenantDbName: gatewayAuth.tenantDbName,
            isMasterTenant: gatewayAuth.isMasterTenant,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 60 * 60,
  },
  ...(process.env.NEXTAUTH_SECRET ? { secret: process.env.NEXTAUTH_SECRET } : {}),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.username = authUser.username;
        token.role = authUser.role;
        token.gatewayToken = authUser.gatewayToken;
        token.permissions = authUser.permissions;
        token.tenantId = authUser.tenantId;
        token.tenantDomain = authUser.tenantDomain;
        token.tenantDbName = authUser.tenantDbName;
        token.isMasterTenant = authUser.isMasterTenant;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {} as unknown as NonNullable<typeof session.user>;
      }
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.username = typeof token.username === "string" ? token.username : "";
      session.user.role = typeof token.role === "string" ? token.role : "user";
      session.user.gatewayToken = typeof token.gatewayToken === "string" ? token.gatewayToken : "";
      session.user.permissions = Array.isArray(token.permissions) ? token.permissions : [];
      session.user.tenantId = typeof token.tenantId === "string" ? token.tenantId : "";
      session.user.tenantDomain = typeof token.tenantDomain === "string" ? token.tenantDomain : "";
      session.user.tenantDbName = typeof token.tenantDbName === "string" ? token.tenantDbName : "";
      session.user.isMasterTenant = token.isMasterTenant === true;
      return session;
    },
  },
});
