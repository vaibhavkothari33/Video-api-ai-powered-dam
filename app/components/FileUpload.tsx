"use client";

import { upload } from "@imagekit/next";
import { useState, useRef } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType = "video" }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    if (fileType === "video") {
      const validVideoTypes = [
        'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 
        'video/flv', 'video/webm', 'video/mkv', 'video/m4v'
      ];
      if (!validVideoTypes.includes(file.type)) {
        setError("Please upload a valid video file (MP4, AVI, MOV, WMV, FLV, WebM, MKV, M4V)");
        return false;
      }
    } else if (fileType === "image") {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
        return false;
      }
    }

    // 100 MB limit
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      console.log("Starting file upload process...");
      
      // Get authentication from your API endpoint
      const authRes = await fetch("/api/auth/imagekit-auth", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!authRes.ok) {
        const errorText = await authRes.text();
        console.error("Auth response error:", errorText);
        throw new Error(`Authentication failed: ${authRes.status} - ${errorText}`);
      }

      const authData = await authRes.json();
      console.log("Auth data received:", {
        hasAuthParams: !!authData.authenticationParameters,
        hasPublicKey: !!authData.publicKey
      });

      // Extract authentication parameters and public key
      const { authenticationParameters, publicKey } = authData;

      // Validate authentication data
      if (!authenticationParameters) {
        throw new Error("Authentication parameters missing from response");
      }

      if (!authenticationParameters.token || !authenticationParameters.signature || !authenticationParameters.expire) {
        console.error("Missing auth parameters:", authenticationParameters);
        throw new Error("Invalid authentication response - missing required parameters");
      }

      if (!publicKey) {
        throw new Error("Public key not provided in authentication response");
      }

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (authenticationParameters.expire <= currentTime) {
        throw new Error("Authentication token has expired. Please try again.");
      }

      console.log("Starting upload with validated auth...");

      // Prepare upload options
      const uploadOptions = {
        file,
        fileName: file.name,
        publicKey: publicKey,
        signature: authenticationParameters.signature,
        expire: authenticationParameters.expire,
        token: authenticationParameters.token,
        folder: fileType === "video" ? "/videos" : "/images",
        useUniqueFileName: true,
        responseFields: ['fileId', 'url', 'filePath', 'name', 'size', 'fileType'],
        onProgress: (event: ProgressEvent) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
        onError: (error: any) => {
          console.error("Upload error callback:", error);
          // Don't throw here, let the main catch handle it
        }
      };

      console.log("Upload options prepared:", {
        fileName: uploadOptions.fileName,
        folder: uploadOptions.folder,
        fileSize: file.size,
        fileType: file.type
      });

      // Perform the upload
      const res = await upload(uploadOptions);

      console.log("Upload response received:", {
        success: !!res,
        hasUrl: !!res.url,
        hasFilePath: !!res.filePath,
        fileId: res.fileId,
        responseKeys: Object.keys(res || {})
      });

      // Validate the response more carefully
      if (!res) {
        throw new Error("No response received from upload");
      }

      // Check for error in response
      if (res.error) {
        throw new Error(res.error.message || res.error || "Upload failed");
      }

      // Ensure we have a valid URL or file path
      if (!res.url && !res.filePath) {
        console.error("Invalid upload response:", res);
        throw new Error("Upload succeeded but received invalid response format");
      }

      // If we reach here, the upload was successful
      console.log("Upload successful, calling onSuccess...");
      onSuccess(res);

    } catch (error) {
      console.error("Upload failed with error:", error);
      
      // More specific error messages
      let errorMessage = "Upload failed";
      
      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes("expire") || error.message.includes("expired")) {
          errorMessage = "Authentication expired. Please try again.";
        } else if (error.message.includes("Authentication failed") || error.message.includes("signature")) {
          errorMessage = "Authentication failed. Please check your ImageKit configuration.";
        } else if (error.message.includes("Network") || error.message.includes("fetch")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("413") || error.message.includes("too large") || error.message.includes("size")) {
          errorMessage = "File is too large. Please choose a smaller file.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Upload timeout. Please try again with a smaller file.";
        } else if (error.message && error.message !== "Upload failed") {
          // Use the specific error message if it's meaningful
          errorMessage = error.message;
        }
      }
      
      // Only set error if it's a real error, not a successful upload
      setError(errorMessage);
    } finally {
      setUploading(false);
      if (onProgress) {
        onProgress(0); // Reset progress
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected via input:", file.name, file.type, file.size);
      await uploadFile(file);
    }
    // Clear the input so the same file can be selected again if needed
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      console.log("File dropped:", file.name, file.type, file.size);
      await uploadFile(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileTypeIcon = () => {
    if (fileType === "video") {
      return (
        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!uploading ? openFileDialog : undefined}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-400 bg-blue-50/10'
            : 'border-gray-600 hover:border-gray-500'
        } ${uploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}`}
      >
        <div className="flex flex-col items-center justify-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-white font-medium">Uploading...</p>
            </div>
          ) : (
            <>
              {getFileTypeIcon()}
              <div className="text-center">
                <p className="text-white font-medium mb-2">
                  Drop your {fileType} here or click to browse
                </p>
                <p className="text-gray-400 text-sm">
                  Supports {fileType === "video" ? "MP4, MOV, AVI, WebM, etc." : "JPG, PNG, GIF, WebP"} • Max 100MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 text-sm text-red-200 bg-red-900/50 border border-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;