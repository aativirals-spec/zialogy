import React from 'react';
import {
  Sparkles,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Film,
  Play,
  X,
  Layers,
} from 'lucide-react';
import { GenerationJob, RecentVideo } from '../types';

interface GenerationModalProps {
  job: GenerationJob | null;
  onClose: () => void;
  onAccelerate?: () => void;
  onViewVideo?: (video: RecentVideo) => void;
  onRetry?: () => void;
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
  const isProcessing = job.status === 'processing' || job.status === 'pending';

  const formatRemainingTime = (seconds: number) => {
    if (seconds <= 0) return 'Almost ready...';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s remaining`;
  };

  const currentStep = job.current_step || 'Initializing 4K Video Pipeline...';
  const progressPercent = Math.min(100, Math.max(0, job.progress || 5));

  const handleOpenResult = () => {
    if (onViewVideo && isCompleted) {
      const videoItem: RecentVideo = {
        id: job.id,
        title: job.title || `${job.input.style?.toUpperCase() || 'AD'} Commercial`,
        duration: job.duration_str || '00:24',
        timestamp: 'Just now',
        thumbnail: job.thumbnail_url || job.input.product_image_url || '',
        videoUrl: job.result_url || '',
        orientation: job.input.orientation,
        style: job.input.style || 'ad',
        voice: job.input.voice,
        brandId: 'ZIALOGY',
        productCategory: job.input.product_category || 'Commercial Film',
        prompt: job.input.prompt,
      };
      onViewVideo(videoItem);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Luminous Helium Glow Ambient */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-pink-500/15 to-amber-400/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d0f17]/95 border border-white/15 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] space-y-6 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                isCompleted
                  ? 'bg-green-500/20 border-green-500/40 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : isFailed
                  ? 'bg-red-500/20 border-red-500/40 text-red-300'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isFailed ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <RefreshCw className="w-5 h-5 animate-spin" />
              )}
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-syne font-bold text-white tracking-wide">
                {isCompleted
                  ? 'Film Ready to Preview'
                  : isFailed
                  ? 'Generation Failed'
                  : 'Rendering 4K Brand Film'}
              </h3>
              <p className="text-xs text-neutral-400 font-jakarta">
                {isCompleted
                  ? 'High-definition video rendering finished'
                  : isFailed
                  ? 'An error occurred during generation'
                  : `Job ID: #${job.id.slice(0, 10)}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Display */}
        {isProcessing && (
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-300 font-medium font-space">
                  Step {job.step_index || 1} of {job.total_steps || 6}
                </span>
                <span className="text-white font-bold font-space">{progressPercent}%</span>
              </div>

              <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10 p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Step Description Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>{currentStep}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-jakarta pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{formatRemainingTime(job.estimated_time_remaining_seconds)}</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-300/80">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="capitalize">{job.input.style || 'ad'} mode</span>
                </div>
              </div>
            </div>

            {/* Prompt preview snapshot */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-neutral-400 font-jakarta line-clamp-2 italic">
              "{job.input.prompt || 'Autonomous brand director synthesis'}"
            </div>
          </div>
        )}

        {/* Completed State Preview */}
        {isCompleted && (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/80 border border-cyan-400/40 group shadow-2xl">
              <img
                src={job.thumbnail_url || job.input.product_image_url || ''}
                alt="Completed film"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleOpenResult}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 text-black flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)] transform hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-xs font-bold text-white">
                {job.duration_str || '00:24'} • 4K UHD
              </div>
            </div>
          </div>
        )}

        {/* Failed State Message */}
        {isFailed && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs space-y-1">
            <p className="font-semibold text-red-100">Generation Error</p>
            <p className="text-neutral-300">
              {job.error_message || 'The server encountered an error while processing the video job.'}
            </p>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Accelerate / Demo button for processing */}
          {isProcessing && onAccelerate && (
            <button
              type="button"
              onClick={onAccelerate}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-200 transition-all cursor-pointer"
              title="Fast-forward rendering simulation for quick review"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Fast-Forward Render</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end ml-auto">
            {isFailed && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-cyan-400 text-black font-bold text-xs hover:bg-cyan-300 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Generation</span>
              </button>
            )}

            {isCompleted && (
              <button
                type="button"
                onClick={handleOpenResult}
                className="w-full sm:w-auto btn-pill-cyan flex items-center justify-center gap-2 py-3 px-6 rounded-full text-white font-bold text-xs sm:text-sm tracking-wider cursor-pointer"
              >
                <Film className="w-4 h-4 text-white" />
                <span>OPEN RESULT PAGE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
