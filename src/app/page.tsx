"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      // 100MB limit
      alert("File size must be less than 100MB");
      return;
    }
    setVideoFile(file);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Hinge Profile Review</h1>
        <p className="text-lg mb-8">
          Upload your profile video and get expert feedback to improve your
          matches
        </p>

        <div
          className={`w-full max-w-md p-8 border-2 border-dashed rounded-lg transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
        >
          <label htmlFor="video-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              {videoFile ? (
                <div className="text-center">
                  <p className="font-semibold text-green-600">
                    ✓ Video uploaded
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{videoFile.name}</p>
                </div>
              ) : (
                <>
                  <Image
                    src="/upload-icon.svg"
                    alt="Upload icon"
                    width={48}
                    height={48}
                    className="opacity-50"
                  />
                  <div className="text-center">
                    <p className="font-semibold">Upload your profile video</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Screen record your Hinge profile and upload it here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Drag & drop or click to select • MP4, MOV (max 100MB)
                    </p>
                  </div>
                </>
              )}
            </div>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </label>
        </div>

        <button
          className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center gap-2 text-sm sm:text-base h-12 px-8 sm:px-10 ${
            videoFile
              ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!videoFile}
          onClick={() => {
            if (videoFile) {
              // Handle submission here
              console.log("Submitting video for review:", videoFile);
            }
          }}
        >
          Get Expert Review
        </button>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-500">
        <p>© 2024 Hinge Profile Review</p>
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="hover:underline">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}
