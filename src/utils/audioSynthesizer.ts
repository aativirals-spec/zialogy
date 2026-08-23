import { VoiceOption } from '../types';

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentVoicePlayingId: string | null = null;
let audioContext: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];

// Initialize voices cache for SpeechSynthesis
let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

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

/**
 * High-compatibility voice sample playback engine.
 * Automatically tries:
 * 1. Cloudinary / remote audio sample if valid
 * 2. High-definition Web SpeechSynthesis with voice matching (gender, accent, language)
 * 3. Formant Web Audio synthesizer tone sweep if speech synthesis is disabled by browser
 */
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

  // 1. If voice has direct working audio URL
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

      audio.onerror = () => {
        currentAudio = null;
        playSpeechSynthesisFallback(voice, onStart, onEnd, onProgress, customText);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          playSpeechSynthesisFallback(voice, onStart, onEnd, onProgress, customText);
        });
      }
      return;
    } catch {
      // fallback
    }
  }

  // 2. Speech synthesis fallback
  playSpeechSynthesisFallback(voice, onStart, onEnd, onProgress, customText);
};

const playSpeechSynthesisFallback = (
  voice: VoiceOption,
  onStart: () => void,
  onEnd: () => void,
  onProgress?: (progressPercent: number) => void,
  customText?: string
) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const sanitizedText = cleanDialogueForTTS(
        customText || voice.sampleText || 'Experience next generation innovation crafted for what matters.'
      );
      const utterance = new SpeechSynthesisUtterance(sanitizedText);
      utterance.pitch = voice.pitch || 1.0;
      utterance.rate = voice.speed || 1.0;

      // Get latest voices
      let voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
      const isFemale = voice.gender === 'female';
      const isUrdu = voice.category === 'urdu' || voice.accent.includes('Urdu') || voice.accent.includes('Hindi');
      const isBritish = voice.accent.includes('British') || voice.accent.includes('RP') || voice.accent.includes('UK');
      const isAustralian = voice.accent.includes('Australian');

      const match = voices.find((v) => {
        const vLang = v.lang.toLowerCase();
        const vName = v.name.toLowerCase();
        if (isUrdu && (vLang.includes('ur') || vLang.includes('hi') || vName.includes('hindi') || vName.includes('urdu') || vName.includes('india'))) {
          return true;
        }
        if (isAustralian && (vLang.includes('au') || vName.includes('australia') || vName.includes('karen'))) {
          return true;
        }
        if (isBritish && (vLang.includes('gb') || vName.includes('uk') || vName.includes('british') || vName.includes('george') || vName.includes('oliver') || vName.includes('victoria') || vName.includes('daniel'))) {
          return true;
        }
        if (isFemale && (vName.includes('female') || vName.includes('samantha') || vName.includes('zira') || vName.includes('karen') || vName.includes('susan') || vName.includes('moira') || vName.includes('ava') || vName.includes('victoria'))) {
          return true;
        }
        if (!isFemale && (vName.includes('male') || vName.includes('david') || vName.includes('alex') || vName.includes('daniel') || vName.includes('mark') || vName.includes('guy'))) {
          return true;
        }
        return vLang.startsWith('en');
      });

      if (match) {
        utterance.voice = match;
      }

      let interval: any = null;
      let startTime = Date.now();
      const estimatedDurationMs = Math.max(2500, sanitizedText.length * 75);

      utterance.onstart = () => {
        startTime = Date.now();
        onStart();
        if (onProgress) {
          interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(95, Math.round((elapsed / estimatedDurationMs) * 100));
            onProgress(pct);
          }, 100);
        }
      };

      utterance.onend = () => {
        if (interval) clearInterval(interval);
        if (onProgress) onProgress(100);
        currentUtterance = null;
        currentVoicePlayingId = null;
        onEnd();
      };

      utterance.onerror = () => {
        if (interval) clearInterval(interval);
        currentUtterance = null;
        currentVoicePlayingId = null;
        playWebAudioSynthesizerFallback(voice, onStart, onEnd, onProgress);
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return;
    } catch {
      // fallback
    }
  }

  // 3. Web Audio Tone Synthesizer fallback
  playWebAudioSynthesizerFallback(voice, onStart, onEnd, onProgress);
};

/**
 * Web Audio Harmonic Synth Fallback (Guaranteed to produce sound in any modern browser)
 */
function playWebAudioSynthesizerFallback(
  voice: VoiceOption,
  onStart: () => void,
  onEnd: () => void,
  onProgress?: (progressPercent: number) => void
) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) {
      onStart();
      setTimeout(onEnd, 3000);
      return;
    }

    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const baseFreq = voice.gender === 'female' ? 340 : 180;
    const now = audioContext.currentTime;

    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 1.2);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, now + 2.5);

    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 1.2);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 2.5);

    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.8);
    osc2.stop(now + 2.8);

    activeOscillators = [osc1, osc2];

    onStart();
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      if (onProgress) onProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(interval);
        currentVoicePlayingId = null;
        onEnd();
      }
    }, 110);
  } catch {
    onStart();
    setTimeout(() => {
      currentVoicePlayingId = null;
      onEnd();
    }, 2800);
  }
}

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
  if (activeOscillators.length > 0) {
    activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    activeOscillators = [];
  }
  currentUtterance = null;
  currentVoicePlayingId = null;
};

export const isAnyVoicePlaying = () => {
  return currentAudio !== null || currentUtterance !== null || activeOscillators.length > 0;
};

export const getCurrentlyPlayingVoiceId = () => {
  return currentVoicePlayingId;
};
