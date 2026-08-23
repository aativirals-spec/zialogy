import React from 'react';
import { X, Download, Share2, Sparkles, ChevronRight } from 'lucide-react';
import { RecentVideo } from '../types';

interface VideoPlayerModalProps {
  video: RecentVideo | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0e1017]/95 border border-white/15 p-5 sm:p-7 shadow-2xl overflow-hidden space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 text-[10px] font-bold uppercase tracking-wider">
              {video.style.toUpperCase()} FILM
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {video.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div
          className={`relative mx-auto rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl ${
            video.orientation === 'portrait' ? 'max-w-[340px] aspect-[9/16]' : 'w-full aspect-[16/9]'
          }`}
        >
          <video
            src={video.videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        {/* Controls footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-neutral-400 flex items-center gap-3">
            <span>Voice: <strong className="text-white">{video.voice}</strong></span>
            <span>•</span>
            <span>Duration: <strong className="text-cyan-300 font-mono">{video.duration}</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={video.videoUrl}
              download={`${video.title}.mp4`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-5 rounded-full btn-pill-cyan flex items-center justify-center gap-2 text-xs font-bold tracking-wider cursor-pointer flex-1 sm:flex-none"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD MP4</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
