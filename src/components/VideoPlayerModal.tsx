import React, { useRef } from 'react';
import { X, Download, Share2, Film, Check } from 'lucide-react';
import { RecentVideo } from '../types';

interface VideoPlayerModalProps {
  video: RecentVideo | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!video) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(video.videoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = video.videoUrl;
    a.download = `zialogy-${video.title.toLowerCase().replace(/\s+/g, '-')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0e1017] border border-white/15 p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-syne font-bold text-white">
                {video.title}
              </h3>
              <p className="text-xs text-neutral-400 font-jakarta">
                {video.orientation === 'portrait' ? '9:16 Vertical Mobile' : '16:9 Landscape Desktop'} • {video.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              title="Copy Video Link"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-cyan-300" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              title="Download MP4"
            >
              <Download className="w-4 h-4 text-pink-300" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 max-h-[70vh]">
          <video
            ref={videoRef}
            src={video.videoUrl}
            controls
            autoPlay
            playsInline
            className={`w-full max-h-[68vh] object-contain rounded-2xl ${
              video.orientation === 'portrait' ? 'max-w-xs mx-auto' : ''
            }`}
          />
        </div>

        {/* Prompt note if available */}
        {video.prompt && (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-neutral-400 font-jakarta">
            <span className="text-cyan-300 font-medium">Scene Prompt:</span> "{video.prompt}"
          </div>
        )}
      </div>
    </div>
  );
};
