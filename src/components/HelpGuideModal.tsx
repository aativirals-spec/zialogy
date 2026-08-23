import React from 'react';
import { X, Sparkles, Film, Mic, Upload, CheckCircle2, ChevronRight } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0e1017]/95 border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center text-cyan-300">
                <Film className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Zialogy AI Studio Workflow
              </h3>
              <p className="text-xs text-neutral-400">Step-by-step guide to generating high-converting video ads</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center text-xs">1</span>
              <span>1. Enter Prompt or Use Autonomous Director Mode</span>
            </div>
            <p className="text-neutral-400 text-xs pl-8">
              Type your custom campaign brief or spoken script. If you leave it empty, our Autonomous Director Engine will automatically construct an optimized commercial, UGC, or review storyboard tailored to your product.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40 flex items-center justify-center text-xs">2</span>
              <span>2. Upload Brand Assets</span>
            </div>
            <p className="text-neutral-400 text-xs pl-8">
              Upload your <strong>Hero Product Shot</strong>, an optional <strong>Box Logo</strong> for persistent corner branding, and an <strong>End Slide Logo</strong> for the final CTA resolve.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center text-xs">3</span>
              <span>3. Choose Ad Style, Aspect Ratio & Voice</span>
            </div>
            <p className="text-neutral-400 text-xs pl-8">
              Select between <strong>AD (Commercial)</strong>, <strong>UGC (Social / TikTok)</strong>, and <strong>REVIEW FILMS</strong>. Choose <strong>9:16 Mobile</strong> for Reels/TikTok or <strong>16:9 Landscape</strong> for TV and YouTube ads. Pick from our ElevenLabs neural voices with instant Cloudinary audio previews.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center justify-center text-xs">4</span>
              <span>4. Generate & Download High-Definition MP4</span>
            </div>
            <p className="text-neutral-400 text-xs pl-8">
              Hit <strong>Generate Video</strong>. Once complete, you will land directly on the dedicated full-screen video player where you can review frame details, download the MP4, or copy the shareable link.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-full btn-pill-cyan flex items-center justify-between group cursor-pointer"
          >
            <div className="w-6 h-6" />
            <span className="text-xs font-bold tracking-[0.16em]">GOT IT, START CREATING</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
