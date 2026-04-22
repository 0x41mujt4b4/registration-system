import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import getUser from "@/server/getUser";

type AuthUser = {
  id?: string;
  username?: string;
  role?: string;
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

        const user = await getUser(username);
        if (!user) return null;
        if (!user.password) return null;

        let isValid = false;
        try {
          // Preferred path for hashed passwords.
          isValid = await compare(password, user.password);
        } catch {
          // Backward compatibility for legacy plaintext records.
          isValid = password === user.password;
        }
        if (!isValid) return null;

        return {
          id: user.id ?? user.username,
          username: user.username,
          role: user.role ?? "user",
        };
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.username = typeof token.username === "string" ? token.username : "";
      session.user.role = typeof token.role === "string" ? token.role : "user";
      return session;
    },
  },
});
