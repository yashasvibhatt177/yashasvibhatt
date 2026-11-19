import React, { useEffect, useState } from 'react';

interface BottomScrollFadeProps {
  visible?: boolean;
  viewKey?: string;
}

export const BottomScrollFade: React.FC<BottomScrollFadeProps> = ({
  visible = true,
  viewKey = 'home',
}) => {
  const [hasMoreAbove, setHasMoreAbove] = useState(false);
  const [hasMoreBelow, setHasMoreBelow] = useState(true);

  useEffect(() => {
    if (!visible) return;

    let rafId: number | null = null;

    const checkScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const viewportHeight = window.innerHeight;
      const scrollHeight = doc.scrollHeight;
      const remaining = scrollHeight - (scrollTop + viewportHeight);

      setHasMoreAbove(scrollTop > 24);
      setHasMoreBelow(remaining > 64);
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        checkScroll();
      });
    };

    checkScroll();
    const timer = window.setTimeout(checkScroll, 150);

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(onScrollOrResize);
      resizeObserver.observe(document.body);
    }

    return () => {
      window.clearTimeout(timer);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      resizeObserver?.disconnect();
    };
  }, [visible, viewKey]);

  if (!visible) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none fixed top-0 left-0 right-0 z-30 h-24 sm:h-28 bg-gradient-to-b from-[#FFFFFD]/75 from-45% via-[#FFFFFD]/30 via-70% to-transparent transition-opacity duration-300 ease-out ${
          hasMoreAbove ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none fixed bottom-0 left-0 right-0 z-30 h-16 sm:h-20 bg-gradient-to-t from-[#FFFFFD] from-10% via-[#FFFFFD]/75 via-45% to-transparent transition-opacity duration-300 ease-out ${
          hasMoreBelow ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
};
