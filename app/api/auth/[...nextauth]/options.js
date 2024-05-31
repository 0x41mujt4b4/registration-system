//create options for next-auth
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import getUser from "@/server/getUser";

export const options = {
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            username: {},
            password: {},
        },
        async authorize(credentials) {
            const user = await getUser(credentials.username);
            if (user) {
            const isValid = await compare(credentials.password, user.password);
            if (isValid) {
                // Any object returned will be saved in `user` property of the JWT
                return user;
            }
            return null;
            }
        }
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user}) {
            if(user){
               token.user = user;
            }
            return token;
          },
          
          async session({ session, token, user }) {
            session.user = token.user;
            return session
          }
      }
    };
