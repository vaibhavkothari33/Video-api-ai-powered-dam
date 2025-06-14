"use client" // This component must be a client component

import {
    upload,
} from "@imagekit/next";

import { useState } from "react";

interface FileUploadProps {
    onSuccess: (res: any) => void
    onProgress?: (progress: number) => void
    fileType?: "image" | "video"

}
// FileUpload component demonstrates file uploading using ImageKit's Next.js SDK.
const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
}: FileUploadProps) => {

    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null);

    // optional validation

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid file")
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size must be less than 100 MB")
        }
        return true
    }

    const handleFileChnage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file || !validateFile(file)) return;
        setUploading(true)
        setError(null)

        try {
            const authres = await fetch("/api/auth/imagekit-auth")
            const auth = await authres.json();

            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                expire: auth.expire,
                token: auth.token,
                signature: auth.signature,
                // fileName: file.name,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percentage = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percentage))
                    }
                },

            })
            onSuccess(res)
        }
        catch (error) {
            console.log("Upload failed", error);
        }
        finally {
            setUploading(false)
        }
    }


    return (
        <>
            <input type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChnage}
            />
            {uploading && (
                <span>Loading ...</span>
            )}
        </>
    );
}
export default FileUpload;