"use client";

import { useState, useEffect } from "react";
import VideoUploadForm from "../components/VideoUploadForm";
import VideoComponent from "../components/VideoComponent";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { Loader2 } from "lucide-react";

const VideoManagementPage = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "videos">("upload");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err instanceof Error ? err.message : "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "videos") {
      fetchVideos();
    }
  }, [activeTab, refreshTrigger]);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab("videos");
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Video Management</h1>
          <p className="text-gray-400 text-lg">Upload and manage your video content</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === "upload"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              Upload Video
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === "videos"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              My Videos
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === "upload" && (
            <div className="animate-fade-in">
              <VideoUploadForm onSuccess={handleUploadSuccess} />
            </div>
          )}
          
          {activeTab === "videos" && (
            <div className="animate-fade-in">
              {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  <p>{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {videos.map((video) => (
                    <VideoComponent key={video._id} video={video} />
                  ))}
                  {videos.length === 0 && (
                    <div className="col-span-full text-center text-gray-400">
                      No videos found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default VideoManagementPage;