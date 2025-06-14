import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import {  NextResponse } from "next/server";

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
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Parse and validate request body
        const body = await request.json();
        console.log('Received video data:', body); // Debug log

        if (!body.title || !body.description || !body.videoUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create video document
        const video = await Video.create({
            title: body.title,
            description: body.description,
            videoUrl: body.videoUrl,
            userId: session.user.id,
            createdAt: new Date()
        });

        console.log('Created video:', video); // Debug log
        return NextResponse.json(video, { status: 201 });

    } catch (error) {
        // Improved error logging
        console.error("Video creation error:", {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json(
            { 
                error: "Failed to create video",
                details: error instanceof Error ? error.message : undefined
            },
            { status: 500 }
        );
    }
}