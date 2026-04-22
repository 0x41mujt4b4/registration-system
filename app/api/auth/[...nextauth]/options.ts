import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import getUser from "@/server/getUser";
import { IUser } from "@/types";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;
                const user = await getUser(credentials.username);
                if (user) {
                    const isValid = await compare(credentials.password, user.password!);
                    if (isValid) {
                        // Any object returned will be saved in `user` property of the JWT
                        return user as any;
                    }
                    return null;
                }
                return null;
            }
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        maxAge: 60 * 60, // 1 hour
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },

        async session({ session, token }: any) {
            session.user = token.user;
            return session
        }
    }
};
