import { IVideo } from '@/models/Video';
import { motion } from 'framer-motion';
import { Zap, Shield, Video as VideoIcon } from 'lucide-react';
import VideoComponent from './VideoComponent';

interface VideoFeedProps {
    videos: IVideo[];
}

function VideoFeed({ videos }: VideoFeedProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-[80vh] flex items-center justify-center overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-0" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                    >
                        Share Your Story
                    </motion.h1>
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
                    >
                        Upload, transform, and share your videos with lightning-fast streaming
                        and automatic optimization powered by cutting-edge AI technology.
                    </motion.p>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                            Get Started Now
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Featured Videos Section */}
            <section className="py-20 bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-center mb-12"
                    >
                        Featured Videos
                    </motion.h2>
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {videos.map((video) => (
                            <motion.div
                                key={video._id}
                                variants={itemVariants}
                                className="transform hover:scale-105 transition-all duration-300"
                            >
                                <VideoComponent video={video} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-black/40">
                <div className="container mx-auto px-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-center mb-16"
                    >
                        Why Choose Us
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
                        >
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
                            <p className="text-gray-400">Optimized streaming with global CDN delivery for seamless playback.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
                        >
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <VideoIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">AI-Powered</h3>
                            <p className="text-gray-400">Smart video optimization and automatic thumbnail generation.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
                        >
                            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
                            <p className="text-gray-400">Advanced security features and privacy controls for your content.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default VideoFeed;