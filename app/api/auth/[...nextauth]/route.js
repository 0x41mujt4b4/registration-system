import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import getUser from "@/server/getUser";
require("dotenv").config();

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: {},
      password: {}
    },
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      const user = await getUser(credentials.username);
      if (user) {
        // Check the password
        const isValid = await compare(credentials.password, user.password);
        if (isValid) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        }
          return null;
      }}
  })
  ]
});

export {handler as GET, handler as POST};