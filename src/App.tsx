/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { PromptSection } from './components/PromptSection';
import { AssetUploadSection } from './components/AssetUploadSection';
import { AdControls } from './components/AdControls';
import { VoiceOverSidebar } from './components/VoiceOverSidebar';
import { RecentVideosCarousel } from './components/RecentVideosCarousel';
import { GenerationModal } from './components/GenerationModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { VideoResultPage } from './components/VideoResultPage';
import { PromptAssistModal } from './components/PromptAssistModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { LoginGate, AUTH_STORAGE_KEY } from './components/LoginGate';

import {
  GenerationInput,
  GenerationJob,
  RecentVideo,
  VideoOrientation,
  AdStyle,
  VoiceOption,
} from './types';
import { VOICES } from './data/voices';
import { INITIAL_VIDEOS } from './data/sampleVideos';
import { getDirectorFallbackPrompt } from './data/directorPromptRules';
import { cleanDialogueForTTS } from './utils/audioSynthesizer';
import {
  startClientVideoGeneration,
  accelerateClientJob,
  cancelClientJob,
  buildRecentVideoFromJob,
} from './services/videoGenerationService';
import { enhancePromptWithGemini } from './services/geminiService';

export default function App() {
  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const token = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      return !!token;
    } catch {
      return false;
    }
  });

  // Navigation view state ('studio' | 'video-result')
  const [currentView, setCurrentView] = useState<'studio' | 'video-result'>('studio');
  const [activeResultVideo, setActiveResultVideo] = useState<RecentVideo | null>(null);

  // Main form state (The 3 clean user element options: Product Shot, Boxlogo corner, Endslide)
  const [prompt, setPrompt] = useState<string>('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [boxLogoImage, setBoxLogoImage] = useState<string | null>(null);
  const [endSlideImage, setEndSlideImage] = useState<string | null>(null);
  const [activeUploadTarget, setActiveUploadTarget] = useState<'product' | 'boxLogo' | 'endSlide'>('product');

  const [adStyle, setAdStyle] = useState<AdStyle>('ad');
  const [orientation, setOrientation] = useState<VideoOrientation>('landscape');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICES[0]); // Lucas by default
  const [attemptCount, setAttemptCount] = useState<number>(1);

  // Generation & polling state
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showGenerationModal, setShowGenerationModal] = useState<boolean>(false);
  const pollingIntervalRef = useRef<any>(null);

  // Recent videos library
  const [recentVideos, setRecentVideos] = useState<RecentVideo[]>(() => {
    try {
      const saved = localStorage.getItem('zialogy_recent_videos');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_VIDEOS;
  });

  // Modals state
  const [activeVideoModal, setActiveVideoModal] = useState<RecentVideo | null>(null);
  const [activeModifierModal, setActiveModifierModal] = useState<'angle' | 'shotType' | 'lighting' | 'imageStyle' | null>(null);
  const [showHelpGuide, setShowHelpGuide] = useState<boolean>(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);

  // Sync recent videos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zialogy_recent_videos', JSON.stringify(recentVideos));
    } catch {
      // ignore
    }
  }, [recentVideos]);

  // Clean up polling timer
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Start Generation Flow (Client-Side Standalone Engine)
  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // 1. Prepare assets (using direct data URLs or standard fallback)
      const resolvedProductUrl =
        productImage ||
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop';
      const resolvedBoxLogoUrl = boxLogoImage || undefined;
      const resolvedEndSlideUrl = endSlideImage || undefined;

      // 2. Compute effective prompt
      let effectivePrompt = cleanDialogueForTTS(prompt.trim());
      if (!effectivePrompt) {
        effectivePrompt = getDirectorFallbackPrompt({
          flow: adStyle,
          attempt: attemptCount,
          productName: 'the product',
        });
      }
      effectivePrompt = cleanDialogueForTTS(effectivePrompt);

      const inputPayload: GenerationInput = {
        prompt: effectivePrompt,
        product_url: resolvedProductUrl,
        logo_url: resolvedBoxLogoUrl,
        end_logo_url: resolvedEndSlideUrl,
        orientation,
        branch: 'ltx2',
        voice_id: selectedVoice.elevenLabsId || '2gfDLuf2nZfSrUuWQo1W',
        brand_id: 'ZIALOGY',
        flow_type: adStyle || 'ad',
        product_category: 'Commercial Film',
        product_image_url: resolvedProductUrl,
        logo_image_url: resolvedBoxLogoUrl,
        end_slide_image_url: resolvedEndSlideUrl,
        voice: selectedVoice.name,
        style: adStyle,
        duration: orientation === 'portrait' ? 15 : 24,
        attempt_count: attemptCount,
      };

      // Increment attempt rotation for subsequent zero-prompt generations
      setAttemptCount((prev) => (prev >= 4 ? 4 : prev + 1));
      setShowGenerationModal(true);

      // 3. Start client-side video generation engine
      await startClientVideoGeneration(inputPayload, (updatedJob: GenerationJob) => {
        setCurrentJob(updatedJob);

        if (updatedJob.status === 'completed') {
          setIsGenerating(false);

          // Append to recent videos
          const newVideoItem = buildRecentVideoFromJob(updatedJob);
          setRecentVideos((prev) => [newVideoItem, ...prev.filter((v) => v.id !== newVideoItem.id)]);

          // Automatically close modal and navigate to video result page
          setShowGenerationModal(false);
          setActiveResultVideo(newVideoItem);
          setCurrentView('video-result');
        } else if (updatedJob.status === 'failed') {
          setIsGenerating(false);
        }
      });
    } catch (error: any) {
      console.error('Generation request failed:', error);
      alert(`Failed to start video generation: ${error.message || error}`);
      setIsGenerating(false);
    }
  };

  // Accelerate Job for live demo/testing
  const handleAccelerateJob = () => {
    if (!currentJob) return;
    accelerateClientJob(currentJob.id);
  };

  // Delete Video helper
  const handleDeleteVideo = (videoId: string) => {
    setRecentVideos((prev) => {
      const filtered = prev.filter((v) => v.id !== videoId);
      return filtered;
    });

    // If currently viewing deleted video, switch to first remaining or home
    if (activeResultVideo?.id === videoId) {
      const remaining = recentVideos.filter((v) => v.id !== videoId);
      if (remaining.length > 0) {
        setActiveResultVideo(remaining[0]);
      } else {
        setActiveResultVideo(null);
        setCurrentView('studio');
      }
    }
  };

  // AI Prompt Polish (Uses client-side Gemini or Autonomous Director Engine)
  const handleAutoEnhancePrompt = async () => {
    setIsEnhancingPrompt(true);
    try {
      const result = await enhancePromptWithGemini(
        prompt,
        'Commercial Film',
        adStyle,
        selectedVoice.name
      );
      if (result?.enhancedPrompt) {
        setPrompt(cleanDialogueForTTS(result.enhancedPrompt));
      }
    } catch (err) {
      console.error('Enhance failed:', err);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Reset to blank project & return to studio
  const handleNewProject = () => {
    setPrompt('');
    setProductImage(null);
    setBoxLogoImage(null);
    setEndSlideImage(null);
    setAdStyle('ad');
    setOrientation('landscape');
    setCurrentView('studio');
    setActiveResultVideo(null);
  };

  // Add modifier preset text
  const handleSelectModifier = (text: string) => {
    setPrompt((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return text;
      return `${trimmed}. Visual style: ${text}`;
    });
  };

  // Logout handler
  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  // If user is not authenticated, show password protection gate
  if (!isAuthenticated) {
    return <LoginGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 relative selection:bg-cyan-400 selection:text-black">
      {/* High-Tech Ambient Dark Helium Background (No Video on Studio Page) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Deep ambient dark base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090f] via-[#07080c] to-[#040507]" />

        {/* Ambient Floating Luminous Helium Orbs (Cyan / Pink / Amber) */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-pink-500/10 to-amber-400/8 rounded-full blur-[130px] animate-orb-1 pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-fuchsia-500/12 via-violet-600/10 to-cyan-500/8 rounded-full blur-[140px] animate-orb-2 pointer-events-none" />
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-400/10 via-pink-500/10 to-amber-300/8 rounded-full blur-[150px] animate-orb-1 pointer-events-none" />

        {/* Subtle Geometric Cyber Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-35" />

        {/* Vignette Edge Shading */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,5,7,0.75)_100%)]" />
      </div>

      {/* VIEW 1: DEDICATED VIDEO RESULT PAGE (Direct landing upon render complete) */}
      {currentView === 'video-result' && activeResultVideo ? (
        <VideoResultPage
          video={activeResultVideo}
          recentVideos={recentVideos}
          onSelectVideo={(v) => setActiveResultVideo(v)}
          onDeleteVideo={handleDeleteVideo}
          onHome={() => setCurrentView('studio')}
          onGenerateMore={handleNewProject}
          onLogout={handleLogout}
        />
      ) : (
        /* VIEW 2: STUDIO CREATION WORKSPACE */
        <div className="relative z-10">
          {/* Top Navbar */}
          <Header
            onNewProject={handleNewProject}
            onOpenHelp={() => setShowHelpGuide(true)}
            onLogout={handleLogout}
          />

          {/* Main Studio Content Layout */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-8">
            {/* Top Two-Column Grid: Left Detail Panel & Right Voice/Audio Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
              {/* Left Column (Detail Panel): Hero, Prompt, Asset Uploads, Ad Controls */}
              <div className="min-w-0 lg:col-span-7 xl:col-span-8 space-y-6 w-full">
                {/* 1. Prompt & Modifiers Section */}
                <PromptSection
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onSubmitPrompt={handleGenerate}
                  onOpenPresetPicker={(type) => setActiveModifierModal(type)}
                  onAutoEnhance={handleAutoEnhancePrompt}
                  isEnhancing={isEnhancingPrompt}
                  attemptCount={attemptCount}
                  adStyle={adStyle}
                />

                {/* 2. Clear 3-Option Element Upload: 1. Product Shot, 2. Boxlogo (Corner), 3. Endslide */}
                <AssetUploadSection
                  productImage={productImage}
                  setProductImage={setProductImage}
                  boxLogoImage={boxLogoImage}
                  setBoxLogoImage={setBoxLogoImage}
                  endSlideImage={endSlideImage}
                  setEndSlideImage={setEndSlideImage}
                  activeUploadTarget={activeUploadTarget}
                  setActiveUploadTarget={setActiveUploadTarget}
                />

                {/* 3. Ad Style, Orientation, and Glowing Generate Button */}
                <AdControls
                  style={adStyle}
                  setStyle={setAdStyle}
                  orientation={orientation}
                  setOrientation={setOrientation}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>

              {/* Right Column (Voice / Audio Panel): Voice Over Sidebar */}
              <div className="min-w-0 lg:col-span-5 xl:col-span-4 w-full flex justify-center lg:justify-end">
                <VoiceOverSidebar
                  selectedVoice={selectedVoice.name}
                  onSelectVoice={(voice) => setSelectedVoice(voice)}
                  currentPrompt={prompt}
                  productCategory="Commercial Film"
                  adStyle={adStyle}
                />
              </div>
            </div>

            {/* Bottom Section: Recent Videos Carousel */}
            <RecentVideosCarousel
              videos={recentVideos}
              onSelectVideo={(video) => {
                setActiveResultVideo(video);
                setCurrentView('video-result');
              }}
              onNewProject={handleNewProject}
            />
          </main>
        </div>
      )}

      {/* Modals & Dialogs */}
      {showGenerationModal && (
        <GenerationModal
          job={currentJob}
          onClose={() => setShowGenerationModal(false)}
          onAccelerate={handleAccelerateJob}
          onViewVideo={(video) => {
            setShowGenerationModal(false);
            setActiveResultVideo(video);
            setCurrentView('video-result');
          }}
          onRetry={handleGenerate}
        />
      )}

      {activeVideoModal && (
        <VideoPlayerModal
          video={activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
        />
      )}

      {activeModifierModal && (
        <PromptAssistModal
          type={activeModifierModal}
          onClose={() => setActiveModifierModal(null)}
          onSelectModifier={handleSelectModifier}
        />
      )}

      <HelpGuideModal
        isOpen={showHelpGuide}
        onClose={() => setShowHelpGuide(false)}
      />
    </div>
  );
}
