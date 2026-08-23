import React, { useState, useEffect } from 'react';
import {
  Mic,
  Search,
  Play,
  Pause,
  MoreVertical,
  X,
  Check,
  Volume2,
  ArrowRight,
  Sparkles,
  Info,
  ExternalLink,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { VoiceOption } from '../types';
import { VOICES } from '../data/voices';
import { playVoiceSample, stopVoiceSample } from '../utils/audioSynthesizer';
import { matchVoiceWithGemini } from '../services/geminiService';

interface VoiceOverSidebarProps {
  selectedVoice: string;
  onSelectVoice: (voice: VoiceOption) => void;
  onClose?: () => void;
  currentPrompt?: string;
  productCategory?: string;
  adStyle?: string;
}

export const VoiceOverSidebar: React.FC<VoiceOverSidebarProps> = ({
  selectedVoice,
  onSelectVoice,
  onClose,
  currentPrompt,
  productCategory,
  adStyle,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [expandedAll, setExpandedAll] = useState<boolean>(false);
  const [inspectingVoice, setInspectingVoice] = useState<VoiceOption | null>(null);
  const [isAutoMatching, setIsAutoMatching] = useState<boolean>(false);
  const [matchSuccessNotice, setMatchSuccessNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'cinematic', label: 'Cinematic' },
    { id: 'promo', label: 'Promo' },
    { id: 'urdu', label: 'Urdu / Hindi' },
    { id: 'ugc', label: 'UGC' },
    { id: 'deep', label: 'Deep Voice' },
  ];

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopVoiceSample();
    };
  }, []);

  const filteredVoices = VOICES.filter((voice) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      voice.name.toLowerCase().includes(q) ||
      voice.voiceCode.toLowerCase().includes(q) ||
      voice.registerTag.toLowerCase().includes(q) ||
      voice.shortTagline.toLowerCase().includes(q) ||
      voice.tags.some((t) => t.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'male') return voice.gender === 'male';
    if (activeCategory === 'female') return voice.gender === 'female';
    if (activeCategory === 'urdu') return voice.category === 'urdu';
    if (activeCategory === 'cinematic') return voice.category === 'cinematic';
    if (activeCategory === 'promo') return voice.category === 'promo';
    if (activeCategory === 'ugc') return voice.category === 'ugc';
    if (activeCategory === 'deep') return voice.category === 'deep' || voice.tags.some(t => t.toLowerCase().includes('deep'));
    return voice.category === activeCategory;
  });

  const displayedVoices = expandedAll ? filteredVoices : filteredVoices.slice(0, 9);

  const handlePlayToggle = (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingVoiceId === voice.id) {
      stopVoiceSample();
      setPlayingVoiceId(null);
      setPlaybackProgress(0);
    } else {
      setPlayingVoiceId(voice.id);
      setPlaybackProgress(0);
      playVoiceSample(
        voice,
        () => {
          setPlayingVoiceId(voice.id);
        },
        () => {
          setPlayingVoiceId(null);
          setPlaybackProgress(0);
        },
        (progress) => {
          setPlaybackProgress(progress);
        }
      );
    }
  };

  // AI Voice Matching based on Register Tags & User Brief
  const handleSmartVoiceMatch = async () => {
    setIsAutoMatching(true);
    try {
      const result = await matchVoiceWithGemini(
        currentPrompt || '',
        productCategory || 'Commercial',
        adStyle || 'ad'
      );
      if (result && result.matchedVoice) {
        onSelectVoice(result.matchedVoice);
        setMatchSuccessNotice(`Matched "${result.matchedVoice.name}" (${result.matchedVoice.registerTag})`);
        setTimeout(() => setMatchSuccessNotice(null), 4000);
      }
    } catch {
      // safe fallback
    } finally {
      setIsAutoMatching(false);
    }
  };

  const getWaveformColor = (type: string) => {
    switch (type) {
      case 'gold':
        return '#E5A93C';
      case 'purple':
        return '#8B5CF6';
      case 'magenta':
        return '#EC4899';
      case 'green':
        return '#10B981';
      case 'orange':
        return '#F97316';
      case 'blue':
        return '#3B82F6';
      case 'indigo':
        return '#6366F1';
      default:
        return '#E5A93C';
    }
  };

  return (
    <div className="w-full bg-[#0e1017]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
      {/* Background Helium glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4">
        {/* Header matching reference */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-cyan-300" />
            <h2 className="text-xs sm:text-sm font-syne font-bold tracking-wider uppercase text-white">
              VOICE OVER
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-[11px] font-space font-medium">
              {VOICES.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* AI Auto-Match Button */}
            <button
              type="button"
              onClick={handleSmartVoiceMatch}
              disabled={isAutoMatching}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-[11px] font-semibold text-cyan-200 transition-all hover:shadow-[0_0_12px_rgba(6,182,212,0.25)] disabled:opacity-50 cursor-pointer"
              title="Auto-match voice from scene brief"
            >
              <Sparkles className={`w-3 h-3 text-cyan-300 ${isAutoMatching ? 'animate-spin' : ''}`} />
              <span>{isAutoMatching ? 'Matching...' : 'Auto Match'}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                title="Close Voice Panel"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Success Notice if Auto-Matched */}
        {matchSuccessNotice && (
          <div className="py-1.5 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-[11px] flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <span className="truncate">⚡ {matchSuccessNotice}</span>
            <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-cyan-300" />
          </div>
        )}

        {/* Filter Categories Chips matching reference */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 py-1 px-3 rounded-full text-[11px] font-jakarta transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5 font-medium'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Voices Input matching reference */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search voice, code (M10, F6), or register tags..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#08090f] border border-white/10 text-white placeholder:text-neutral-500 text-xs focus:outline-none focus:border-cyan-400/50 font-jakarta"
          />
        </div>

        {/* Voice List matching reference */}
        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {displayedVoices.map((voice) => {
            const isSelected = selectedVoice.toLowerCase() === voice.name.toLowerCase();
            const isPlaying = playingVoiceId === voice.id;
            const waveColor = getWaveformColor(voice.waveformType);

            return (
              <div
                key={voice.id}
                onClick={() => onSelectVoice(voice)}
                className={`group relative rounded-xl p-3 flex flex-col justify-between border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#101422]/90 border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-[#0f1118]/80 hover:bg-[#141724] border-white/5 hover:border-white/15'
                }`}
              >
                {/* Top Row: Play button + Info + Code Badge + Checkmark */}
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => handlePlayToggle(voice, e)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shrink-0 ${
                        isPlaying
                          ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                          : 'bg-white/10 group-hover:bg-white/20 text-white'
                      }`}
                      title={isPlaying ? 'Pause Cloudinary sample' : 'Play Cloudinary audio preview'}
                    >
                      {isPlaying ? (
                        <Pause className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-syne font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {voice.name}
                        </span>
                        {voice.isPro && (
                          <span className="px-1.5 py-0.2 rounded bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[8px] font-space font-bold uppercase">
                            PRO
                          </span>
                        )}
                        {isSelected && (
                          <span className="flex items-center text-cyan-300 text-[10px] font-bold">
                            <Check className="w-3 h-3 ml-0.5" />
                          </span>
                        )}
                      </div>

                      {/* Tagline */}
                      <p className="text-[10.5px] text-neutral-400 truncate max-w-[170px] sm:max-w-[190px]">
                        {voice.shortTagline || voice.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Code Badge (M10, M4, etc.) + Waveform */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-space font-medium text-neutral-300">
                      {voice.voiceCode.split('–')[0].trim() || 'VOICE'}
                    </span>

                    {/* Waveform graphic */}
                    <div className="flex items-center gap-0.5 h-5 px-0.5">
                      {[4, 11, 16, 7, 15, 18, 10, 5, 14, 9, 17, 8, 12, 6, 14, 8].map(
                        (h, i) => (
                          <span
                            key={i}
                            className={`w-[2px] rounded-full transition-all duration-200 ${
                              isPlaying ? 'animate-wave-bar' : ''
                            }`}
                            style={{
                              height: isPlaying ? undefined : `${h}px`,
                              backgroundColor: waveColor,
                              animationDelay: `${i * 0.045}s`,
                              opacity: isPlaying ? 1 : 0.7,
                            }}
                          />
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingVoice(voice);
                      }}
                      className="p-1 rounded text-neutral-500 hover:text-white"
                      title="Inspect Voice Bio & Register Tag"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Register Tag & ElevenLabs ID Indicator */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="truncate max-w-[200px] text-neutral-300 font-jakarta">
                    <span className="text-cyan-300/90 font-medium">Tag:</span> {voice.registerTag}
                  </span>

                  <span className="font-space text-[9px] text-neutral-400">
                    ID: {voice.elevenLabsId.substring(0, 6)}...
                  </span>
                </div>

                {/* Progress bar if playing */}
                {isPlaying && playbackProgress > 0 && (
                  <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full transition-all duration-150"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Expand Button */}
      <div className="pt-3 border-t border-white/5 mt-3 text-center">
        <button
          type="button"
          onClick={() => setExpandedAll(!expandedAll)}
          className="inline-flex items-center gap-1.5 text-xs font-syne font-semibold text-neutral-400 hover:text-cyan-300 transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <span>{expandedAll ? 'Show less voices' : `View all ${VOICES.length} voices`}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inspect Voice Modal */}
      {inspectingVoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl bg-[#12141a] border border-white/15 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center text-[#F3CA68]">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-syne font-bold text-white">
                    {inspectingVoice.name}
                  </h3>
                  <p className="text-[10px] font-space text-neutral-400">
                    {inspectingVoice.voiceCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingVoice(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-300 leading-relaxed font-jakarta">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-space uppercase text-[#F3CA68] font-bold">
                  Audio-Script LLM Register Tag
                </span>
                <p className="font-mono text-white text-xs">{inspectingVoice.registerTag}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-space uppercase text-neutral-400 font-semibold">
                  Voice Character Bio
                </span>
                <p className="text-neutral-300 text-xs">{inspectingVoice.fullDescription}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-space uppercase text-neutral-400 font-semibold">
                  Sample Audition Script
                </span>
                <p className="text-white italic text-xs">"{inspectingVoice.sampleText}"</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span>ElevenLabs Voice ID:</span>
                <span className="font-space text-white font-mono">{inspectingVoice.elevenLabsId}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={(e) => {
                  handlePlayToggle(inspectingVoice, e);
                }}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audition Audio</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectVoice(inspectingVoice);
                  setInspectingVoice(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#E5A93C] hover:bg-[#F3CA68] text-black text-xs font-bold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Select {inspectingVoice.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
