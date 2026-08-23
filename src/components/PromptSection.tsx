import React, { useState } from 'react';
import {
  ArrowUp,
  Camera,
  MoveHorizontal,
  Sun,
  Image as ImageIcon,
  Sparkles,
  Wand2,
  Info,
} from 'lucide-react';

interface PromptSectionProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onSubmitPrompt: () => void;
  onOpenPresetPicker: (type: 'angle' | 'shotType' | 'lighting' | 'imageStyle') => void;
  onAutoEnhance?: () => void;
  isEnhancing?: boolean;
  attemptCount?: number;
  adStyle?: 'ad' | 'ugc' | 'review';
}

export const PromptSection: React.FC<PromptSectionProps> = ({
  prompt,
  setPrompt,
  onSubmitPrompt,
  onOpenPresetPicker,
  onAutoEnhance,
  isEnhancing,
  attemptCount = 1,
  adStyle = 'ad',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmitPrompt();
    }
  };

  const getAutoDirectorBadge = () => {
    if (adStyle === 'ugc') {
      return attemptCount === 1 ? 'UGC Selfie Flow (Auto-Grounded)' : 'UGC Candid Flow (Auto-Grounded)';
    }
    if (adStyle === 'review') {
      return 'Review Spotlight Flow (Auto-Grounded)';
    }
    if (attemptCount === 1) return 'Auto-Director: Domain-Aware Aesthetic';
    if (attemptCount === 2) return 'Auto-Director: Deep Context Focus';
    if (attemptCount === 3) return 'Auto-Director: Dynamic Studio Reveal';
    return 'Auto-Director: High-Impact Promo';
  };

  return (
    <div className="w-full space-y-4">
      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white">
          AI-GENERATED <br />
          <span className="text-gold-gradient font-black">BRAND FILMS.</span>
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base font-normal max-w-xl">
          Describe your idea or leave blank with just your product image / URL for automated cinematic brand direction.
        </p>
      </div>

      {/* Main Prompt Input Box */}
      <div
        className={`relative w-full rounded-2xl bg-[#0e1017]/80 backdrop-blur-xl border transition-all duration-300 ${
          isFocused
            ? 'border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.2),0_0_15px_rgba(236,72,153,0.15)] ring-1 ring-cyan-400/40'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[125px] sm:min-h-[140px]">
          <textarea
            id="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your shot or scene (or leave blank with image/URL only for Auto-Director)..."
            rows={3}
            className="w-full bg-transparent text-white placeholder:text-neutral-500 text-sm sm:text-base focus:outline-none resize-none leading-relaxed pr-12"
          />

          {/* Bottom helper row inside prompt */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              {onAutoEnhance && (
                <button
                  type="button"
                  onClick={onAutoEnhance}
                  disabled={isEnhancing}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-200 hover:text-white transition-all border border-cyan-400/30 disabled:opacity-50 text-xs cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                >
                  <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{isEnhancing ? 'Director AI Enhancing...' : 'AI Director Polish'}</span>
                </button>
              )}

              {/* Zero-Prompt Indicator */}
              {!prompt.trim() && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/25">
                  <Info className="w-3 h-3 text-cyan-300" />
                  <span>{getAutoDirectorBadge()}</span>
                </span>
              )}
            </div>

            {/* Circular submit button with Helium gradient */}
            <button
              id="prompt-submit-btn"
              type="button"
              onClick={onSubmitPrompt}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 text-black flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              title="Submit prompt & generate"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Modifier Quick Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onOpenPresetPicker('angle')}
          className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-[#0f1118]/80 hover:bg-[#161824] border border-white/10 hover:border-cyan-400/40 text-neutral-300 hover:text-cyan-200 text-xs sm:text-sm font-medium transition-all group cursor-pointer"
        >
          <Camera className="w-4 h-4 text-neutral-400 group-hover:text-cyan-300 transition-colors" />
          <span>Angle</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenPresetPicker('shotType')}
          className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-[#0f1118]/80 hover:bg-[#161824] border border-white/10 hover:border-pink-400/40 text-neutral-300 hover:text-pink-200 text-xs sm:text-sm font-medium transition-all group cursor-pointer"
        >
          <MoveHorizontal className="w-4 h-4 text-neutral-400 group-hover:text-pink-400 transition-colors" />
          <span>Shot Type</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenPresetPicker('lighting')}
          className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-[#0f1118]/80 hover:bg-[#161824] border border-white/10 hover:border-amber-400/40 text-neutral-300 hover:text-amber-200 text-xs sm:text-sm font-medium transition-all group cursor-pointer"
        >
          <Sun className="w-4 h-4 text-neutral-400 group-hover:text-amber-300 transition-colors" />
          <span>Lighting</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenPresetPicker('imageStyle')}
          className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-[#0f1118]/80 hover:bg-[#161824] border border-white/10 hover:border-cyan-400/40 text-neutral-300 hover:text-cyan-200 text-xs sm:text-sm font-medium transition-all group cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-neutral-400 group-hover:text-cyan-300 transition-colors" />
          <span>Image</span>
        </button>
      </div>
    </div>
  );
};
