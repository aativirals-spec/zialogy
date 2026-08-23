import React, { useState } from 'react';
import {
  Home,
  PlusCircle,
  Download,
  Share2,
  Check,
  Tag,
  Mic,
  Smartphone,
  Monitor,
  Film,
  Trash2,
  Play,
  CheckCircle2,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { RecentVideo } from '../types';

interface VideoResultPageProps {
  video: RecentVideo;
  recentVideos: RecentVideo[];
  onSelectVideo: (video: RecentVideo) => void;
  onDeleteVideo: (videoId: string) => void;
  onHome: () => void;
  onGenerateMore: () => void;
  onLogout?: () => void;
}

export const VideoResultPage: React.FC<VideoResultPageProps> = ({
  video,
  recentVideos,
  onSelectVideo,
  onDeleteVideo,
  onHome,
  onGenerateMore,
  onLogout,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(video.videoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col relative z-20 overflow-hidden">
      {/* Background Helium ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* Top Navigation Bar */}
      <header className="w-full flex items-center justify-between py-4 px-6 lg:px-12 border-b border-white/10 bg-[#07080d]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={onHome}>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400/40 flex items-center justify-center p-1 bg-black/80 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
            <img
              src="https://res.cloudinary.com/dawlj9ne4/image/upload/Z_Logo_j2whtg.png"
              alt="Zialogy"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex items-center tracking-[0.25em] text-white font-syne font-extrabold text-base sm:text-lg">
            Z I A L O G Y
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Home Studio</span>
          </button>

          <button
            type="button"
            onClick={onGenerateMore}
            className="btn-helium flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>Generate More Videos</span>
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium text-red-300 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Video Presentation Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-10">
        {/* Success Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e1017]/80 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Video Render Complete
              </h1>
              <p className="text-xs text-neutral-400">
                Your AI-generated commercial film is rendered in full quality.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-300" />
              <span>Download MP4</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video & Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Large Cinematic Video Player */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div
              className={`w-full rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl flex items-center justify-center ${
                video.orientation === 'portrait'
                  ? 'max-w-[340px] aspect-[9/16]'
                  : 'w-full aspect-[16/9]'
              }`}
            >
              <video
                key={video.videoUrl}
                src={video.videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick action bar below player */}
            <div className="w-full flex items-center justify-between pt-4 text-xs text-neutral-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span>Format: {video.orientation === 'portrait' ? '9:16 Vertical Story / Reel' : '16:9 Landscape Commercial'}</span>
              </span>
              <span>Duration: {video.duration}</span>
            </div>
          </div>

          {/* Right: Video Specifications & Director Prompt */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl bg-[#0e1017]/80 backdrop-blur-xl border border-white/10 p-5 space-y-4 shadow-lg">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-[10px] font-extrabold uppercase tracking-wider">
                  {video.style.toUpperCase()} FILM
                </span>
                <h2 className="text-xl font-bold text-white mt-1.5 leading-tight">
                  {video.title}
                </h2>
              </div>

              {/* Attributes List */}
              <div className="space-y-2.5 pt-2 border-t border-white/5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-cyan-300" /> Voice Narration
                  </span>
                  <span className="text-white font-semibold">{video.voice}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    {video.orientation === 'portrait' ? (
                      <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                    ) : (
                      <Monitor className="w-3.5 h-3.5 text-pink-400" />
                    )}
                    Aspect Ratio
                  </span>
                  <span className="text-white font-semibold">
                    {video.orientation === 'portrait' ? '9:16 Mobile' : '16:9 Cinematic'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Render Time</span>
                  <span className="font-mono text-cyan-300 font-bold">{video.duration}</span>
                </div>
              </div>

              {/* Prompt Brief */}
              <div className="pt-2 border-t border-white/5">
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Prompt Brief
                </label>
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-neutral-300 leading-relaxed max-h-[140px] overflow-y-auto">
                  {video.prompt}
                </div>
              </div>

              {/* Primary Call to Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onGenerateMore}
                  className="w-full btn-pill-cyan py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-between group shadow-lg cursor-pointer text-white"
                >
                  <div className="w-6 h-6" />
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-white" />
                    <span>GENERATE ANOTHER VIDEO</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-105 transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PREVIOUSLY GENERATED VIDEOS WITH ADD & REMOVE ACTIONS */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Film className="w-5 h-5 text-cyan-300" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Previously Generated Videos ({recentVideos.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={onGenerateMore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 text-xs font-semibold text-neutral-300 hover:text-cyan-200 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add / Generate New</span>
            </button>
          </div>

          {recentVideos.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0e1017]/80 backdrop-blur-xl border border-white/10 text-center space-y-3">
              <Film className="w-8 h-8 text-neutral-500 mx-auto" />
              <p className="text-sm text-neutral-400">No other generated videos in your library yet.</p>
              <button
                type="button"
                onClick={onGenerateMore}
                className="btn-helium px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Create First Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentVideos.map((item) => {
                const isCurrentPlaying = item.id === video.id;
                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-2xl overflow-hidden bg-[#0e1017]/80 backdrop-blur-xl border transition-all duration-200 flex flex-col justify-between ${
                      isCurrentPlaying
                        ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                        : 'border-white/10 hover:border-cyan-400/30 hover:bg-[#141724]'
                    }`}
                  >
                    {/* Thumbnail with overlay play */}
                    <div
                      className="relative aspect-video w-full bg-black/60 overflow-hidden cursor-pointer"
                      onClick={() => onSelectVideo(item)}
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 text-black flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                          <Play className="w-4 h-4 fill-black translate-x-0.5" />
                        </div>
                      </div>

                      {/* Duration Tag */}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-white border border-white/10">
                        {item.duration}
                      </span>

                      {/* Active Indicator Badge */}
                      {isCurrentPlaying && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 text-black text-[9px] font-extrabold uppercase tracking-wide">
                          NOW PLAYING
                        </span>
                      )}
                    </div>

                    {/* Meta details & Delete action */}
                    <div className="p-3.5 flex items-center justify-between gap-2">
                      <div
                        className="min-w-0 flex-1 cursor-pointer"
                        onClick={() => onSelectVideo(item)}
                      >
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                          {item.style.toUpperCase()} • {item.voice} • {item.timestamp}
                        </p>
                      </div>

                      {/* Remove / Delete Video Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove "${item.title}" from your library?`)) {
                            onDeleteVideo(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-colors shrink-0 cursor-pointer"
                        title="Delete video from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
