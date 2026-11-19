import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';

export interface PerspectiveCarouselItem {
  src: string;
  title: string;
}

interface PerspectiveCarouselProps {
  items: PerspectiveCarouselItem[];
  defaultActiveIndex?: number;
  slideWidth?: number;
  className?: string;
  onReplaceSlide?: (index: number) => void;
}

export const PerspectiveCarousel: React.FC<PerspectiveCarouselProps> = ({
  items,
  defaultActiveIndex = 0,
  slideWidth = 280,
  className = '',
  onReplaceSlide,
}) => {
  const safeInitial = Math.min(
    Math.max(defaultActiveIndex, 0),
    Math.max(items.length - 1, 0)
  );
  const [activeIndex, setActiveIndex] = useState(safeInitial);
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const [stageWidth, setStageWidth] = useState(960);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateWidth = () => setStageWidth(el.clientWidth || 960);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  if (!items.length) return null;

  const getCircularOffset = (index: number) => {
    const total = items.length;
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  // Fit each card rectangle cleanly to its image's natural aspect ratio
  const getCardSize = (index: number) => {
    const ratio = ratios[index] ?? 1;
    const isMobile = stageWidth < 640;
    const maxW = isMobile ? Math.min(stageWidth * 0.62, 260) : Math.max(slideWidth * 1.45, 380);
    const maxH = isMobile ? 280 : 370;

    let w: number;
    let h: number;

    if (ratio >= 1) {
      w = maxW;
      h = Math.round(w / ratio);
      if (h > maxH) {
        h = maxH;
        w = Math.round(h * ratio);
      }
    } else {
      h = maxH;
      w = Math.round(h * ratio);
      if (w > maxW) {
        w = maxW;
        h = Math.round(w / ratio);
      }
    }

    return { width: w, height: h };
  };

  const activeItem = items[activeIndex];
  const spreadDistance = Math.min(Math.round(stageWidth * 0.34), 390);

  return (
    <div
      ref={stageRef}
      className={`relative w-full flex flex-col items-center justify-between py-4 select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* 3D Perspective Stage - 3 visible cards matching reference */}
      <div
        className="relative w-full h-[340px] sm:h-[420px] flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {items.map((item, idx) => {
          const offset = getCircularOffset(idx);
          const absOffset = Math.abs(offset);
          const isVisible = absOffset <= 1;
          const isActive = offset === 0;

          const { width, height } = getCardSize(idx);
          const translateX = offset * spreadDistance;
          const translateZ = isActive ? 0 : -80;
          const rotateY = offset === 0 ? 0 : offset > 0 ? -24 : 24;
          const scale = isActive ? 1 : 0.78;
          const opacity = isVisible ? (isActive ? 1 : 0.92) : 0;
          const zIndex = isActive ? 30 : isVisible ? 20 : 0;

          return (
            <motion.div
              key={`${item.src}-${idx}`}
              onClick={() => {
                if (!isActive && isVisible) setActiveIndex(idx);
              }}
              initial={false}
              animate={{
                x: translateX,
                z: translateZ,
                rotateY,
                scale,
                opacity,
              }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 26,
              }}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                zIndex,
                transformStyle: 'preserve-3d',
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              className={`absolute rounded-2xl overflow-hidden shadow-xl group ${
                isActive ? 'cursor-default ring-1 ring-black/10' : 'cursor-pointer'
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                draggable={false}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    const naturalRatio = img.naturalWidth / img.naturalHeight;
                    setRatios((prev) =>
                      prev[idx] === naturalRatio ? prev : { ...prev, [idx]: naturalRatio }
                    );
                  }
                }}
                className="w-full h-full object-cover"
              />

              {isActive && onReplaceSlide && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReplaceSlide(idx);
                  }}
                  title="Replace this reference photo"
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Centered Active Caption & Subtle Arrow Controls */}
      <div className="relative z-40 flex items-center justify-center gap-6 pt-3">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous reference"
          className="p-2 rounded-full border border-black/15 hover:border-black/50 text-black/70 hover:text-black transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center min-w-[160px]">
          <p className="text-sm font-semibold tracking-wide text-black">
            {activeItem.title}
          </p>
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next reference"
          className="p-2 rounded-full border border-black/15 hover:border-black/50 text-black/70 hover:text-black transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
