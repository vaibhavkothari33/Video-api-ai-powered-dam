import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// get data from frontend
// validation  through connect to db
// existing user check
// create user in db
// return success responce

// f..k  edge request in next js
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 },
            )
        }
        await connectToDatabase()

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exist" },
                { status: 400 }
            );
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 200 },
        )
    } catch (error) {
        console.log("regsitration error", error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 400 }
        )

}
}