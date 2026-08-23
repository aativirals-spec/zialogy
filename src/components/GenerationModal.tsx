import React from 'react';
import { RefreshCw, Zap, X, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { GenerationJob, RecentVideo } from '../types';

interface GenerationModalProps {
  job: GenerationJob | null;
  onClose: () => void;
  onAccelerate: () => void;
  onViewVideo: (video: RecentVideo) => void;
  onRetry: () => void;
}

export const GenerationModal: React.FC<GenerationModalProps> = ({
  job,
  onClose,
  onAccelerate,
  onViewVideo,
  onRetry,
}) => {
  if (!job) return null;

  const isCompleted = job.status === 'completed';
  const isFailed = job.status === 'failed';
  const isProcessing = job.status === 'processing' || job.status === 'queued';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0e1017]/95 border border-white/15 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Processing State */}
        {isProcessing && (
          <div className="text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-pink-500 to-amber-400 animate-spin blur-md opacity-70" />
              <div className="relative w-full h-full rounded-full bg-[#08090f] border border-white/20 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-cyan-300 animate-spin" />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono uppercase tracking-widest">
                STAGE {job.step_index || 1} OF {job.total_steps || 6}
              </span>
              <h3 className="text-xl font-bold text-white tracking-wide">
                Rendering {job.input?.style?.toUpperCase() || 'AI'} Film
              </h3>
              <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                {job.current_step || 'Synthesizing motion vectors, camera dolly dynamics & audio cues...'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(8, job.progress)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>Progress: {job.progress}%</span>
                <span>~{job.estimated_time_remaining_seconds || 45}s remaining</span>
              </div>
            </div>

            {/* Accelerate / Boost Render Pill Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onAccelerate}
                className="w-full py-3 px-5 rounded-full btn-pill-amber flex items-center justify-between group shadow-lg cursor-pointer"
              >
                <div className="w-6 h-6" />
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-xs font-bold tracking-[0.16em]">ACCELERATE RENDER</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-105 transition-all">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Failed State */}
        {isFailed && (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Rendering Interrupted</h3>
              <p className="text-sm text-neutral-400">
                {job.error || 'The cluster encountered an unexpected load spike. Please try again.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onRetry}
              className="w-full py-3.5 px-6 rounded-full btn-pill-cyan flex items-center justify-between group cursor-pointer"
            >
              <div className="w-6 h-6" />
              <span className="text-xs font-bold tracking-[0.16em]">RETRY GENERATION</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}

        {/* Completed State */}
        {isCompleted && (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Film Rendered Successfully</h3>
              <p className="text-sm text-neutral-400">Your commercial is ready for preview and export.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const videoItem: RecentVideo = {
                  id: job.id,
                  title: job.title || 'Rendered Commercial',
                  duration: job.duration_str || '00:24',
                  timestamp: 'Just now',
                  thumbnail: job.thumbnail_url || '',
                  videoUrl: job.result_url || '',
                  orientation: job.input.orientation,
                  style: job.input.style,
                  voice: job.input.voice,
                  brandId: 'ZIALOGY',
                  productCategory: 'Commercial Film',
                  prompt: job.input.prompt,
                };
                onViewVideo(videoItem);
              }}
              className="w-full py-3.5 px-6 rounded-full btn-pill-purple flex items-center justify-between group cursor-pointer"
            >
              <div className="w-6 h-6" />
              <span className="text-xs font-bold tracking-[0.16em]">VIEW RENDERED FILM</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
