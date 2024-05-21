import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
// import { sql } from '@vercel/postgres';
import postgres from '@/app/lib/db';
import { User } from '@/app/lib/definitions';
// import bcrypt from "bcryptjs";

async function getUser(username){
  try {
    const client = await postgres.connect();
    console.log('Connected to database');
    const user = await postgres.query('SELECT * FROM public.users WHERE username = $1', [username]);
    client.release();
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
          const parsedCredentials = z
            .object({ username: z.string().username(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { username, password } = parsedCredentials.data;
            const user = await getUser(username);
            if (!user) return null;
            return user;
            // const passwordsMatch = await bcrypt.compare(password, user.password);
            // if (passwordsMatch) return user;
          }
  
          console.log('Invalid credentials');
          return null;
      },
    }),
  ],
});