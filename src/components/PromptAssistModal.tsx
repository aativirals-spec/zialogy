import React from 'react';
import { X, Sparkles, Camera, Sun, Palette, Aperture, Check } from 'lucide-react';

interface PromptAssistModalProps {
  type: 'angle' | 'shotType' | 'lighting' | 'imageStyle';
  onClose: () => void;
  onSelectModifier: (preset: string) => void;
}

const PRESETS: Record<'angle' | 'shotType' | 'lighting' | 'imageStyle', { title: string; icon: any; items: { label: string; desc: string; value: string }[] }> = {
  angle: {
    title: 'Camera Angle Presets',
    icon: Camera,
    items: [
      { label: 'Low Angle Hero Shot', desc: 'Heroic upward angle giving product dominance & power', value: 'Low-angle hero perspective looking upward with dramatic cinematic presence' },
      { label: 'Eye-Level Macro Push', desc: 'Direct straight-on engagement with seamless push-in', value: 'Eye-level crisp straight-on camera tracking smoothly toward the label' },
      { label: 'High Angle Overhead Top-Down', desc: 'Top-down table lay flat clean architectural composition', value: 'High angle bird-eye flat lay with pristine geometric symmetry' },
      { label: '360° Motorized Orbit Dolly', desc: 'Continuous orbital motion capturing all surface reflections', value: '360-degree rotating orbital motorized dolly shot around product pedestal' },
      { label: 'Dutch Angle Dynamic Tension', desc: 'Slightly tilted high-fashion energy angle', value: 'Dutch angle canted frame delivering high-energy modern visual rhythm' },
    ],
  },
  shotType: {
    title: 'Shot Framing & Composition',
    icon: Aperture,
    items: [
      { label: 'Extreme Macro Dew Drop Detail', desc: 'Microscopic texture, droplet surface reflections', value: 'Extreme macro close-up showcasing glistening moisture droplets on packaging' },
      { label: 'Medium Studio Hero Reveal', desc: 'Balanced product presentation with contextual environment', value: 'Medium shot establishing product in high-end architectural studio' },
      { label: 'Wide Cinematic Pastoral / Urban', desc: 'Sweeping atmospheric landscape establishing setting', value: 'Wide sweeping cinematic establishing shot with natural atmospheric depth' },
      { label: 'First-Person POV Interaction', desc: 'Handheld unboxing or real touch reaction', value: 'First-person POV holding and interacting with product at natural eye-level' },
      { label: 'Slow-Motion Floating Particle Burst', desc: '120fps fluid speed ramp with hovering particles', value: '120fps ultra slow-motion with delicate suspended light particle bursts' },
    ],
  },
  lighting: {
    title: 'Lighting & Atmosphere',
    icon: Sun,
    items: [
      { label: 'Golden Hour Sunbeams', desc: 'Warm horizontal sunlight and soft specular blooms', value: 'Golden hour warm sunlight with glowing amber flares and soft shadows' },
      { label: 'Clean Architectural Daylight', desc: 'Pure neutral window light with airy highlights', value: 'Bright diffuse Nordic architectural daylight with zero harsh shadows' },
      { label: 'Cyber Luminous Neon Glow', desc: 'Deep dark base with electric cyan and magenta rim light', value: 'Dark moody aesthetic with vibrant neon cyan and fuchsia rim highlights' },
      { label: 'Studio Softbox Precision', desc: 'High-contrast commercial beauty lighting on frosted glass', value: 'Commercial dual softbox beauty lighting highlighting satin bottle curvature' },
      { label: 'Moody Cinematic Chiaroscuro', desc: 'Deep velvety shadows and focused spotlight beam', value: 'Cinematic chiaroscuro with dramatic single-source directional spotlight' },
    ],
  },
  imageStyle: {
    title: 'Visual Film Aesthetics',
    icon: Palette,
    items: [
      { label: 'Hyper-Realistic Commercial Film', desc: 'ARRI Alexa 8K commercial grading with subtle film grain', value: 'Photorealistic commercial 8K film grade, shallow depth of field, crisp focus' },
      { label: 'Vibrant UGC Mobile Camera', desc: 'Natural phone sensor tone, authentic candid vibrancy', value: 'Authentic 4K mobile sensor look with natural handheld motion and true skin tones' },
      { label: 'Luxury Minimalist Editorial', desc: 'High-end Vogue/GQ visual minimalism with matte textures', value: 'Minimalist editorial aesthetic with pearl whites and muted pastel tones' },
      { label: 'Futuristic Tech Holographic', desc: 'High-tech precision with light vector overlays', value: 'Futuristic tech commercial styling with clean geometry and light particles' },
      { label: 'Organic Earth & Pasture Naturalism', desc: 'Sun-drenched pastoral warmth with rich botanical greens', value: 'Warm earthy pastoral film grade with rich foliage greens and sunlit dust motes' },
    ],
  },
};

export const PromptAssistModal: React.FC<PromptAssistModalProps> = ({
  type,
  onClose,
  onSelectModifier,
}) => {
  const current = PRESETS[type];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0e1017]/95 border border-white/15 p-6 sm:p-7 shadow-2xl overflow-hidden space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">{current.title}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-400">
          Click any preset modifier below to instantly enrich your director prompt with precise cinematic directions:
        </p>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {current.items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelectModifier(item.value);
                onClose();
              }}
              className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-cyan-400/50 text-left transition-all group flex items-start justify-between gap-3 cursor-pointer"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.label}
                </span>
                <p className="text-[11px] text-neutral-400 leading-snug">{item.desc}</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-cyan-500/20 border border-white/10 group-hover:border-cyan-400/40 flex items-center justify-center text-neutral-400 group-hover:text-cyan-300 transition-all shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
