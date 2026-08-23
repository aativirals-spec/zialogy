import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Camera,
  MoveHorizontal,
  Sun,
  Image as ImageIcon,
  Check,
  Wand2,
  RefreshCw,
  Layers,
  Search,
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { AdStyle } from '../types';

export type ModifierType = 'angle' | 'shotType' | 'lighting' | 'imageStyle';

interface PresetItem {
  name: string;
  description: string;
  tag: string;
}

const PRESET_GROUPS: Record<ModifierType, { title: string; subtitle: string; icon: any; items: PresetItem[] }> = {
  angle: {
    title: 'Camera Angle Presets',
    subtitle: 'Define the optical camera position and perspective for your scene',
    icon: Camera,
    items: [
      {
        name: 'Low Angle Hero Shot',
        description: 'Upward perspective giving commanding presence and majestic scale',
        tag: 'low-angle hero perspective, towering product dominance, epic cinematic viewpoint',
      },
      {
        name: 'Eye-Level Commercial',
        description: 'Direct, balanced 50mm viewpoint with shallow depth of field',
        tag: 'eye-level cinematic framing, shallow depth of field, natural f/1.8 lens perspective',
      },
      {
        name: '45° Elevated Showcase',
        description: 'Clean isometric angle showing top surface and front branding',
        tag: '45-degree high three-quarter angle, complete product geometry showcase',
      },
      {
        name: 'Bird’s Eye Top-Down',
        description: 'Direct 90-degree flat lay with geometric symmetry and clean layout',
        tag: '90-degree overhead bird eye flat-lay, symmetrical minimalist composition',
      },
      {
        name: 'Dynamic Dutch Tilt',
        description: 'Canted dramatic horizon injecting velocity and modern edge',
        tag: 'dutch angle tilted frame, dynamic diagonal composition, kinetic energy',
      },
      {
        name: 'Over-the-Shoulder POV',
        description: 'First-person user viewpoint interacting with the product',
        tag: 'first-person POV over-the-shoulder shot, intimate consumer interaction',
      },
    ],
  },
  shotType: {
    title: 'Shot Type & Motion Presets',
    subtitle: 'Select camera focal framing and kinetic cinematography movements',
    icon: MoveHorizontal,
    items: [
      {
        name: '100mm Extreme Macro',
        description: 'Microscopic focus on packaging texture, embossing, and droplets',
        tag: '100mm extreme macro lens, razor-sharp textures, condensation beads, ultra-fine detail',
      },
      {
        name: 'Dynamic 360° Orbit',
        description: 'Continuous circular tracking shot revolving smoothly around product',
        tag: 'smooth 360-degree rotational orbit track, fluid Steadicam motion, flawless speed ramp',
      },
      {
        name: '120fps Slow-Motion Flow',
        description: 'Fluid liquid splashes, zero-gravity levitation, and drifting mist',
        tag: '120fps ultra slow-motion, levitating fluid dynamics, suspended micro-particles',
      },
      {
        name: 'Crash Zoom Reveal',
        description: 'Rapid kinetic push-in from atmospheric background to hero logo',
        tag: 'high-velocity crash zoom snap, seamless cinematic transition into logo lock',
      },
      {
        name: 'Dolly Zoom Vertigo',
        description: 'Background warps while the hero product maintains sharp focus',
        tag: 'cinematic Hitchcock dolly zoom vertigo effect, shifting perspective background',
      },
      {
        name: 'Medium Lifestyle Action',
        description: 'In-use action frame showing real-world utility and performance',
        tag: 'commercial medium shot, authentic real-world lifestyle context, fluid handheld motion',
      },
    ],
  },
  lighting: {
    title: 'Lighting & Atmosphere Presets',
    subtitle: 'Configure lighting direction, color temperature, and volumetric mood',
    icon: Sun,
    items: [
      {
        name: 'Volumetric Golden Hour',
        description: 'Warm amber sunbeams slicing through soft atmospheric morning mist',
        tag: 'volumetric golden hour sunbeams, warm 3200K amber backlighting, atmospheric haze',
      },
      {
        name: 'Cyberpunk Neon Edge',
        description: 'Electric cyan and magenta rim lighting with dark glossy reflections',
        tag: 'dual-tone neon rim lighting, electric cyan and magenta highlights, wet asphalt reflections',
      },
      {
        name: 'Studio Rembrandt Luxe',
        description: 'High-end commercial 3-point lighting on dark obsidian pedestal',
        tag: 'Rembrandt 3-point studio lighting, crisp keylight, subtle fill, obsidian pedestal reflection',
      },
      {
        name: 'Moody Noir Spotlight',
        description: 'Dramatic chiaroscuro with a razor-thin beam illuminating the logo',
        tag: 'deep noir chiaroscuro contrast, dramatic solitary beam of light, velvety dark shadows',
      },
      {
        name: 'High-Key Pure Daylight',
        description: 'Clean, shadowless modern illumination for skincare and minimalism',
        tag: 'high-key softbox daylight diffusion, pristine white balance, zero harsh shadows',
      },
      {
        name: 'Bioluminescent Ambient',
        description: 'Ethereal emerald, indigo, and soft cyan gradient luminescence',
        tag: 'bioluminescent soft glow, shifting aurora gradients, ethereal ambient luminescence',
      },
    ],
  },
  imageStyle: {
    title: 'Film Aesthetic & Texture',
    subtitle: 'Choose the visual rendering grade, camera sensor, and film stock',
    icon: ImageIcon,
    items: [
      {
        name: '35mm Anamorphic Film',
        description: 'Hollywood cinema look with subtle horizontal flares and Kodak grain',
        tag: '35mm anamorphic cinema film stock, subtle horizontal streak flares, rich organic grain',
      },
      {
        name: '8K Hyper-Realistic Octane',
        description: 'Uncompromising photorealism with subsurface scattering & sheen',
        tag: '8K Octane render aesthetics, physically based materials, metallic brushed luster',
      },
      {
        name: 'Editorial Haute Couture',
        description: 'Vogue-style high-contrast fashion photography and sharp color',
        tag: 'high-fashion editorial grade, razor-sharp edge contrast, vivid color science',
      },
      {
        name: 'Natural UGC Social',
        description: 'Handheld smartphone 4K authenticity for viral direct-response ads',
        tag: 'authentic 4K smartphone UGC video style, natural candid lighting, real customer feel',
      },
      {
        name: 'Futuristic Glassmorphism',
        description: 'Prismatic glass refractions, titanium highlights, and sleek minimalism',
        tag: 'futuristic frosted glass refractions, iridescent chrome accents, ultra-modern luxury',
      },
      {
        name: 'Vintage 90s Broadcast',
        description: 'Warm nostalgic broadcast TV tape texture with chromatic glow',
        tag: 'vintage 90s commercial aesthetic, subtle CRT phosphor warmth, nostalgic tape glow',
      },
    ],
  },
};

