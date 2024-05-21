import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(request) {
    try {
        const { username, password } = await request.json();
        if (!username || !password) {
            return NextResponse.error('Missing username or password.', { status: 400 });
        }
        console.log('Registering user: ', username, password);
        // return NextResponse.redirect('/register');
    } catch (error) {
        console.error('Failed to register user:', error);
        return NextResponse.error('Failed to register user.', { status: 500 });
    }
    return NextResponse.json({ success: true });
}