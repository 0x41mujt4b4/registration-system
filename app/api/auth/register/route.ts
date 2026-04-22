import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

export async function POST(request: Request) {
    try {
        const payload = registerSchema.safeParse(await request.json());
        if (!payload.success) {
            return NextResponse.json({ error: "Invalid username or password format." }, { status: 400 });
        }

        const { username } = payload.data;
        console.log("Registering user:", username);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to register user:", error);
        return NextResponse.json({ error: "Failed to register user." }, { status: 500 });
    }
}