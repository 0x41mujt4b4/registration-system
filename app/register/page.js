import addUser from "@/server/addUser";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export default async function Register() {

    const handleRegister = async (formData) => {
        "use server";
        const username = formData.get('username');
        const password = formData.get('password');
        const hashedPassword = await hash(password, 10);
        console.log("passwordLength: ", hashedPassword.length);
        try {
            const response = await addUser({ username, password: hashedPassword});
            console.log("response: ", response);
        } catch (error) {
            console.error('Failed to register user:', error);
            // return NextResponse.error('Failed to register user.', { status: 500 });
        }
        // const response = await fetch('http://localhost:3000/api/auth/register', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         username: formData.get('username'),
        //         password: formData.get('password')
        //     })
        // });
    };

    return (
        <div>
            <h2>Register</h2>
            <form action={handleRegister}>
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
};