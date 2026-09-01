'use client';

// ─── Video Player Component ───
// Renders a video player that streams from our proxy route.
// The proxy handles authentication, so the <video> tag just
// points to `/api/lessons/{lessonId}/video-stream`.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, AlertCircle, Play } from 'lucide-react';
import { getVideoStreamUrl } from '../hooks/use-watching-course';

interface VideoPlayerProps {
  lessonId: string;
  title: string;
}

export default function VideoPlayer({ lessonId, title }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const t = useTranslations('WatchingCourse');

  // Build the proxy URL for the video stream
  const videoSrc = getVideoStreamUrl(lessonId);
  console.log('[VideoPlayer] Streaming video from proxy URL:', videoSrc);

  return (
    <div className="w-full aspect-video max-h-[70vh] bg-black relative flex items-center justify-center">
      {/* ─── Loading Overlay ─── */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative flex items-center justify-center mb-4">
            {/* Outer pulsating ring */}
            <div className="absolute inset-0 rounded-full border border-blueNormal/40 animate-ping" />
            <div className="absolute -inset-2 rounded-full border border-blueNormal/20 animate-pulse" />
            {/* Inner static background with icon */}
            <div className="relative bg-blueNormal/10 p-4 rounded-full">
              <Loader2 className="size-8 animate-spin text-blueNormal" />
            </div>
          </div>
          <span className="font-cairo-bold-sm text-white/80 animate-pulse tracking-wide">
            {t('videoLoading')}
          </span>
        </div>
      )}

      {/* ─── Error State ─── */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <AlertCircle className="size-12 text-red-400" />
            <span className="font-cairo-bold-lg text-white">
              {t('videoError')}
            </span>
            <span className="font-cairo-medium-sm text-white/50">
              {t('videoErrorHint')}
            </span>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="mt-2 px-6 py-2 bg-blueNormal hover:bg-blueNormalHover text-white rounded-lg font-cairo-medium-sm transition-colors cursor-pointer"
            >
              {t('retry')}
            </button>
          </div>
        </div>
      )}

      {/* ─── Native Video Player ─── */}
      <video
        key={lessonId} // Force re-mount when lesson changes
        src={videoSrc}
        controls
        controlsList="nodownload" // Prevent download button
        className="w-full h-full object-contain bg-black"
        title={title}
        onLoadedData={() => {
          console.log('[VideoPlayer] Video loaded successfully for lesson:', lessonId);
          setIsLoading(false);
        }}
        onError={(e) => {
          console.error('[VideoPlayer] Video load error for lesson:', lessonId, e);
          setIsLoading(false);
          setHasError(true);
        }}
        onWaiting={() => {
          console.log('[VideoPlayer] Video buffering...');
        }}
        onPlaying={() => {
          console.log('[VideoPlayer] Video playing');
          setIsLoading(false);
        }}
      />
    </div>
  );
}
