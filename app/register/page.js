"use client";

import { fetchGraphQL } from "@/lib/graphql-client";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        
        try {
            const response = await fetchGraphQL(`
                mutation AddUser($username: String!, $password: String!) {
                    addUser(username: $username, password: $password)
                }
            `, { username, password });
            console.log("User registered:", response.addUser);
            router.push('/login');
        } catch (error) {
            console.error('Failed to register user:', error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}