import { VOICES } from '../data/voices';
import { VoiceOption } from '../types';
import { cleanDialogueForTTS } from '../utils/audioSynthesizer';
import { getDirectorFallbackPrompt } from '../data/directorPromptRules';

export interface ScriptAssistResult {
  enhancedPrompt: string;
  recommendedAngle: string;
  recommendedLighting: string;
  suggestedTagline: string;
  scenes: Array<{
    scene: number;
    description: string;
    camera: string;
    voiceover: string;
  }>;
}

/**
 * AI Script Assistant / Polish - Fully autonomous client-side director engine
 */
export async function enhancePromptWithGemini(
  prompt: string,
  category: string = 'Commercial',
  style: string = 'ad',
  voice: string = 'Hank Turner'
): Promise<ScriptAssistResult> {
  const cleanInputPrompt = cleanDialogueForTTS(prompt || 'Dynamic brand commercial');

  // Dynamic autonomous prompt enhancement tailored to style and domain
  let angle = 'Dynamic 360° Orbit Reveal';
  let lighting = 'Directional studio key light with volumetric depth';
  let tagline = 'Engineered for What Matters.';
  let scene1VO = 'Built with relentless focus, precision, and craftsmanship.';
  let scene2VO = 'Experience the standard of excellence today.';

  const lowerStyle = (style || '').toLowerCase();
  const lowerPrompt = cleanInputPrompt.toLowerCase();

  if (lowerStyle === 'ugc' || lowerPrompt.includes('tiktok') || lowerPrompt.includes('social')) {
    angle = 'Front-facing selfie handheld push-in';
    lighting = 'Natural window daylight with clean ring-light catchlights';
    tagline = 'The one product everyone is talking about.';
    scene1VO = 'I literally cannot stop using this every single day.';
    scene2VO = 'Grab yours now before it completely sells out!';
  } else if (lowerStyle === 'review') {
    angle = '45° tabletop macro product tilt';
    lighting = 'Soft diffused overhead softbox illumination';
    tagline = 'Honest Quality You Can Trust.';
    scene1VO = 'After putting this to the test, the build quality is undeniable.';
    scene2VO = 'A genuine game changer that truly delivers.';
  } else if (lowerPrompt.includes('luxury') || lowerPrompt.includes('perfume') || lowerPrompt.includes('watch')) {
    angle = 'Ultra-slow 24fps cinematic dolly track';
    lighting = 'Moody chiaroscuro rim lighting on matte black marble';
    tagline = 'Timeless Elegance Redefined.';
    scene1VO = 'Elegance is never accidental. It is meticulously designed.';
    scene2VO = 'Step into the realm of timeless distinction.';
  } else if (lowerPrompt.includes('truck') || lowerPrompt.includes('rock') || lowerPrompt.includes('action')) {
    angle = 'Low-angle dynamic sweeping crane';
    lighting = 'High-contrast sunset flare with atmospheric dust particles';
    tagline = 'Unleash Unstoppable Power.';
    scene1VO = 'When the terrain demands everything, hesitation is not an option.';
    scene2VO = 'Dominate every challenge ahead.';
  }

  const enhancedPrompt = `${cleanInputPrompt}. High-definition commercial cinematography, ${angle.toLowerCase()}, ${lighting.toLowerCase()}, razor-sharp optical clarity, vibrant studio color grade.`;

  return {
    enhancedPrompt,
    recommendedAngle: angle,
    recommendedLighting: lighting,
    suggestedTagline: tagline,
    scenes: [
      {
        scene: 1,
        description: `Cinematic hero reveal of ${cleanInputPrompt} with ${angle.toLowerCase()}.`,
        camera: '50mm prime lens with shallow depth of field',
        voiceover: scene1VO,
      },
      {
        scene: 2,
        description: `Macro feature focus and seamless transition to final brand lockup.`,
        camera: 'Fluid orbital sweep to hero product card',
        voiceover: scene2VO,
      },
    ],
  };
}

/**
 * Match voice based on Register Tags & scene brief using comprehensive acoustic mapping
 */
