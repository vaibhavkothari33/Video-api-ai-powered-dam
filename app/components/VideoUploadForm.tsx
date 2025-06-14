"use client"
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

function VideoUploadForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadSuccess = (res: any) => {
        setFormData(prev => ({
            ...prev,
            videoUrl: res.filePath // Use filePath instead of url for ImageKit
        }));
        setIsUploading(false);
        setUploadProgress(0);
    };

    const handleUploadProgress = (progress: number) => {
        setUploadProgress(progress);
        setIsUploading(progress < 100);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!formData.videoUrl) {
            setError('Please upload a video first');
            return;
        }

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        if (!formData.description.trim()) {
            setError('Description is required');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await apiClient.createVideo({
                title: formData.title.trim(),
                description: formData.description.trim(),
                videoUrl: formData.videoUrl,
            });
            
            console.log('Video created successfully:', response);
            router.push('/');
        } catch (err) {
            console.error('Error details:', err);
            setError(err instanceof Error ? err.message : 'Failed to create video');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white mb-4">
                        Upload Your Video
                    </h1>
                    <p className="text-lg text-gray-400">
                        Share your creativity with the world 🌍
                    </p>
                </div>

                <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                    {/* Video Upload Section */}
                    <div className="p-8 border-b border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Select Your Video
                        </h2>
                        
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                            <FileUpload
                                onSuccess={handleUploadSuccess}
                                onProgress={handleUploadProgress}
                                fileType="video"
                            />
                            
                            {isUploading && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {formData.videoUrl && !isUploading && (
                                <div className="mt-4 text-green-400 text-sm">
                                    ✅ Video uploaded successfully!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <h2 className="text-xl font-semibold text-white">
                            Video Details
                        </h2>

                        {error && (
                            <div className="p-4 text-sm text-red-200 bg-red-900/50 border border-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter your video title"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                placeholder="Write a compelling description for your video..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.videoUrl || isUploading}
                            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform ${
                                isSubmitting || !formData.videoUrl || isUploading
                                    ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
                            } text-white`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Publishing Video...
                                </span>
                            ) : (
                                'Publish Video'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VideoUploadForm;