'use client';

import React, { useState } from 'react';
import LoadingSkeleton from './LoadingSkeleton';

interface LazyYouTubeProps {
  videoId: string;
  title?: string;
  className?: string;
}

export default function LazyYouTube({ videoId, title = 'YouTube video', className = '' }: LazyYouTubeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  // Use hqdefault - always exists for any YouTube video (480x360)
  // sddefault (640x480) and maxresdefault (1280x720) may not exist for all videos
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className={`relative w-full aspect-video ${className}`}>
      {!showVideo ? (
        // Thumbnail with play button
        <button
          onClick={() => setShowVideo(true)}
          className="absolute inset-0 w-full h-full group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={`Play ${title}`}
        >
          {/* Loading skeleton shown until thumbnail loads */}
          {!thumbnailLoaded && (
            <div className="absolute inset-0 bg-[#1a1a1a] image-loading" />
          )}

          {/* Thumbnail - always rendered, fades in when loaded */}
          <img
            src={thumbnailUrl}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${thumbnailLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setThumbnailLoaded(true)}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-[#FF4500] rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ff6633] transition-all duration-300 shadow-[0_0_30px_rgba(255,69,0,0.5)] group-hover:shadow-[0_0_50px_rgba(255,69,0,0.7)]">
              <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1" />
            </div>
          </div>

          {/* "Click to play" hint */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="text-white/60 text-xs font-mono uppercase tracking-wider">
              Click to play
            </span>
          </div>
        </button>
      ) : (
        // Actual iframe
        <>
          {!isLoaded && (
            <LoadingSkeleton variant="video" className="absolute inset-0" />
          )}
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
          />
        </>
      )}
    </div>
  );
}