export async function matchVoiceWithGemini(
  prompt: string,
  category: string = 'Commercial',
  style: string = 'ad'
): Promise<{ matchedVoice: VoiceOption; reasoning: string }> {
  const p = ((prompt || '') + ' ' + (category || '') + ' ' + (style || '')).toLowerCase();

  let best: VoiceOption = VOICES[1]; // Hank Turner default (punchy/Southern, confident-playful)

  if (p.includes('urdu') || p.includes('hindi') || p.includes('desi') || p.includes('pakistan') || p.includes('india') || p.includes('bollywood')) {
    if (p.includes('female') || p.includes('woman') || p.includes('beauty') || p.includes('cosmetics') || p.includes('glamour')) {
      best = VOICES.find((v) => v.id === 'monika_sogam') || VOICES[6]; // Monika Sogam: polished/commanding, premium (Hindi)
    } else if (p.includes('promo') || p.includes('high energy') || p.includes('fast') || p.includes('offer')) {
      best = VOICES.find((v) => v.id === 'aakash_aryan') || VOICES[18]; // Aakash Aryan: calm/rich, formal-authoritative
    } else if (p.includes('aspirational') || p.includes('fmcg') || p.includes('digital') || p.includes('devi')) {
      best = VOICES.find((v) => v.id === 'devi') || VOICES[12]; // Devi: polished/persuasive, premium (Hindi)
    } else {
      best = VOICES.find((v) => v.id === 'rudra') || VOICES[8]; // Rudra: grainy, luxury-authoritative (Urdu/Hindi)
    }
  } else if (p.includes('tough') || p.includes('action') || p.includes('truck') || p.includes('rock') || p.includes('raw') || p.includes('monster') || p.includes('gym') || p.includes('horror') || p.includes('concert')) {
    best = VOICES.find((v) => v.id === 'rex_thunder') || VOICES[0]; // Rex Thunder: raw/intense, high-energy
  } else if (p.includes('radio') || p.includes('dj') || p.includes('countdown') || p.includes('broadcast') || p.includes('bold') || p.includes('station')) {
    best = VOICES.find((v) => v.id === 'jerry_b') || VOICES[2]; // Jerry B.: bold/upbeat, broadcast-polished
  } else if (p.includes('tiktok') || p.includes('ugc') || p.includes('social') || p.includes('gen z') || p.includes('selfie') || p.includes('unboxing') || p.includes('reel')) {
    if (p.includes('educational') || p.includes('excited') || style === 'ugc') {
      best = VOICES.find((v) => v.id === 'liz') || VOICES[10]; // Liz: bright/expressive, educational-excited
    } else {
      best = VOICES.find((v) => v.id === 'kristen') || VOICES[3]; // Kristen: bright/energetic, youthful
    }
  } else if (p.includes('luxury') || p.includes('british') || p.includes('perfume') || p.includes('classy') || p.includes('fashion') || p.includes('fragrance') || p.includes('prestige')) {
    best = VOICES.find((v) => v.id === 'samara_x') || VOICES[14]; // Samara X: smooth/elegant, warm-classy (British)
  } else if (p.includes('villain') || p.includes('noir') || p.includes('calculating') || p.includes('mysterious') || p.includes('cruel') || p.includes('dark')) {
    best = VOICES.find((v) => v.id === 'jessica_anne_bogart') || VOICES[16]; // Jessica Anne Bogart: calculating/calm, eloquent-villain
  } else if (p.includes('trailer') || p.includes('grave') || p.includes('methodical') || p.includes('slow') || p.includes('knox')) {
    best = VOICES.find((v) => v.id === 'knox_dark') || VOICES[5]; // Knox Dark: deep/serious, slow-deliberate
  } else if (p.includes('documentary') || p.includes('audiobook') || p.includes('podcast') || p.includes('heritage') || p.includes('steady')) {
    best = VOICES.find((v) => v.id === 'corbin_ridge') || VOICES[4]; // Corbin Ridge: deep/resonant, calm-steady
  } else if (p.includes('wellness') || p.includes('soothing') || p.includes('meditation') || p.includes('gentle') || p.includes('warm') || p.includes('sleep')) {
    best = VOICES.find((v) => v.id === 'corinne') || VOICES[13]; // Corinne: soft, warm, soothing-calm
  } else if (p.includes('companion') || p.includes('romantic') || p.includes('intimate') || p.includes('reassuring') || p.includes('late-night')) {
    best = VOICES.find((v) => v.id === 'connery') || VOICES[15]; // Connery: calm/intense, intimate-reassuring
  } else if (p.includes('sports') || p.includes('fast') || p.includes('rhythmic') || p.includes('tempo') || p.includes('athletic')) {
    best = VOICES.find((v) => v.id === 'connor') || VOICES[17]; // Connor: bright/punchy, energetic-youthful
  } else if (p.includes('baritone') || p.includes('captain') || p.includes('charismatic') || p.includes('pitch') || p.includes('announcement')) {
    best = VOICES.find((v) => v.id === 'captain') || VOICES[7]; // Captain: baritone, confident-persuasive
  } else if (p.includes('modern') || p.includes('marketing') || p.includes('blake')) {
    best = VOICES.find((v) => v.id === 'blake') || VOICES[11]; // Blake: confident/upbeat, modern-promo
  } else if (p.includes('friendly') || p.includes('hale') || p.includes('smooth')) {
    best = VOICES.find((v) => v.id === 'hale') || VOICES[9]; // Hale: confident, friendly-persuasive
  }

  return {
    matchedVoice: best,
    reasoning: `Matched based on register tag "${best.registerTag}" aligning with scene vibe and category.`,
  };
}

/**
 * Generate bespoke director prompt for Autonomous Director mode
 */
export async function generateDirectorPromptClient({
  prompt,
  style = 'ad',
  attempt = 1,
  category = 'Commercial Film',
}: {
  prompt: string;
  style?: string;
  attempt?: number;
  category?: string;
}): Promise<string> {
  const clean = cleanDialogueForTTS(prompt);
  if (clean && clean.length > 5) {
    return clean;
  }

  return cleanDialogueForTTS(
    getDirectorFallbackPrompt({
      flow: (style || 'ad') as any,
      attempt: attempt || 1,
      productName: category || 'the product',
      category: category || '',
    })
  );
}
