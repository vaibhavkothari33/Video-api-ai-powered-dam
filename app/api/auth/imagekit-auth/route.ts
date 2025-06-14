// File: app/api/auth/imagekit-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    try {
        // Your application logic to authenticate the user
        // For example, you can check if the user is logged in or has the necessary permissions
        // If the user is not authenticated, you can return an error response

        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

        if (!privateKey) {
            console.error("IMAGEKIT_PRIVATE_KEY is not set in environment variables");
            return Response.json(
                { error: "Private key not configured" },
                { status: 500 }
            );
        }

        if (!publicKey) {
            console.error("NEXT_PUBLIC_PUBLIC_KEY is not set in environment variables");
            return Response.json(
                { error: "Public key not configured" },
                { status: 500 }
            );
        }

        // Calculate expire time as Unix timestamp (current time + 30 minutes)
        const expireTime = Math.floor(Date.now() / 1000) + (30 * 60); // 30 minutes from now

        const authenticationParameters = getUploadAuthParams({
            privateKey: privateKey,
            publicKey: publicKey,
            expire: expireTime, // Unix timestamp, not duration
            // token: "random-token", // Optional, a unique token for request
        });

        console.log("Generated auth params:", {
            expire: expireTime,
            currentTime: Math.floor(Date.now() / 1000),
            timeUntilExpire: expireTime - Math.floor(Date.now() / 1000)
        });

        return Response.json({
            authenticationParameters,
            publicKey: publicKey
        });

    } catch (error) {
        console.error("Error in imagekit authentication:", error);
        return Response.json(
            { error: "Authentication for imagekit failed" },
            { status: 500 }
        );
    }
}