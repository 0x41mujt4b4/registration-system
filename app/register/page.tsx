"use client";

import { fetchGraphQL, toUserFriendlyErrorMessage } from "@/lib/graphql-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            const result = await fetchGraphQL<{ addUser: string }>(`
                mutation AddUser($username: String!, $password: String!) {
                    addUser(username: $username, password: $password)
                }
            `, { username, password });
            if (!result.success) {
                setError(toUserFriendlyErrorMessage(new Error(result.error)));
                return;
            }
            router.push('/login');
        } catch (error) {
            console.warn("[Register] unexpected error", {
                error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
            });
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}