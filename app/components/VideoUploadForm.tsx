import React from 'react'

function VideoUploadForm() {
    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Upload Your Video</h1>
                <p className="text-gray-600">Share your creativity with the world</p>
            </div>

            <form className="max-w-2xl mx-auto p-4 bg-base-100 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" className="input input-bordered w-full" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="description">Description</label>
                    <textarea id="description" name="description" className="textarea textarea-bordered w-full" rows={3} required></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="videoUrl">Video URL</label>
                    <input type="url" id="videoUrl" name="videoUrl" className="input input-bordered w-full" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="thumbnailUrl">Thumbnail URL</label>
                    <input type="url" id="thumbnailUrl" name="thumbnailUrl" className="input input-bordered w-full" required />
                </div>
                <button type="submit" className="btn btn-primary w-full">Upload Video</button>
            </form>
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">Or</p>
                <button className="btn btn-secondary mt-2">Upload from Device</button>
                <p className="text-gray-500 text-sm mt-2">Supported formats: MP4, AVI, MOV</p>
                <p className="text-gray-500 text-sm">Max file size: 100MB</p>
                <p className="text-gray-500 text-sm">Please ensure your video meets the community guidelines.</p>
            </div>
        </div>
    )

}

export default VideoUploadForm