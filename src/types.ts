export type VideoOrientation = 'landscape' | 'portrait';
export type AdStyle = 'ad' | 'ugc' | 'review';

export interface VoiceOption {
  id: string;
  name: string;
  voiceCode: string;
  elevenLabsId: string;
  registerTag: string;
  shortTagline: string;
  fullDescription: string;
  description?: string;
  sampleText: string;
  gender: 'male' | 'female';
  category: 'cinematic' | 'promo' | 'urdu' | 'ugc' | 'deep' | string;
  waveformType: string;
  accent: string;
  isPro?: boolean;
  audioUrl?: string;
  pitch?: number;
  speed?: number;
  tags: string[];
}

export interface GenerationInput {
  prompt: string;
  product_url?: string;
  logo_url?: string;
  end_logo_url?: string;
  orientation: VideoOrientation;
  branch?: string;
  voice_id?: string;
  brand_id?: string;
  flow_type?: string;
  product_category?: string;
  product_image_url?: string;
  logo_image_url?: string;
  end_slide_image_url?: string;
  voice?: string;
  style?: AdStyle;
  duration?: number;
  attempt_count?: number;
}

export interface GenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  current_step: string;
  step_index: number;
  total_steps: number;
  estimated_time_remaining_seconds: number;
  input: GenerationInput;
  created_at: string;
  completed_at?: string;
  result_url?: string;
  thumbnail_url?: string;
  title?: string;
  duration_str?: string;
  error_message?: string;
  storyboard?: any[];
}

export interface RecentVideo {
  id: string;
  title: string;
  duration: string;
  timestamp: string;
  thumbnail: string;
  videoUrl: string;
  orientation: VideoOrientation;
  style: AdStyle;
  voice?: string;
  brandId?: string;
  productCategory?: string;
  prompt?: string;
}
