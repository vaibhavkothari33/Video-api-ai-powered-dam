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
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
    } else if (fileType === "image") {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return false;
      }
    }

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
      // Get authentication from your API endpoint
      const authRes = await fetch("/api/auth/imagekit-auth", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!authRes.ok) {
        const errorText = await authRes.text();
        throw new Error(`Authentication failed: ${errorText}`);
      }

      const authData = await authRes.json();

      // Extract authentication parameters and public key
      const { authenticationParameters, publicKey } = authData;

      // Validate that we have all required auth parameters
      if (!authenticationParameters || !authenticationParameters.token || 
          !authenticationParameters.signature || !authenticationParameters.expire) {
        throw new Error("Invalid authentication response - missing required parameters");
      }

      if (!publicKey) {
        throw new Error("Public key not provided in authentication response");
      }

      // Validate expire time
      const currentTime = Math.floor(Date.now() / 1000);
      if (authenticationParameters.expire <= currentTime) {
        throw new Error("Authentication token has expired");
      }

      console.log("Starting upload with auth:", { 
        hasToken: !!authenticationParameters.token, 
        hasSignature: !!authenticationParameters.signature, 
        expire: authenticationParameters.expire,
        currentTime: currentTime,
        timeLeft: authenticationParameters.expire - currentTime,
        hasPublicKey: !!publicKey
      });

      const uploadOptions = {
        file,
        fileName: file.name,
        publicKey: publicKey,
        signature: authenticationParameters.signature,
        expire: authenticationParameters.expire,
        token: authenticationParameters.token,
        folder: fileType === "video" ? "/videos" : "/images", // Optional: organize files
        onProgress: (event: ProgressEvent) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      };

      console.log("Upload options:", {
        fileName: uploadOptions.fileName,
        folder: uploadOptions.folder,
        fileSize: file.size
      });

      const res = await upload(uploadOptions);

      console.log("Upload successful:", res);
      onSuccess(res);
    } catch (error) {
      console.error("Upload failed", error);
      
      // More specific error messages
      let errorMessage = "Upload failed";
      if (error instanceof Error) {
        if (error.message.includes("expire")) {
          errorMessage = "Authentication expired. Please try again.";
        } else if (error.message.includes("Authentication failed")) {
          errorMessage = "Authentication failed. Please check your configuration.";
        } else if (error.message.includes("signature")) {
          errorMessage = "Invalid signature. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
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
        onClick={openFileDialog}
        className={`relative cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-blue-400 bg-blue-50/10'
            : 'border-gray-600 hover:border-gray-500'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <div className="flex flex-col items-center justify-center py-8">
          {getFileTypeIcon()}
          
          <div className="text-center">
            <p className="text-white font-medium mb-2">
              {uploading ? 'Uploading...' : `Drop your ${fileType} here or click to browse`}
            </p>
            <p className="text-gray-400 text-sm">
              Supports {fileType === "video" ? "MP4, MOV, AVI, WebM" : "JPG, PNG, GIF, WebP"} • Max 100MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 text-sm text-red-200 bg-red-900/50 border border-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;