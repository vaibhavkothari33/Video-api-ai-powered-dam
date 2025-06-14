"use client"
import React, { useState, useEffect } from 'react';
import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { IVideo } from "@/models/Video";

interface VideoDetailPageProps {
    videoId: string;
}

function VideoDetailPage({ videoId }: VideoDetailPageProps) {
    const router = useRouter();
    const [video, setVideo] = useState<IVideo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/videos/${videoId}`);
                
                if (!response.ok) {
                    throw new Error('Video not found');
                }
                
                const videoData = await response.json();
                setVideo(videoData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load video');
                console.error('Error fetching video:', err);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchVideo();
        }
    }, [videoId]);

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleGoBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading video...</p>
                </div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Video Not Found</h1>
                    <p className="text-gray-400 mb-6">{error || 'The video you\'re looking for doesn\'t exist.'}</p>
                    <Link 
                        href="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                    
                    <Link
                        href="/"
                        className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
                    >
                        VideoApp
                    </Link>
                    
                    <div className="w-16"></div> {/* Spacer for centering */}
                </div>
            </div>

            {/* Video Player Section */}
            <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'}`}>
                <div className={`${isFullscreen ? 'h-full' : 'max-w-6xl mx-auto px-4 py-8'}`}>
                    <div className={`relative ${isFullscreen ? 'h-full' : 'aspect-video'} bg-gray-900 rounded-lg overflow-hidden`}>
                        <IKVideo
                            path={video.videoUrl}
                            transformation={[
                                {
                                    height: "1920",
                                    width: "1080",
                                    // quality: "80",
                                },
                            ]}
                            controls={true}
                            className="w-full h-full object-contain"
                            playsInline
                        />
                        
                        {/* Fullscreen Toggle Button */}
                        <button
                            onClick={handleFullscreen}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                        >
                            {isFullscreen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Info Section */}
            {!isFullscreen && (
                <div className="max-w-6xl mx-auto px-4 pb-8">
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h1 className="text-3xl font-bold text-white mb-4">
                            {video.title}
                        </h1>
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="text-gray-400 text-sm">
                                    {/* {video.createdAt && (
                                        <span>
                                            Published on {new Date(video.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    )} */}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Like
                                </button>
                                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 pt-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {video.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoDetailPage;