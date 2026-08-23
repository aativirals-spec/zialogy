import React from 'react';
import { Sparkles, Film, HelpCircle, LogOut } from 'lucide-react';

interface HeaderProps {
  onNewProject?: () => void;
  onOpenHelp?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewProject, onOpenHelp, onLogout }) => {
  return (
    <header className="w-full flex items-center justify-between py-4 sm:py-5 px-6 lg:px-10 border-b border-white/10 bg-[#07080c]/85 backdrop-blur-xl sticky top-0 z-30">
      {/* Brand Monogram & Title */}
      <div className="flex items-center gap-3.5 cursor-pointer group" onClick={onNewProject}>
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 opacity-70 blur-sm group-hover:opacity-100 transition duration-300" />
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/30 flex items-center justify-center p-1 bg-black/90 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <img
              src="https://res.cloudinary.com/dawlj9ne4/image/upload/Z_Logo_j2whtg.png"
              alt="Zialogy Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-amber-100 font-syne font-extrabold text-base sm:text-lg drop-shadow">
          Z I A L O G Y
        </div>
      </div>

      {/* Header Actions / Badges */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-cyan-500/20 text-xs text-neutral-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-200/90 font-medium">AI Studio Ultra 4K Engine</span>
        </div>

        <button
          onClick={onOpenHelp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/30 text-xs text-neutral-300 transition-all cursor-pointer"
          title="Workflow Guide"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden md:inline">Guide</span>
        </button>

        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400/20 via-pink-400/20 to-amber-300/20 hover:from-cyan-400/30 hover:via-pink-400/30 hover:to-amber-300/30 border border-cyan-400/30 hover:border-pink-400/40 text-xs text-white font-medium transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
        >
          <Film className="w-3.5 h-3.5 text-cyan-300" />
          <span>New Film</span>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs text-red-300 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};
