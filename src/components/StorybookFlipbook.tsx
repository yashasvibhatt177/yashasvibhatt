import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface StorybookFlipbookProps {
  pdfUrl: string;
}

interface SpreadHalfProps {
  src: string;
  side: 'left' | 'right';
  alt: string;
}

const SpreadHalf: React.FC<SpreadHalfProps> = ({ src, side, alt }) => (
  <div className="relative w-full h-full overflow-hidden select-none">
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={`absolute top-0 h-full w-[200%] max-w-none select-none pointer-events-none ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    />
  </div>
);

interface ActiveTurn {
  direction: 'next' | 'prev';
  fromStep: number;
  toStep: number;
  progress: number; // 0 = at fromStep, 1 = at toStep
}

export const StorybookFlipbook: React.FC<StorybookFlipbookProps> = ({ pdfUrl }) => {
  const [spreads, setSpreads] = useState<(string | null)[]>([]);
  const [numPages, setNumPages] = useState<number>(0);
  const [spreadRatio, setSpreadRatio] = useState<number>(2); // updated from actual PDF page 1
  const [loadError, setLoadError] = useState<string | null>(null);

  // step 0 = Closed Front Cover (PDF p.1 right)
  // step 1..11 = Open PDF spreads (PDF p.2..p.12)
  // step 12 (numPages) = Closed Back Cover (PDF p.1 left)
  const [step, setStep] = useState<number>(0);
  const [activeTurn, setActiveTurn] = useState<ActiveTurn | null>(null);
  const [hoverZone, setHoverZone] = useState<'left' | 'right' | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const turnRef = useRef<ActiveTurn | null>(null);
  const stepRef = useRef<number>(0);
  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number;
    startX: number;
    lastX: number;
    lastTime: number;
    velocityX: number;
    maxMoved: number;
    direction: 'next' | 'prev' | null;
    fromStep: number;
    toStep: number;
    progress: number;
  }>({
    active: false,
    pointerId: -1,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocityX: 0,
    maxMoved: 0,
    direction: null,
    fromStep: 0,
    toStep: 0,
    progress: 0,
  });

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    turnRef.current = activeTurn;
  }, [activeTurn]);

  // Load PDF and rasterize each full spread cleanly without cropping or splitting
  useEffect(() => {
    let cancelled = false;
    const createdUrls: string[] = [];

    const loadPdf = async () => {
      try {
        setLoadError(null);
        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const total = pdf.numPages;
        setNumPages(total);
        setSpreads(Array(total).fill(null));

        const firstPage = await pdf.getPage(1);
        if (cancelled) return;
        const baseViewport = firstPage.getViewport({ scale: 1 });
        setSpreadRatio(baseViewport.width / baseViewport.height);

        const renderPageToUrl = async (pageNum: number) => {
          const page = pageNum === 1 ? firstPage : await pdf.getPage(pageNum);
          if (cancelled) return;
          const vp1 = page.getViewport({ scale: 1 });
          // Target ~2200px width for crisp illustrations & small print text
          const scale = Math.min(3, Math.max(1.6, 2200 / vp1.width));
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = Math.round(viewport.width);
          canvas.height = Math.round(viewport.height);
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          if (cancelled) return;

          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((b) => resolve(b), 'image/png')
          );
          if (cancelled || !blob) return;

          const objectUrl = URL.createObjectURL(blob);
          createdUrls.push(objectUrl);

          setSpreads((prev) => {
            const next = [...prev];
            next[pageNum - 1] = objectUrl;
            return next;
          });
        };

        // Render Cover (p.1) & First Inside Spread (p.2) immediately
        await renderPageToUrl(1);
        if (total >= 2 && !cancelled) {
          await renderPageToUrl(2);
        }

        // Render remaining spreads progressively
        for (let p = 3; p <= total; p++) {
          if (cancelled) break;
          await renderPageToUrl(p);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Unable to load storybook PDF.'
          );
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pdfUrl]);

  const maxStep = numPages; // 0 = Front Cover, 1..numPages-1 = Spreads, numPages = Back Cover

  const cancelAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const animateTurnTo = useCallback(
    (
      direction: 'next' | 'prev',
      fromStep: number,
      toStep: number,
      startProgress: number,
      targetProgress: number // 1 to complete, 0 to cancel back
    ) => {
      cancelAnimation();

      const distance = Math.abs(targetProgress - startProgress);
      const duration = Math.max(220, Math.round(distance * 560));
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const rawT = Math.min(1, elapsed / duration);
        // Smooth ease-out cubic for natural physical paper settling
        const eased = 1 - Math.pow(1 - rawT, 3);
        const currentProgress =
          startProgress + (targetProgress - startProgress) * eased;

        if (rawT >= 1) {
          rafRef.current = null;
          setActiveTurn(null);
          if (targetProgress === 1) {
            setStep(toStep);
          }
          return;
        }

        setActiveTurn({
          direction,
          fromStep,
          toStep,
          progress: currentProgress,
        });
        rafRef.current = requestAnimationFrame(tick);
      };

      setActiveTurn({
        direction,
        fromStep,
        toStep,
        progress: startProgress,
      });
      rafRef.current = requestAnimationFrame(tick);
    },
    [cancelAnimation]
  );

  const canGoNext = step < maxStep;
  const canGoPrev = step > 0;

  const triggerTurn = useCallback(
    (direction: 'next' | 'prev') => {
      if (numPages === 0 || dragStateRef.current.active) return;

      // If already animating, settle immediately to target before starting next
      const baseStep = turnRef.current ? turnRef.current.toStep : stepRef.current;
      if (turnRef.current) {
        cancelAnimation();
        setActiveTurn(null);
        setStep(baseStep);
      }

      if (direction === 'next' && baseStep < numPages) {
        animateTurnTo('next', baseStep, baseStep + 1, 0, 1);
      } else if (direction === 'prev' && baseStep > 0) {
        animateTurnTo('prev', baseStep, baseStep - 1, 0, 1);
      }
    },
    [numPages, animateTurnTo, cancelAnimation]
  );

  const handleRestart = () => {
    cancelAnimation();
    setActiveTurn(null);
    setStep(0);
  };

  // Interactive Pointer Dragging + Click Navigation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || numPages === 0) return;

    // If an animation was mid-flight, finish it cleanly first
    if (turnRef.current) {
      const settled = turnRef.current.toStep;
      cancelAnimation();
      setActiveTurn(null);
      setStep(settled);
      stepRef.current = settled;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    const now = performance.now();
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      lastTime: now,
      velocityX: 0,
      maxMoved: 0,
      direction: null,
      fromStep: stepRef.current,
      toStep: stepRef.current,
      progress: 0,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Hover corner curl hint when not dragging
    if (!dragStateRef.current.active) {
      const relX = (e.clientX - rect.left) / rect.width;
      if (stepRef.current === 0) {
        setHoverZone(relX >= 0.25 && relX <= 0.75 ? 'right' : null);
      } else if (stepRef.current === maxStep) {
        setHoverZone(relX >= 0.25 && relX <= 0.75 ? 'left' : null);
      } else {
        if (relX > 0.5) setHoverZone('right');
        else if (relX < 0.5) setHoverZone('left');
        else setHoverZone(null);
      }
      return;
    }

    if (e.pointerId !== dragStateRef.current.pointerId) return;

    const drag = dragStateRef.current;
    const dx = e.clientX - drag.startX;
    const now = performance.now();
    const dt = Math.max(1, now - drag.lastTime);
    drag.velocityX = (e.clientX - drag.lastX) / dt;
    drag.lastX = e.clientX;
    drag.lastTime = now;
    drag.maxMoved = Math.max(drag.maxMoved, Math.abs(dx));

    if (drag.maxMoved < 5) return;

    const dragDistanceRef = Math.max(160, rect.width * 0.42);

    // Determine or follow drag direction
    if (dx < 0 && drag.fromStep < maxStep) {
      drag.direction = 'next';
      drag.toStep = drag.fromStep + 1;
      drag.progress = Math.min(1, Math.max(0, -dx / dragDistanceRef));
      setActiveTurn({
        direction: 'next',
        fromStep: drag.fromStep,
        toStep: drag.toStep,
        progress: drag.progress,
      });
    } else if (dx > 0 && drag.fromStep > 0) {
      drag.direction = 'prev';
      drag.toStep = drag.fromStep - 1;
      drag.progress = Math.min(1, Math.max(0, dx / dragDistanceRef));
      setActiveTurn({
        direction: 'prev',
        fromStep: drag.fromStep,
        toStep: drag.toStep,
        progress: drag.progress,
      });
    } else {
      drag.direction = null;
      drag.progress = 0;
      setActiveTurn(null);
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active || e.pointerId !== drag.pointerId) return;

    drag.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const rect = stageRef.current?.getBoundingClientRect();

    // Tap / Click interaction when minimal pointer movement
    if (drag.maxMoved < 8 && rect) {
      const relX = (e.clientX - rect.left) / rect.width;
      if (drag.fromStep === 0) {
        triggerTurn('next');
      } else if (drag.fromStep === maxStep) {
        triggerTurn('prev');
      } else if (relX >= 0.5 && drag.fromStep < maxStep) {
        triggerTurn('next');
      } else if (relX < 0.5 && drag.fromStep > 0) {
        triggerTurn('prev');
      }
      return;
    }

    if (!drag.direction) {
      setActiveTurn(null);
      return;
    }

    const isFastSwipe =
      (drag.direction === 'next' && drag.velocityX < -0.35) ||
      (drag.direction === 'prev' && drag.velocityX > 0.35);

    const shouldComplete = drag.progress >= 0.22 || isFastSwipe;
    animateTurnTo(
      drag.direction,
      drag.fromStep,
      drag.toStep,
      drag.progress,
      shouldComplete ? 1 : 0
    );
  };

  // Compute physical state for rendering at rest OR during any animated/dragged transition
  const renderBookStage = () => {
    if (loadError) {
      return (
        <div className="w-full py-20 text-center text-sm text-red-600 font-poppins">
          {loadError}
        </div>
      );
    }

    if (numPages === 0 || !spreads[0]) {
      return (
        <div
          className="w-full max-w-[1160px] mx-auto flex items-center justify-center py-24"
          style={{ aspectRatio: `${spreadRatio}` }}
        >
          <div className="flex flex-col items-center gap-3 text-black/60 font-poppins text-sm">
            <div className="w-7 h-7 rounded-full border-2 border-[#003CD7]/25 border-t-[#003CD7] animate-spin" />
            <span>Preparing your storybook…</span>
          </div>
        </div>
      );
    }

    // Normalize transition into a forward pair (lowStep -> highStep) with p in [0, 1]
    // where p = 0 means resting at lowStep, and p = 1 means resting at highStep.
    let lowStep = step;
    let highStep = step;
    let p = 0;
    const isFlipping = Boolean(activeTurn);

    if (activeTurn) {
      if (activeTurn.direction === 'next') {
        lowStep = activeTurn.fromStep;
        highStep = activeTurn.toStep;
        p = activeTurn.progress;
      } else {
        lowStep = activeTurn.toStep;
        highStep = activeTurn.fromStep;
        p = 1 - activeTurn.progress;
      }
    }

    const coverSpread = spreads[0]!; // PDF Page 1: Back Cover (left) + Front Cover (right)

    // Determine horizontal stage offset so closed Front Cover & closed Back Cover sit dead center:
    // - At step 0 (closed Front Cover on right half): shift stage -25% so right half is centered
    // - At step 1..11 (open double spread): shift stage 0%
    // - At step 12 (closed Back Cover on left half): shift stage +25% so left half is centered
    let stageTranslateX = 0;
    if (!isFlipping) {
      if (step === 0) stageTranslateX = -25;
      else if (step === maxStep) stageTranslateX = 25;
      else stageTranslateX = 0;
    } else if (lowStep === 0 && highStep === 1) {
      // Smoothly expand from centered Front Cover (-25%) to centered Open Spread (0%)
      stageTranslateX = -25 * (1 - p);
    } else if (lowStep === maxStep - 1 && highStep === maxStep) {
      // Smoothly close from centered Open Spread (0%) to centered Back Cover (+25%)
      stageTranslateX = 25 * p;
    }

    // 1. Resting State (no mid-flight turn): render crisp uncropped spread or cover cleanly
    if (!isFlipping) {
      // State 0: Closed Front Cover (Right half of PDF Page 1 only)
      if (step === 0) {
        return (
          <div
            className="relative w-full transition-transform duration-300 ease-out"
            style={{
              aspectRatio: `${spreadRatio}`,
              transform: `translateX(${stageTranslateX}%)`,
            }}
          >
            <div
              className="absolute top-0 bottom-0 left-1/2 right-0 rounded-r-md overflow-hidden"
              style={{
                boxShadow:
                  '0 22px 46px -12px rgba(0,0,0,0.34), 4px 0 0 0 #eceae2, 6px 2px 0 0 #d9d6cc, 8px 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              <SpreadHalf
                src={coverSpread}
                side="right"
                alt="The Kindness That Glowed — Front Cover"
              />
              {/* Spine groove on left edge of closed front cover */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-6"
                style={{
                  background:
                    'linear-gradient(to right, rgba(255,255,255,0.22) 0%, rgba(0,0,0,0.32) 3px, rgba(255,255,255,0.14) 7px, transparent 100%)',
                }}
              />
              {/* Subtle corner curl invitation on hover */}
              <div
                className={`pointer-events-none absolute bottom-0 right-0 w-12 h-12 transition-opacity duration-300 ${
                  hoverZone === 'right' ? 'opacity-100' : 'opacity-40'
                }`}
                style={{
                  background:
                    'linear-gradient(315deg, rgba(255,255,253,0.45) 0%, rgba(255,255,253,0.12) 45%, transparent 52%)',
                }}
              />
            </div>
          </div>
        );
      }

      // State 12: Closed Back Cover (Left half of PDF Page 1 only)
      if (step === maxStep) {
        return (
          <div
            className="relative w-full transition-transform duration-300 ease-out"
            style={{
              aspectRatio: `${spreadRatio}`,
              transform: `translateX(${stageTranslateX}%)`,
            }}
          >
            <div
              className="absolute top-0 bottom-0 left-0 right-1/2 rounded-l-md overflow-hidden"
              style={{
                boxShadow:
                  '0 22px 46px -12px rgba(0,0,0,0.34), -4px 0 0 0 #eceae2, -6px 2px 0 0 #d9d6cc, -8px 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              <SpreadHalf
                src={coverSpread}
                side="left"
                alt="The Kindness That Glowed — Back Cover"
              />
              {/* Spine groove on right edge of closed back cover */}
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-6"
                style={{
                  background:
                    'linear-gradient(to left, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.32) 3px, rgba(255,255,255,0.12) 7px, transparent 100%)',
                }}
              />
              {/* Subtle corner curl invitation on hover */}
              <div
                className={`pointer-events-none absolute bottom-0 left-0 w-12 h-12 transition-opacity duration-300 ${
                  hoverZone === 'left' ? 'opacity-100' : 'opacity-40'
                }`}
                style={{
                  background:
                    'linear-gradient(45deg, rgba(255,255,253,0.45) 0%, rgba(255,255,253,0.12) 45%, transparent 52%)',
                }}
              />
            </div>
          </div>
        );
      }

      // States 1..11: Open Double-Page Spread (complete PDF Page step + 1)
      const currentSpread = spreads[step];
      return (
        <div
          className="relative w-full rounded-md overflow-hidden bg-[#0b1033]"
          style={{
            aspectRatio: `${spreadRatio}`,
            boxShadow:
              '0 24px 52px -12px rgba(0,0,0,0.32), 0 4px 14px rgba(0,0,0,0.12), -3px 0 0 0 #e9e7df, 3px 0 0 0 #e9e7df',
          }}
        >
          {currentSpread ? (
            <img
              src={currentSpread}
              alt={`Storybook spread ${step} of ${numPages - 1}`}
              draggable={false}
              className="w-full h-full object-contain select-none pointer-events-none block"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/70 text-sm">
              Loading spread…
            </div>
          )}

          {/* Subtle center binding gutter shadow */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 sm:w-14"
            style={{
              background:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.22) 46%, rgba(0,0,0,0.38) 50%, rgba(0,0,0,0.18) 55%, transparent 100%)',
            }}
          />

          {/* Subtle page-corner curl invitations on hover */}
          {canGoPrev && (
            <div
              className={`pointer-events-none absolute bottom-0 left-0 w-12 h-12 transition-opacity duration-200 ${
                hoverZone === 'left' ? 'opacity-95' : 'opacity-0'
              }`}
              style={{
                background:
                  'linear-gradient(45deg, rgba(255,255,253,0.35) 0%, rgba(255,255,253,0.08) 45%, transparent 52%)',
              }}
            />
          )}
          {canGoNext && (
            <div
              className={`pointer-events-none absolute bottom-0 right-0 w-12 h-12 transition-opacity duration-200 ${
                hoverZone === 'right' ? 'opacity-95' : 'opacity-0'
              }`}
              style={{
                background:
                  'linear-gradient(315deg, rgba(255,255,253,0.35) 0%, rgba(255,255,253,0.08) 45%, transparent 52%)',
              }}
            />
          )}
        </div>
      );
    }

    // 2. Active 3D Page-Turn State (0 < p < 1, or smooth edge):
    const isOpeningTurn = lowStep === 0 && highStep === 1;
    const isClosingTurn = lowStep === maxStep - 1 && highStep === maxStep;

    const lowSpread = spreads[lowStep] || coverSpread;
    const highSpread = spreads[highStep] || coverSpread;

    const leafFrontSrc = lowSpread;
    const leafFrontSide: 'left' | 'right' = 'right';
    const leafBackSrc = isClosingTurn ? coverSpread : highSpread;
    const leafBackSide: 'left' | 'right' = 'left';

    const showUnderLeft = !isOpeningTurn;
    const showUnderRight = !isClosingTurn;

    const angleDeg = -p * 180;
    const foldIntensity = Math.sin(p * Math.PI); // peaks at p = 0.5 (-90deg)

    return (
      <div
        className="relative w-full"
        style={{
          aspectRatio: `${spreadRatio}`,
          transform: `translateX(${stageTranslateX}%)`,
          perspective: '2200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Book drop shadow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-md"
          style={{
            left: isOpeningTurn && p < 0.5 ? '50%' : '0%',
            right: isClosingTurn && p > 0.5 ? '50%' : '0%',
            boxShadow: '0 24px 52px -12px rgba(0,0,0,0.34)',
          }}
        />

        {/* Stationary Left Page underneath (visible unless opening from closed front cover) */}
        {showUnderLeft && (
          <div className="absolute top-0 bottom-0 left-0 right-1/2 rounded-l-md overflow-hidden bg-[#0b1033]">
            <SpreadHalf
              src={lowSpread}
              side="left"
              alt="Previous left page"
            />
            {/* Cast shadow as turned page lands onto left half */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(to left, rgba(0,0,0,${
                  (0.32 * foldIntensity).toFixed(3)
                }) 0%, rgba(0,0,0,${
                  (0.1 * foldIntensity).toFixed(3)
                }) 45%, transparent 100%)`,
              }}
            />
          </div>
        )}

        {/* Stationary Right Page underneath (visible unless closing to back cover) */}
        {showUnderRight && (
          <div className="absolute top-0 bottom-0 left-1/2 right-0 rounded-r-md overflow-hidden bg-[#0b1033]">
            <SpreadHalf
              src={highSpread}
              side="right"
              alt="Upcoming right page"
            />
            {/* Cast shadow cast by lifting leaf onto upcoming right page */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(to right, rgba(0,0,0,${
                  (0.36 * foldIntensity).toFixed(3)
                }) 0%, rgba(0,0,0,${
                  (0.12 * foldIntensity).toFixed(3)
                }) 45%, transparent 100%)`,
              }}
            />
          </div>
        )}

        {/* Center Spine Shadow */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 z-20"
          style={{
            background:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.26) 46%, rgba(0,0,0,0.42) 50%, rgba(0,0,0,0.22) 55%, transparent 100%)',
          }}
        />

        {/* 3D Turning Page Leaf hinged at the Center Spine */}
        <div
          className="absolute top-0 bottom-0 left-1/2 right-0 z-30"
          style={{
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${angleDeg}deg)`,
          }}
        >
          {/* Front Face of Turning Leaf (0deg) */}
          <div
            className="absolute inset-0 rounded-r-md overflow-hidden bg-[#0b1033]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <SpreadHalf
              src={leafFrontSrc}
              side={leafFrontSide}
              alt="Turning page front"
            />
            {/* Specular & curl shading while turning toward 90deg */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(to left, rgba(255,255,255,${
                  (0.18 * foldIntensity).toFixed(3)
                }) 0%, rgba(0,0,0,${
                  (0.28 * foldIntensity).toFixed(3)
                }) 100%)`,
              }}
            />
          </div>

          {/* Back Face of Turning Leaf (180deg) */}
          <div
            className="absolute inset-0 rounded-l-md overflow-hidden bg-[#0b1033]"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <SpreadHalf
              src={leafBackSrc}
              side={leafBackSide}
              alt="Turning page back"
            />
            {/* Dynamic shading while settling from 90deg to 180deg */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,${
                  (0.16 * foldIntensity).toFixed(3)
                }) 0%, rgba(0,0,0,${
                  (0.24 * foldIntensity).toFixed(3)
                }) 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const displayStep = activeTurn ? activeTurn.toStep : step;
  const totalInsideSpreads = Math.max(1, numPages - 1);

  const getCounterLabel = () => {
    if (numPages === 0) return 'Loading storybook…';
    if (displayStep === 0) return 'Front Cover';
    if (displayStep === maxStep) return 'Back Cover';
    return `Spread ${displayStep} of ${totalInsideSpreads}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Book Stage with Desktop Side Navigation Arrows */}
      <div className="relative w-full bg-[#003CD7] border border-black/10 rounded-2xl px-4 sm:px-10 md:px-14 lg:px-16 py-8 sm:py-12 overflow-hidden">
        {/* Left Navigation Arrow (Desktop / Tablet) */}
        <button
          type="button"
          onClick={() => triggerTurn('prev')}
          disabled={!canGoPrev}
          aria-label="Previous spread"
          className={`hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full border border-black/15 bg-[#FFFFFD]/90 text-black shadow-sm transition-all absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-40 ${
            canGoPrev
              ? 'hover:border-[#003CD7] hover:text-[#003CD7] cursor-pointer opacity-100'
              : 'opacity-25 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Navigation Arrow (Desktop / Tablet) */}
        <button
          type="button"
          onClick={() => triggerTurn('next')}
          disabled={!canGoNext}
          aria-label="Next spread"
          className={`hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full border border-black/15 bg-[#FFFFFD]/90 text-black shadow-sm transition-all absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-40 ${
            canGoNext
              ? 'hover:border-[#003CD7] hover:text-[#003CD7] cursor-pointer opacity-100'
              : 'opacity-25 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Interactive Flipbook Container */}
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
          onPointerLeave={() => setHoverZone(null)}
          className="w-full max-w-[1160px] mx-auto touch-pan-y cursor-grab active:cursor-grabbing select-none"
        >
          {renderBookStage()}
        </div>
      </div>

      {/* Controls Bar: Counter and Navigation Arrows */}
      <div className="flex items-center justify-center gap-4 pt-1 font-poppins">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => triggerTurn('prev')}
            disabled={!canGoPrev}
            aria-label="Previous page"
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-black/15 bg-[#FFFFFD] text-black transition-colors ${
              canGoPrev
                ? 'hover:border-[#003CD7] hover:text-[#003CD7] cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="min-w-[130px] text-center text-xs sm:text-sm font-medium text-black">
            {getCounterLabel()}
          </span>

          <button
            type="button"
            onClick={() => triggerTurn('next')}
            disabled={!canGoNext}
            aria-label="Next page"
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-black/15 bg-[#FFFFFD] text-black transition-colors ${
              canGoNext
                ? 'hover:border-[#003CD7] hover:text-[#003CD7] cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {displayStep > 0 && (
            <button
              type="button"
              onClick={handleRestart}
              title="Back to Front Cover"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/15 bg-[#FFFFFD] text-xs text-black/70 hover:text-[#003CD7] hover:border-[#003CD7] transition-colors cursor-pointer ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cover</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
