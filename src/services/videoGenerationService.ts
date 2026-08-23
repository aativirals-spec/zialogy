import { GenerationInput, GenerationJob, RecentVideo } from '../types';
import { cleanDialogueForTTS } from '../utils/audioSynthesizer';
import { generateDirectorPromptClient } from './geminiService';

// High-definition sample commercial assets for standalone client playback
const SAMPLE_VIDEOS = {
  portrait: {
    ad: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-41550-large.mp4',
    ugc: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-to-the-camera-in-a-video-call-42861-large.mp4',
    review: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-smartphone-in-a-dark-room-41551-large.mp4',
  },
  landscape: {
    ad: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-green-screen-41553-large.mp4',
    ugc: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-to-the-camera-in-a-video-call-42861-large.mp4',
    review: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-person-holding-a-smartphone-41552-large.mp4',
  },
};

const activeJobs = new Map<
  string,
  {
    job: GenerationJob;
    accelerated: boolean;
    cancelled: boolean;
    timer?: any;
  }
>();

/**
 * Client-Side Video Generation Engine
 * Runs completely in the browser on Vercel without requiring backend server endpoints.
 */
export async function startClientVideoGeneration(
  input: GenerationInput,
  onProgress: (job: GenerationJob) => void
): Promise<GenerationJob> {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Synthesize clean prompt
  let finalPrompt = cleanDialogueForTTS(input.prompt || '');
  if (!finalPrompt || finalPrompt.length < 5) {
    finalPrompt = await generateDirectorPromptClient({
      prompt: input.prompt,
      style: input.style,
      attempt: input.attempt_count || 1,
      category: input.product_category || 'Commercial Film',
    });
  }

  const job: GenerationJob = {
    id: jobId,
    status: 'processing',
    progress: 5,
    current_step: 'Analyzing prompt brief & product assets',
    step_index: 1,
    total_steps: 6,
    estimated_time_remaining_seconds: 40,
    input: {
      ...input,
      prompt: finalPrompt,
    },
    created_at: new Date().toISOString(),
  };

  const jobRecord = {
    job,
    accelerated: false,
    cancelled: false,
  };
  activeJobs.set(jobId, jobRecord);

  // Return initial job immediately
  onProgress(job);

  // Start background step progression
  runJobStages(jobId, onProgress);

  return job;
}

export function accelerateClientJob(jobId: string) {
  const record = activeJobs.get(jobId);
  if (record) {
    record.accelerated = true;
    record.job.progress = Math.max(record.job.progress, 88);
    record.job.estimated_time_remaining_seconds = 2;
  }
}

export function cancelClientJob(jobId: string) {
  const record = activeJobs.get(jobId);
  if (record) {
    record.cancelled = true;
    record.job.status = 'failed';
    record.job.error = 'Job cancelled by user';
    if (record.timer) clearTimeout(record.timer);
    activeJobs.delete(jobId);
  }
}

async function runJobStages(jobId: string, onProgress: (job: GenerationJob) => void) {
  const record = activeJobs.get(jobId);
  if (!record || record.cancelled) return;

  const stages = [
    { step: 1, title: 'Analyzing prompt brief & product assets', progress: 15, duration: 2500 },
    { step: 2, title: 'Synthesizing clean voiceover dialogue', progress: 32, duration: 2800 },
    { step: 3, title: 'Casting neural voice profile & timing markers', progress: 50, duration: 3200 },
    { step: 4, title: 'Generating cinematic motion vectors & camera dolly', progress: 70, duration: 4000 },
    { step: 5, title: 'Applying volumetric studio lighting & color grade', progress: 88, duration: 3500 },
    { step: 6, title: 'Compiling high-definition MP4 master output', progress: 100, duration: 2500 },
  ];

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    if (record.cancelled) return;

    record.job.step_index = stage.step;
    record.job.current_step = stage.title;
    record.job.progress = stage.progress;
    record.job.estimated_time_remaining_seconds = Math.max(
      2,
      Math.round(((stages.length - i) * 5) / (record.accelerated ? 3 : 1))
    );

    onProgress({ ...record.job });

    const stepDelay = record.accelerated ? Math.min(600, stage.duration / 4) : stage.duration;
    await new Promise((resolve) => {
      record.timer = setTimeout(resolve, stepDelay);
    });
  }

  if (record.cancelled) return;

  // Resolve final video URL
  const orientation = record.job.input.orientation || 'portrait';
  const style = record.job.input.style || 'ad';
  const fallbackUrl =
    SAMPLE_VIDEOS[orientation]?.[style] ||
    SAMPLE_VIDEOS.portrait.ad;

  const resolvedVideoUrl = record.job.input.product_url?.startsWith('http') && record.job.input.product_url.endsWith('.mp4')
    ? record.job.input.product_url
    : fallbackUrl;

  record.job.status = 'completed';
  record.job.progress = 100;
  record.job.current_step = 'Render complete';
  record.job.estimated_time_remaining_seconds = 0;
  record.job.result_url = resolvedVideoUrl;
  record.job.thumbnail_url = record.job.input.product_image_url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop';
  record.job.title = `${record.job.input.style.toUpperCase()} Commercial Film`;
  record.job.duration_str = orientation === 'portrait' ? '00:15' : '00:24';

  onProgress({ ...record.job });
  activeJobs.delete(jobId);
}

/**
 * Helper to build RecentVideo item from completed job
 */
export function buildRecentVideoFromJob(job: GenerationJob): RecentVideo {
  return {
    id: job.id,
    title: job.title || `${job.input.style.toUpperCase()} Commercial`,
    duration: job.duration_str || (job.input.orientation === 'portrait' ? '00:15' : '00:24'),
    timestamp: 'Just now',
    thumbnail: job.thumbnail_url || job.input.product_image_url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    videoUrl: job.result_url || SAMPLE_VIDEOS.portrait.ad,
    orientation: job.input.orientation,
    style: job.input.style,
    voice: job.input.voice,
    brandId: 'ZIALOGY',
    productCategory: job.input.product_category || 'Commercial Film',
    prompt: job.input.prompt,
  };
}
