import React from 'react';
import { Smartphone, Monitor, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { AdStyle, VideoOrientation } from '../types';

interface AdControlsProps {
  style: AdStyle;
  setStyle: (style: AdStyle) => void;
  orientation: VideoOrientation;
  setOrientation: (orientation: VideoOrientation) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  selectedVoiceName?: string;
}

export const AdControls: React.FC<AdControlsProps> = ({
  style,
  setStyle,
  orientation,
  setOrientation,
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Ad Style Pill Selector */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* AD option (Purple/Magenta pill gradient) */}
        <button
          type="button"
          onClick={() => setStyle('ad')}
          className={`py-3 px-3 rounded-full font-bold text-xs sm:text-sm tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
            style === 'ad'
              ? 'btn-pill-purple scale-[1.02]'
              : 'bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/10 hover:border-purple-400/40 backdrop-blur-md'
          }`}
        >
          <span>AD</span>
        </button>

        {/* UGC option (Amber/Coral pill gradient) */}
        <button
          type="button"
          onClick={() => setStyle('ugc')}
          className={`py-3 px-3 rounded-full font-bold text-xs sm:text-sm tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
            style === 'ugc'
              ? 'btn-pill-amber scale-[1.02]'
              : 'bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/10 hover:border-amber-400/40 backdrop-blur-md'
          }`}
        >
          <span>UGC</span>
        </button>

        {/* REVIEW FILMS option (Cyan/Blue pill gradient) */}
        <button
          type="button"
          onClick={() => setStyle('review')}
          className={`py-3 px-3 rounded-full font-bold text-xs sm:text-sm tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
            style === 'review'
              ? 'btn-pill-cyan scale-[1.02]'
              : 'bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/10 hover:border-cyan-400/40 backdrop-blur-md'
          }`}
        >
          <span>REVIEW FILMS</span>
        </button>
      </div>

      {/* Row with Orientation & Glowing Pill Generate Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Orientation Toggle (Pill style) */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full p-1 bg-[#0e1017]/90 border border-white/15 backdrop-blur-xl shadow-inner">
            <button
              type="button"
              onClick={() => setOrientation('portrait')}
              className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer ${
                orientation === 'portrait'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-cyan-300" />
              <span>Mobile (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => setOrientation('landscape')}
              className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer ${
                orientation === 'landscape'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4 text-cyan-300" />
              <span>Desktop (16:9)</span>
            </button>
          </div>
        </div>

        {/* Generate Button matching User Pill Gradient style with Right Chevron Circle */}
        <button
          id="generate-video-btn"
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="btn-pill-cyan flex-1 sm:flex-none flex items-center justify-between gap-4 py-3 px-6 rounded-full text-white font-bold text-xs sm:text-sm tracking-[0.2em] shadow-xl cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2">
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            )}
            <span>{isGenerating ? 'GENERATING FILM...' : 'GENERATE VIDEO'}</span>
          </div>

          <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/30 group-hover:scale-105 transition-all shrink-0">
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </button>
      </div>
    </div>
  );
};
