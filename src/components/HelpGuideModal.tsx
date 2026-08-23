import React from 'react';
import { X, HelpCircle, Film, Sparkles, Volume2, Image as ImageIcon, Layers, CheckCircle2 } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d0f17]/95 border border-white/15 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-syne font-bold text-white">
                Zialogy Studio Guide
              </h3>
              <p className="text-xs text-neutral-400 font-jakarta">
                Mastering the 4K AI Video Ad Generation Pipeline
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-4 text-xs font-jakarta text-neutral-300">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs border border-cyan-400/30">
                1
              </span>
              <span>Draft Your Commercial Brief</span>
            </div>
            <p className="text-neutral-400 pl-8">
              Describe your product, mood, and key value proposition. Click the{' '}
              <span className="text-cyan-300 font-semibold">"Prompt Assist"</span> wand to allow
              the AI Auto-Director to automatically enrich your concept into an industry-grade
              cinematic storyboard screenplay with camera angles and lighting tags.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs border border-pink-400/30">
                2
              </span>
              <span>Upload Visual Assets (Static Images)</span>
            </div>
            <div className="pl-8 space-y-1.5 text-neutral-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Product Shot:</strong> High-resolution hero photo
                  of the packaging or device.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-300 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Boxlogo (Optional):</strong> Corner brand watermark
                  rendered consistently throughout the film.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Endslide (Optional):</strong> Final call-to-action
                  outro graphic.
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs border border-purple-400/30">
                3
              </span>
              <span>Audio Actor Casting & Voiceover</span>
            </div>
            <p className="text-neutral-400 pl-8">
              Choose from 19 studio voice actors across Cinematic, Promo, UGC, and Urdu/Hindi styles.
              Preview spoken samples directly in the sidebar or use{' '}
              <span className="text-cyan-300 font-semibold">AI Matcher</span> to let Gemini select
              the perfect vocal timbre.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs border border-amber-400/30">
                4
              </span>
              <span>Render & Export in 4K</span>
            </div>
            <p className="text-neutral-400 pl-8">
              Click <strong className="text-white">"CREATE VIDEO AD"</strong> to start the pipeline.
              Track live progress in real-time and export high-definition video directly for TikTok,
              Instagram Reels, YouTube, or broadcast TV.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-pill-cyan px-6 py-2.5 rounded-full text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Got It, Let's Create
          </button>
        </div>
      </div>
    </div>
  );
};
