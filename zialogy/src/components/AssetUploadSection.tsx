import React, { useRef, useState } from 'react';
import {
  Paperclip,
  Image as ImageIcon,
  PlaySquare,
  X,
  CheckCircle,
  Sparkles,
  Layers,
} from 'lucide-react';

interface AssetUploadSectionProps {
  productImage: string | null;
  setProductImage: (url: string | null) => void;
  boxLogoImage: string | null;
  setBoxLogoImage: (url: string | null) => void;
  endSlideImage: string | null;
  setEndSlideImage: (url: string | null) => void;
  activeUploadTarget: 'product' | 'boxLogo' | 'endSlide';
  setActiveUploadTarget: (target: 'product' | 'boxLogo' | 'endSlide') => void;
}

export const AssetUploadSection: React.FC<AssetUploadSectionProps> = ({
  productImage,
  setProductImage,
  boxLogoImage,
  setBoxLogoImage,
  endSlideImage,
  setEndSlideImage,
  activeUploadTarget,
  setActiveUploadTarget,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Quick sample assets for instantaneous testing
  const sampleProducts = [
    {
      name: 'Luxury Fragrance',
      url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Smart Watch',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Running Sneaker',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Cyberpunk Drone',
      url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Only accept static image formats
    if (!file.type.startsWith('image/')) {
      console.warn('Non-image file format rejected. Only static image formats are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (activeUploadTarget === 'product') {
        setProductImage(result);
      } else if (activeUploadTarget === 'boxLogo') {
        setBoxLogoImage(result);
      } else if (activeUploadTarget === 'endSlide') {
        setEndSlideImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerUploadFor = (target: 'product' | 'boxLogo' | 'endSlide') => {
    setActiveUploadTarget(target);
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Hidden File Input restricted to static images only */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      {/* Main Drag & Drop Bar */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => triggerUploadFor(activeUploadTarget)}
        className={`w-full rounded-2xl py-3.5 px-4 sm:px-5 flex items-center justify-between border cursor-pointer transition-all duration-200 backdrop-blur-xl ${
          isDragging
            ? 'bg-[#151928]/90 border-cyan-400 ring-2 ring-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
            : 'bg-[#0e1017]/80 hover:bg-[#141724]/90 border-white/10 hover:border-cyan-400/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
            <Paperclip className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-white">
              Drag & drop static image or click to upload
            </p>
            <p className="text-[11px] text-neutral-400">
              Supports: JPG, PNG, WEBP (Static Images Only) • Target:{' '}
              <span className="text-cyan-300 capitalize font-medium">
                {activeUploadTarget === 'product'
                  ? '1. Product Shot'
                  : activeUploadTarget === 'boxLogo'
                  ? '2. Boxlogo (Corner)'
                  : '3. Endslide'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-400">
          <div className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-1.5 text-xs text-neutral-300 border border-white/5">
            <ImageIcon className="w-4 h-4 text-cyan-300" />
            <span className="text-[11px] font-medium hidden sm:inline">Images Only</span>
          </div>
        </div>
      </div>

      {/* 3 User Upload Options: 1. Product Shot, 2. Boxlogo (Optional), 3. Endslide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* OPTION 1: PRODUCT SHOT (Required) */}
        <div
          onClick={() => triggerUploadFor('product')}
          className={`relative group rounded-2xl p-3.5 flex flex-col items-center justify-center min-h-[105px] border cursor-pointer transition-all backdrop-blur-xl ${
            productImage
              ? 'bg-[#101422]/90 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
              : activeUploadTarget === 'product'
              ? 'bg-[#10121a]/90 border-cyan-400/40 ring-1 ring-cyan-400/30'
              : 'bg-[#0e1017]/80 border-white/10 hover:border-cyan-400/30 hover:bg-[#141724]'
          }`}
        >
          {productImage ? (
            <div className="relative w-full h-full flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={productImage}
                  alt="Product Shot"
                  className="w-11 h-11 rounded-lg object-cover border border-cyan-400/30 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                />
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white truncate">
                    <CheckCircle className="w-3 h-3 text-cyan-300 shrink-0" />
                    <span className="text-cyan-100">PRODUCT SHOT</span>
                  </div>
                  <span className="text-[10px] text-cyan-300/80 block truncate font-medium">Hero Focus</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setProductImage(null);
                }}
                className="p-1 rounded-full bg-white/10 hover:bg-red-500/30 text-neutral-300 hover:text-red-400 transition-colors shrink-0"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-wider text-white">
                1. PRODUCT SHOT
              </span>
              <span className="text-[10px] text-cyan-300 font-medium">Hero Product Focus</span>
            </div>
          )}
        </div>

        {/* OPTION 2: BOXLOGO (Corner - Optional) */}
        <div
          onClick={() => triggerUploadFor('boxLogo')}
          className={`relative group rounded-2xl p-3.5 flex flex-col items-center justify-center min-h-[105px] border cursor-pointer transition-all backdrop-blur-xl ${
            boxLogoImage
              ? 'bg-[#101422]/90 border-pink-400/60 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
              : activeUploadTarget === 'boxLogo'
              ? 'bg-[#10121a]/90 border-pink-400/40 ring-1 ring-pink-400/30'
              : 'bg-[#0e1017]/80 border-white/10 hover:border-pink-400/30 hover:bg-[#141724]'
          }`}
        >
          {boxLogoImage ? (
            <div className="relative w-full h-full flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={boxLogoImage}
                  alt="Boxlogo"
                  className="w-11 h-11 rounded-lg object-contain bg-black/60 p-1 border border-pink-400/30 shrink-0 shadow-[0_0_10px_rgba(236,72,153,0.2)]"
                />
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white truncate">
                    <CheckCircle className="w-3 h-3 text-pink-400 shrink-0" />
                    <span className="text-pink-100">BOXLOGO</span>
                  </div>
                  <span className="text-[10px] text-pink-300/80 block truncate font-medium">Corner overlay</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBoxLogoImage(null);
                }}
                className="p-1 rounded-full bg-white/10 hover:bg-red-500/30 text-neutral-300 hover:text-red-400 transition-colors shrink-0"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-300 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-wider text-neutral-200">
                2. BOXLOGO
              </span>
              <span className="text-[10px] text-neutral-400">Corner Logo (Optional)</span>
            </div>
          )}
        </div>

        {/* OPTION 3: ENDSLIDE (Optional) */}
        <div
          onClick={() => triggerUploadFor('endSlide')}
          className={`relative group rounded-2xl p-3.5 flex flex-col items-center justify-center min-h-[105px] border cursor-pointer transition-all backdrop-blur-xl ${
            endSlideImage
              ? 'bg-[#101422]/90 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              : activeUploadTarget === 'endSlide'
              ? 'bg-[#10121a]/90 border-amber-400/40 ring-1 ring-amber-400/30'
              : 'bg-[#0e1017]/80 border-white/10 hover:border-amber-400/30 hover:bg-[#141724]'
          }`}
        >
          {endSlideImage ? (
            <div className="relative w-full h-full flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={endSlideImage}
                  alt="Endslide"
                  className="w-11 h-11 rounded-lg object-cover border border-amber-400/30 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                />
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white truncate">
                    <CheckCircle className="w-3 h-3 text-amber-300 shrink-0" />
                    <span className="text-amber-100">ENDSLIDE</span>
                  </div>
                  <span className="text-[10px] text-amber-300/80 block truncate font-medium">Outro CTA Frame</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEndSlideImage(null);
                }}
                className="p-1 rounded-full bg-white/10 hover:bg-red-500/30 text-neutral-300 hover:text-red-400 transition-colors shrink-0"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <PlaySquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-wider text-neutral-200">
                3. ENDSLIDE
              </span>
              <span className="text-[10px] text-neutral-400">Closing Frame (Optional)</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Sample Selector for Convenience */}
      {!productImage && (
        <div className="flex items-center gap-2 pt-1 text-xs text-neutral-400 overflow-x-auto pb-1">
          <span className="shrink-0 flex items-center gap-1 text-[11px] text-neutral-400">
            <Sparkles className="w-3 h-3 text-cyan-300" /> Try sample product:
          </span>
          {sampleProducts.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setProductImage(sample.url)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-400/30 text-neutral-300 hover:text-cyan-200 border border-white/5 transition-all text-xs cursor-pointer"
            >
              {sample.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
