import { IVideo } from '@/models/Video'
import React from 'react'
import VideoComponent from './VideoComponent';

interface videoFeedProps {
    videos: IVideo[];
}

function VideoFeed({ videos }: videoFeedProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
                <VideoComponent key={video._id?.toString()} video={video} />
            ))}

            {videos.length === 0 && (
                <div className='text-center'>No videos available</div>
            )}
        </div>
    )
}

export default VideoFeed