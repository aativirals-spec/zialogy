import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Play, MoreVertical, Clock, Film } from 'lucide-react';
import { RecentVideo } from '../types';

interface RecentVideosCarouselProps {
  videos: RecentVideo[];
  onSelectVideo: (video: RecentVideo) => void;
  onNewProject: () => void;
  onDeleteVideo?: (id: string) => void;
}

export const RecentVideosCarousel: React.FC<RecentVideosCarouselProps> = ({
  videos,
  onSelectVideo,
  onNewProject,
  onDeleteVideo,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-3 pt-6 border-t border-white/10">
      {/* Header & Controls matching reference */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            RECENT VIDEOS
          </h3>
          <span className="text-[11px] text-neutral-500">({videos.length})</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-7 h-7 rounded-lg bg-[#14161f] hover:bg-[#1f2230] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-7 h-7 rounded-lg bg-[#14161f] hover:bg-[#1f2230] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
      >
        {/* + New Project Card matching reference */}
        <div
          onClick={onNewProject}
          className="w-[140px] sm:w-[155px] shrink-0 rounded-2xl bg-[#0e1017]/80 hover:bg-[#141724] border border-dashed border-white/15 hover:border-cyan-400/50 flex flex-col items-center justify-center min-h-[145px] p-3 text-center cursor-pointer transition-all group backdrop-blur-md"
        >
          <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-cyan-500/10 border border-white/10 group-hover:border-cyan-400/40 flex items-center justify-center text-neutral-400 group-hover:text-cyan-300 transition-colors mb-2">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-neutral-300 group-hover:text-white">
            New Project
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5">Start blank ad</span>
        </div>

        {/* Video Cards matching reference */}
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video)}
            className="w-[200px] sm:w-[220px] shrink-0 rounded-2xl bg-[#0e1017]/80 border border-white/10 hover:border-cyan-400/50 overflow-hidden cursor-pointer transition-all duration-200 group hover:shadow-[0_4px_25px_rgba(6,182,212,0.2)] flex flex-col justify-between backdrop-blur-md"
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Duration Badge matching reference */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-white tracking-wider">
                {video.duration}
              </div>

              {/* Orientation tag */}
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-white/10 backdrop-blur-sm text-[9px] uppercase text-neutral-300 font-medium">
                {video.orientation === 'portrait' ? '9:16' : '16:9'}
              </div>

              {/* Play hover button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 text-black flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] transform group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* Video Info footer matching reference */}
            <div className="p-2.5 flex items-center justify-between">
              <div className="text-left truncate pr-2">
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {video.title}
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                  <span>{video.timestamp}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectVideo(video);
                }}
                className="p-1 rounded text-neutral-500 hover:text-white shrink-0"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
