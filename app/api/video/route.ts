import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();
        const videos = await Video.find({})
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(videos || []);
    } catch (error) {
        console.error("Failed to fetch videos:", error);
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();
        const body = await request.json();

        // Validate required fields
        if (!body.title?.trim() || !body.description?.trim() || !body.videoUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const video = await Video.create({
            title: body.title.trim(),
            description: body.description.trim(),
            videoUrl: body.videoUrl,
            userId: session.user.id
        });

        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        console.error("Video creation error:", {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json(
            { error: "Failed to create video", details: error instanceof Error ? error.message : undefined },
            { status: 500 }
        );
    }
}