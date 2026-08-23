import { GoogleGenAI } from '@google/genai';
import { VOICES } from '../data/voices';
import { VoiceOption } from '../types';
import { cleanDialogueForTTS } from '../utils/audioSynthesizer';
import { getDirectorFallbackPrompt } from '../data/directorPromptRules';

// Safely obtain Gemini client in browser environment using VITE_GEMINI_API_KEY
// Note: In client-side SPA environments (like Vercel static deployments), keys are configured via VITE_GEMINI_API_KEY
let clientInstance: GoogleGenAI | null = null;

export function getClientGemini(): GoogleGenAI | null {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  if (!apiKey) return null;

  if (!clientInstance) {
    try {
      clientInstance = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-client',
          },
        },
      });
    } catch (err) {
      console.warn('[Gemini Client] Initialization warning:', err);
      return null;
    }
  }
  return clientInstance;
}

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
 * AI Script Assistant / Polish using Gemini on client-side with smart autonomous fallback
 */
export async function enhancePromptWithGemini(
  prompt: string,
  category: string = 'Commercial',
  style: string = 'ad',
  voice: string = 'Lucas'
): Promise<ScriptAssistResult> {
  const ai = getClientGemini();
  const cleanInputPrompt = cleanDialogueForTTS(prompt || 'Dynamic brand commercial');

  if (ai) {
    try {
      const systemInstruction = `You are an expert commercial film director and creative advertising copywriter for Zialogy AI Studio.
Generate an evocative, precise video ad shot brief strictly adhering to the user's prompt brief and product theme.
CLEAN VOICE SCRIPT MANDATE:
- The voiceover scripts in each scene must contain ONLY words that should actually be spoken aloud.
- NEVER output audio tags, emotion tags, pacing tags, pause instructions, stage directions, performance notes, brackets, or ellipses.
- Deliver high-converting, punchy copy.

Return valid JSON with:
{
  "enhancedPrompt": "...",
  "recommendedAngle": "...",
  "recommendedLighting": "...",
  "suggestedTagline": "...",
  "scenes": [
    {"scene": 1, "description": "...", "camera": "...", "voiceover": "..."},
    {"scene": 2, "description": "...", "camera": "...", "voiceover": "..."}
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `User Prompt Brief: "${cleanInputPrompt}". Category: "${category}". Ad Style: "${style}". Voice: "${voice}".`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return {
        enhancedPrompt: cleanDialogueForTTS(parsed.enhancedPrompt || cleanInputPrompt),
        recommendedAngle: parsed.recommendedAngle || 'Dynamic 360° Orbit Reveal',
        recommendedLighting: parsed.recommendedLighting || 'Directional studio key light with volumetric depth',
        suggestedTagline: cleanDialogueForTTS(parsed.suggestedTagline || 'Engineered for What Matters.'),
        scenes: Array.isArray(parsed.scenes)
          ? parsed.scenes.map((s: any) => ({
              scene: s.scene || 1,
              description: s.description || '',
              camera: s.camera || 'Slow cinematic push',
              voiceover: cleanDialogueForTTS(s.voiceover || ''),
            }))
          : [
              {
                scene: 1,
                description: `Hero macro reveal of ${cleanInputPrompt} with atmospheric depth.`,
                camera: 'Slow pushing 50mm lens',
                voiceover: 'Built with relentless focus, precision, and craftsmanship.',
              },
            ],
      };
    } catch (err) {
      console.warn('[Gemini Client] enhancePromptWithGemini fallback:', err);
    }
  }

  // Autonomous fallback if no API key or network error
  return {
    enhancedPrompt: `${cleanInputPrompt}. 8K cinematic lighting, high-contrast dynamic camera sweep, sharp focus, vibrant color grading.`,
    recommendedAngle: 'Dynamic 360° Orbit',
    recommendedLighting: 'Directional studio key light with volumetric depth',
    suggestedTagline: 'Unmatched Excellence. Designed for What Matters.',
    scenes: [
      {
        scene: 1,
        description: `Hero reveal of ${cleanInputPrompt} with atmospheric depth of field sweep.`,
        camera: 'Slow pushing 50mm lens',
        voiceover: 'Built with relentless focus, precision, and craftsmanship.',
      },
      {
        scene: 2,
        description: 'Macro product feature highlight and resolving brand CTA lockup.',
        camera: 'Fluid orbit to lockup',
        voiceover: 'Experience the new standard today.',
      },
    ],
  };
}

/**
 * Match voice based on Register Tags & scene brief
 */
export async function matchVoiceWithGemini(
  prompt: string,
  category: string = 'Commercial',
  style: string = 'ad'
): Promise<{ matchedVoice: VoiceOption; reasoning: string }> {
  const p = ((prompt || '') + ' ' + (category || '') + ' ' + (style || '')).toLowerCase();

  const ai = getClientGemini();
  if (ai) {
    try {
      const voiceSummary = VOICES.map(
        (v) => `ID: "${v.id}", Name: "${v.name}", Code: "${v.voiceCode}", RegisterTag: "${v.registerTag}"`
      ).join('\n');

      const systemInstruction = `You are an expert audio casting director for commercial films.
Select the best matching voice actor from this table based on their Register Tag:
${voiceSummary}

Return valid JSON with:
{
  "matchedVoiceId": "...",
  "reasoning": "..."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Prompt Brief: "${prompt}" | Category: "${category}" | Style: "${style}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const found = VOICES.find((v) => v.id === parsed.matchedVoiceId || v.name.toLowerCase() === (parsed.matchedVoiceId || '').toLowerCase());
      if (found) {
        return {
          matchedVoice: found,
          reasoning: parsed.reasoning || `Matched based on Register Tag "${found.registerTag}"`,
        };
      }
    } catch (err) {
      console.warn('[Gemini Client] matchVoice fallback:', err);
    }
  }

  // Fast heuristic matching
  let best = VOICES[0]; // Lucas default

  if (p.includes('urdu') || p.includes('hindi') || p.includes('desi') || p.includes('pakistan') || p.includes('india')) {
    best = VOICES.find((v) => v.id === 'zayan') || VOICES[6];
  } else if (p.includes('british') || p.includes('prestige') || p.includes('luxury') || p.includes('automotive') || p.includes('tech')) {
    best = VOICES.find((v) => v.id === 'marcus') || VOICES[2];
  } else if (p.includes('ugc') || p.includes('tiktok') || p.includes('social') || p.includes('reels') || p.includes('youth') || style === 'ugc') {
    best = VOICES.find((v) => v.id === 'chloe') || VOICES[3];
  } else if (p.includes('beauty') || p.includes('skincare') || p.includes('wellness') || p.includes('fashion') || p.includes('lifestyle')) {
    best = VOICES.find((v) => v.id === 'emma') || VOICES[1];
  } else if (p.includes('nature') || p.includes('documentary') || p.includes('earth') || p.includes('organic') || p.includes('nutrition')) {
    best = VOICES.find((v) => v.id === 'david') || VOICES[4];
  } else if (p.includes('elegant') || p.includes('perfume') || p.includes('hospitality')) {
    best = VOICES.find((v) => v.id === 'sophia') || VOICES[5];
  } else if (p.includes('vibrant') || p.includes('australian') || p.includes('fitness') || p.includes('energy')) {
    best = VOICES.find((v) => v.id === 'amara') || VOICES[7];
  }

  return {
    matchedVoice: best,
    reasoning: `Matched based on register tag "${best.registerTag}" aligning with scene vibe.`,
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

  const ai = getClientGemini();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Create a 10-second commercial director shot and clean spoken voiceover script for Category: "${category}", Style: "${style}", Rotation Attempt: ${attempt}.
MANDATE: Output ONLY clean spoken voiceover copy and cinematic camera movement. No meta tags, no brackets, no stage directions.`,
      });
      const generated = response.text?.trim();
      if (generated && generated.length > 10) {
        return cleanDialogueForTTS(generated);
      }
    } catch (err) {
      console.warn('[Gemini Client] generateDirectorPrompt fallback:', err);
    }
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
