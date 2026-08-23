import { VoiceOption } from '../types';

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentVoicePlayingId: string | null = null;

/**
 * Clean spoken voiceover dialogue only (stripping any tags, brackets, pause cues, ellipses, meta labels)
 * ensuring only words meant to be spoken aloud reach the speech engine.
 */
export function cleanDialogueForTTS(rawText: string): string {
  if (!rawText) return '';
  return rawText
    // Remove markdown code fences
    .replace(/^```(?:json|text)?/gm, '')
    .replace(/```$/gm, '')
    // Remove outer quotes
    .replace(/^["'“”](.*)["'“”]$/s, '$1')
    // Remove bracketed cues like [confident], [pause], [sincere], [warm], [hesitates], [1s pause]
    .replace(/\[[^\]]*\]/g, ' ')
    // Remove parenthetical cues like (pause), (smiles), (softly)
    .replace(/\([^\)]*?\)/g, ' ')
    // Remove asterisk actions like *pause*
    .replace(/\*[^*]*\*/g, ' ')
    // Remove speaker prefixes like "VO:", "Narrator:", "Speaker 1:", "Dialogue:"
    .replace(/^(?:VO|Voiceover|Voice-over|Narrator|Speaker\s*\d+|Protagonist|Host|Character|Scene\s*\d+|Audio|Dialogue|Script)\s*:\s*/gim, '')
    .replace(/\b(?:VO|Voiceover|Voice-over|Narrator|Audio|Dialogue|Script)\s*:\s*/gi, '')
    // Remove conversational prefixes like "Here is the script:"
    .replace(/^(?:Here is the script|Here is the voiceover|Spoken script)\s*:\s*/gim, '')
    // Remove meta pause phrasing if generated
    .replace(/\b(?:followed\s+by|accompanied\s+by|featuring|including|with|after|before|taking|take|makes?|inserting?|adding?)\s+(?:a\s+|an\s+)?(?:\w+\s+)?(?:pauses?|puse)\b(?:\s+(?:for\s+)?(?:effect|breath|emphasis|a\s+moment|\d+[-\s]*(?:s|sec|seconds?)))?/gi, ' ')
    .replace(/\b(?:pauses?|puse)\s+(?:for\s+)?(?:effect|breath|emphasis|a\s+moment|\d+[-\s]*(?:s|sec|seconds?))\b/gi, ' ')
    .replace(/\b(?:\d+[-\s]*(?:s|sec|seconds?)|short|brief|slight|dramatic|long|micro)\s*(?:pauses?|puse)\b/gi, ' ')
    .replace(/\bstage\s*direction\b/gi, ' ')
    // Replace ellipses (...) with natural comma or period for TTS flow
    .replace(/\.{2,}/g, ', ')
    // Normalize dashes
    .replace(/\s*[—–-]{2,}\s*/g, ', ')
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*–\s*/g, ', ')
    // Normalize punctuation
    .replace(/,\s*\./g, '.')
    .replace(/\.\s*\./g, '.')
    .replace(/,\s*,+/g, ',')
    .replace(/\s+([.,!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export const playVoiceSample = (
  voice: VoiceOption,
  onStart: () => void,
  onEnd: () => void,
  onProgress?: (progressPercent: number) => void,
  customText?: string
) => {
  // Stop whatever is playing
  stopVoiceSample();
  currentVoicePlayingId = voice.id;

  // If custom text is provided, prefer Speech Synthesis to read the custom text cleanly
  if (customText && customText.trim().length > 0) {
    playSpeechSynthesisFallback(voice, onStart, onEnd, customText);
    return;
  }

  // 1. Try real Cloudinary MP3 Audio first
  if (voice.audioUrl && typeof Audio !== 'undefined') {
    try {
      const audio = new Audio(voice.audioUrl);
      currentAudio = audio;
      audio.preload = 'auto';

      audio.onplay = () => {
        onStart();
      };

      audio.ontimeupdate = () => {
        if (audio.duration && onProgress) {
          const pct = Math.min(100, Math.round((audio.currentTime / audio.duration) * 100));
          onProgress(pct);
        }
      };

      audio.onended = () => {
        currentAudio = null;
        currentVoicePlayingId = null;
        onEnd();
      };

      audio.onerror = (e) => {
        console.warn(`Cloudinary audio stream error for ${voice.name}, falling back to speech synthesis`, e);
        currentAudio = null;
        playSpeechSynthesisFallback(voice, onStart, onEnd, customText);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play autoplay restriction or network error:', err);
          playSpeechSynthesisFallback(voice, onStart, onEnd, customText);
        });
      }
      return;
    } catch (err) {
      console.warn('Audio construction failed, falling back to speech synthesis:', err);
    }
  }

  // 2. Speech synthesis fallback
  playSpeechSynthesisFallback(voice, onStart, onEnd, customText);
};

const playSpeechSynthesisFallback = (
  voice: VoiceOption,
  onStart: () => void,
  onEnd: () => void,
  customText?: string
) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const sanitizedText = cleanDialogueForTTS(customText || voice.sampleText || 'Experience the next generation today.');
      const utterance = new SpeechSynthesisUtterance(sanitizedText);
      utterance.pitch = voice.pitch || 1.0;
      utterance.rate = voice.speed || 1.0;

      const voices = window.speechSynthesis.getVoices();
      const isFemale = voice.gender === 'female';
      const isUrdu = voice.category === 'urdu';
      const isBritish = voice.accent.includes('British') || voice.accent.includes('UK');

      const match = voices.find((v) => {
        const vLang = v.lang.toLowerCase();
        const vName = v.name.toLowerCase();
        if (isUrdu && (vLang.includes('ur') || vLang.includes('hi') || vName.includes('hindi') || vName.includes('urdu'))) {
          return true;
        }
        if (isBritish && (vLang.includes('gb') || vName.includes('uk') || vName.includes('british') || vName.includes('george') || vName.includes('oliver') || vName.includes('victoria'))) {
          return true;
        }
        if (isFemale && (vName.includes('female') || vName.includes('samantha') || vName.includes('zira') || vName.includes('karen') || vName.includes('susan') || vName.includes('moira'))) {
          return true;
        }
        if (!isFemale && (vName.includes('male') || vName.includes('david') || vName.includes('alex') || vName.includes('daniel') || vName.includes('mark'))) {
          return true;
        }
        return vLang.startsWith('en');
      });

      if (match) {
        utterance.voice = match;
      }

      utterance.onstart = () => {
        onStart();
      };
      utterance.onend = () => {
        currentUtterance = null;
        currentVoicePlayingId = null;
        onEnd();
      };
      utterance.onerror = () => {
        currentUtterance = null;
        currentVoicePlayingId = null;
        onEnd();
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return;
    } catch {
      // safe fallback
    }
  }

  // Pure timer simulation fallback
  onStart();
  setTimeout(() => {
    currentVoicePlayingId = null;
    onEnd();
  }, 4000);
};

export const stopVoiceSample = () => {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  currentUtterance = null;
  currentVoicePlayingId = null;
};

export const isAnyVoicePlaying = () => {
  return currentAudio !== null || currentUtterance !== null;
};

export const getCurrentlyPlayingVoiceId = () => {
  return currentVoicePlayingId;
};
