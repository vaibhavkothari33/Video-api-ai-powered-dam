"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Upload, LogOut, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full top-0 z-50  bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
    >
      <nav className="container mx-auto  px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors duration-200"
          >
            <Home className="w-6 h-6" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Video with AI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Browse
            </Link>
            {session && (
              <Link
                href="/upload"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1">
                {session ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-white">
                        {session.user?.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {session.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/upload"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      <Upload className="w-4 h-4 mr-3" />
                      Upload Video
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}