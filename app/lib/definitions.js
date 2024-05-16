// export async function User() 
//     {
//         try {
//             const user = await sql<User>`SELECT * FROM users WHERE username=${username}`;
//             return user.rows[0];
//         } catch (error) {
//             console.error('Failed to fetch user:', error);
//             throw new Error('Failed to fetch user.');
//         }
//     };