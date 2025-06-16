"use client";
import { IVideo } from "@/models/Video";
import Link from "next/link";

export default function VideoComponent({ video }: { video: IVideo }) {
    return (
        <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
            <figure className="relative px-4 pt-4">
                <Link
                    href={`/videos/${video._id}`}
                    className="relative group w-full"
                >
                    <div className="aspect-video w-full relative rounded-lg overflow-hidden">
                        {/* Video Element */}
                        <video
                            src={video.videoUrl}
                            controls
                            className="w-full h-full object-cover"
                        />

                    </div>
                </Link>
            </figure>

            <div className="card-body p-4">
                <h2 className="card-title text-lg">{video.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                    {video.description}
                </p>
            </div>
        </div>
    );
}
