"use client";

import Image from "next/image";
import { useState } from "react";

const extractFrames = async (videoFile: File, fps: number = 1) => {
  const video = document.createElement("video");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Could not get canvas context");

  // Create object URL for video
  const videoUrl = URL.createObjectURL(videoFile);
  video.src = videoUrl;

  return new Promise<string[]>((resolve, reject) => {
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const frames: string[] = [];
      const totalFrames = Math.floor(video.duration * fps);
      let currentFrame = 0;

      video.onseeked = () => {
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          frames.push(canvas.toDataURL("image/jpeg"));
        }

        currentFrame++;
        if (currentFrame < totalFrames) {
          video.currentTime = currentFrame * (1 / fps);
        } else {
          URL.revokeObjectURL(videoUrl);
          resolve(frames);
        }
      };

      video.currentTime = 0;
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error("Error loading video"));
    };
  });
};

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      alert("File size must be less than 100MB");
      return;
    }
    setVideoFile(file);

    // Create URL for video preview
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handleSubmit = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    try {
      const frames = await extractFrames(videoFile);
      console.log(`Extracted ${frames.length} frames from video`);

      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frames }),
      });

      if (!response.ok) {
        throw new Error("Failed to get review");
      }

      const data = await response.json();
      setFeedback(data.feedback || "No feedback received");
    } catch (error) {
      console.error("Error processing video:", error);
      alert("Error processing video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4">Hinge Profile Review</h1>
        <p className="text-lg mb-8">
          Upload your profile video and get expert feedback to improve your
          matches
        </p>

        {videoUrl ? (
          <div className="w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={videoUrl}
              controls
              className="w-full h-full"
              onLoadedMetadata={(e) => {
                const video = e.target as HTMLVideoElement;
                video.play();
              }}
            />
          </div>
        ) : (
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
        )}

        <button
          className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center gap-2 text-sm sm:text-base h-12 px-8 sm:px-10 ${
            videoFile && !isProcessing
              ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!videoFile || isProcessing}
          onClick={handleSubmit}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </>
          ) : (
            "Get Expert Review"
          )}
        </button>

        {feedback && (
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Profile Analysis</h2>
            <div className="text-left whitespace-pre-wrap">
              {feedback.split("\n").map((line, i) => (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
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