interface PromptAssistModalProps {
  type?: ModifierType | string | null;
  isOpen?: boolean;
  onClose: () => void;
  onSelectModifier?: (text: string) => void;
  onApplyPrompt?: (
    improvedPrompt: string,
    suggestedCategory?: string,
    suggestedStyle?: AdStyle
  ) => void;
  currentPrompt?: string;
  currentCategory?: string;
}

export const PromptAssistModal: React.FC<PromptAssistModalProps> = ({
  type = 'angle',
  isOpen = true,
  onClose,
  onSelectModifier,
  onApplyPrompt,
  currentPrompt = '',
  currentCategory = 'Commercial Film',
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'ai'>('presets');
  const [selectedModifierType, setSelectedModifierType] = useState<ModifierType>(
    (type && PRESET_GROUPS[type as ModifierType] ? type : 'angle') as ModifierType
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [customText, setCustomText] = useState('');
  const [appliedTag, setAppliedTag] = useState<string | null>(null);

  // AI Script Assistant State
  const [aiPromptInput, setAiPromptInput] = useState(currentPrompt);
  const [aiStyle, setAiStyle] = useState<AdStyle>('ad');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedScript, setAiGeneratedScript] = useState<string | null>(null);

  if (isOpen === false) return null;

  const currentGroup = PRESET_GROUPS[selectedModifierType] || PRESET_GROUPS.angle;
  const filteredItems = currentGroup.items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPreset = (tag: string) => {
    setAppliedTag(tag);
    if (onSelectModifier) {
      onSelectModifier(tag);
    }
    setTimeout(() => {
      onClose();
    }, 350);
  };

  const handleApplyCustom = () => {
    if (!customText.trim()) return;
    if (onSelectModifier) {
      onSelectModifier(customText.trim());
    }
    onClose();
  };

  // Google Gemini AI Assistant execution
  const handleRunAiAssist = async () => {
    if (!aiPromptInput.trim()) return;
    setIsAiLoading(true);

    const apiKey =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && (process.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY)) ||
      '';

    try {
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an award-winning commercial film director and copywriter.
Turn the following basic product or ad concept into a high-converting, vivid cinematic screenplay prompt suitable for 4K AI video generation.
Format should include: visual atmosphere, camera motion, macro product details, lighting, and pacing. Keep it under 60 words, punchy, and without markdown headers or fluff.

Style: ${aiStyle}
Concept: ${aiPromptInput}`,
        });

        const text = response.text?.trim();
        if (text) {
          setAiGeneratedScript(text);
          setIsAiLoading(false);
          return;
        }
      }

      // Fallback via server endpoint
      const res = await fetch('/api/script-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPromptInput,
          category: currentCategory,
          style: aiStyle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.enhancedPrompt) {
          setAiGeneratedScript(data.enhancedPrompt);
          setIsAiLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('AI Generation client fallback:', err);
    }

    // Heuristic fallback director format
    const enhanced = `Cinematic 4K master commercial for ${aiPromptInput.trim()}. 35mm anamorphic lens, high-speed 120fps fluid dynamics, volumetric studio rim lighting, and elegant slow-motion orbital camera tracking onto the pristine product packaging.`;
    setAiGeneratedScript(enhanced);
    setIsAiLoading(false);
  };

  const handleApplyAiScript = () => {
    if (!aiGeneratedScript) return;
    if (onSelectModifier) {
      onSelectModifier(aiGeneratedScript);
    }
    if (onApplyPrompt) {
      onApplyPrompt(aiGeneratedScript, currentCategory, aiStyle);
    }
    onClose();
  };

  return (
    <div
      id="prompt-assist-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d0f17]/95 border border-white/15 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {activeTab === 'presets' ? <Layers className="w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-syne font-bold text-white tracking-wide">
                Director Cinematography Studio
              </h3>
              <p className="text-xs text-neutral-400 font-jakarta">
                Inject studio camera angles, lighting moods, or generate complete scripts with AI
              </p>
            </div>
          </div>

          <button
            id="close-prompt-assist-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cinematic Presets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-pink-500/20 to-amber-500/20 text-pink-200 border border-pink-400/30 shadow-[0_0_10px_rgba(236,72,153,0.2)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Gemini AI Director Script</span>
          </button>
        </div>

        {activeTab === 'presets' ? (
          <div className="space-y-4">
            {/* Category Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(PRESET_GROUPS) as ModifierType[]).map((key) => {
                const grp = PRESET_GROUPS[key];
                const Icon = grp.icon;
                const isSelected = selectedModifierType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedModifierType(key);
                      setSearchQuery('');
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'bg-white/[0.03] text-neutral-400 hover:text-white border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{key === 'shotType' ? 'Shot Type' : key === 'imageStyle' ? 'Image' : key}</span>
                  </button>
                );
              })}
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${currentGroup.title.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-white text-xs placeholder:text-neutral-500 focus:outline-none"
              />
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isSelected = appliedTag === item.tag;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelectPreset(item.tag)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/10 hover:border-cyan-400/40 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {item.name}
                      </h4>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-cyan-300 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-cyan-400/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          +Add
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom modifier input */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Or type custom cinematography directive..."
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustom()}
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-white text-xs placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!customText.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shrink-0"
              >
                Insert
              </button>
            </div>
          </div>
        ) : (
          /* Gemini AI Assistant Tab */
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Product Concept or Brief:
              </label>
              <textarea
                rows={3}
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                placeholder="e.g. Luxury midnight perfume on black obsidian pedestal with mist and gold accents..."
                className="w-full p-3.5 rounded-2xl bg-black/50 border border-white/10 focus:border-cyan-400 text-white text-xs sm:text-sm placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed font-jakarta"
              />
            </div>

            {/* Style Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Target Style:</span>
              {(['ad', 'ugc', 'review'] as AdStyle[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setAiStyle(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    aiStyle === s
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  {s === 'ad' ? 'Cinematic' : s === 'ugc' ? 'UGC Social' : 'Review Spotlight'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRunAiAssist}
              disabled={isAiLoading || !aiPromptInput.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-amber-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 border border-white/15 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-lg transition-all"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 text-cyan-300 animate-spin" />
                  <span>Gemini AI Director Generating Screenplay...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Synthesize Director Screenplay</span>
                </>
              )}
            </button>

            {/* AI Generated Result */}
            {aiGeneratedScript && (
              <div className="p-4 rounded-2xl bg-cyan-500/[0.05] border border-cyan-400/30 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Generated Director Screenplay
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-jakarta">
                  {aiGeneratedScript}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleApplyAiScript}
                    className="btn-pill-cyan px-5 py-2 rounded-full text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    Apply Script to Prompt
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
