"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { apiClient, VideoFormData } from "@/lib/api-client";

interface VideoUploadFormProps {
  onSuccess?: () => void;
}

const VideoUploadForm = ({ onSuccess }: VideoUploadFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    controls: true,
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVideoUploadSuccess = (res: any) => {
    console.log("Video upload successful:", res);
    setFormData(prev => ({
      ...prev,
      videoUrl: res.url || res.filePath || "",
      thumbnailUrl: res.thumbnailUrl || "" // ImageKit might provide a thumbnail
    }));
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.videoUrl) {
      setError("Please upload a video first");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const videoData: VideoFormData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        controls: formData.controls,
        transformation: {
          height: 1920,
          width: 1080,
          quality: 80
        }
      };

      await apiClient.createVideo(videoData);
      
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        controls: true,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error("Failed to create video:", error);
      setError(error instanceof Error ? error.message : "Failed to create video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      controls: true,
    });
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Upload New Video</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video File
          </label>
          <FileUpload
            fileType="video"
            onSuccess={handleVideoUploadSuccess}
            onProgress={setUploadProgress}
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">{uploadProgress}% uploaded</p>
            </div>
          )}
          {formData.videoUrl && (
            <div className="mt-2 p-2 bg-green-900/50 border border-green-700 rounded">
              <p className="text-sm text-green-200">✓ Video uploaded successfully</p>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter video title"
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter video description"
          />
        </div>

        {/* Thumbnail URL Input (Optional) */}
        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-300 mb-2">
            Thumbnail URL (Optional)
          </label>
          <input
            type="url"
            id="thumbnailUrl"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>

        {/* Controls Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="controls"
            name="controls"
            checked={formData.controls}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="controls" className="ml-2 text-sm text-gray-300">
            Show video controls
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 text-sm text-green-200 bg-green-900/50 border border-green-700 rounded-lg">
            <strong>Success:</strong> Video uploaded successfully!
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting || !formData.videoUrl}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </span>
            ) : (
              "Create Video"
            )}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoUploadForm;