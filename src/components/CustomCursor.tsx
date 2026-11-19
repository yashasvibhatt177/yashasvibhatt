import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isViewProject, setIsViewProject] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const visibleRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const isViewProjectRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const syncPointerCapability = () => {
      const matches = mediaQuery.matches;
      setIsFinePointer(matches);
      if (matches) {
        document.documentElement.classList.add('custom-cursor-active');
      } else {
        document.documentElement.classList.remove('custom-cursor-active');
      }
    };

    syncPointerCapability();
    mediaQuery.addEventListener('change', syncPointerCapability);

    return () => {
      mediaQuery.removeEventListener('change', syncPointerCapability);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const updateCursorMode = (target: Element | null) => {
      const cursorAttr = target?.closest?.('[data-cursor]')?.getAttribute('data-cursor');
      const nextIsViewProject = cursorAttr === 'view-project';
      if (isViewProjectRef.current !== nextIsViewProject) {
        isViewProjectRef.current = nextIsViewProject;
        setIsViewProject(nextIsViewProject);
      }
    };

    const showAt = (x: number, y: number) => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      lastPosRef.current = { x, y };
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!visibleRef.current) {
        visibleRef.current = true;
        cursor.style.opacity = '1';
      }
    };

    const hide = () => {
      const cursor = cursorRef.current;
      if (!cursor || !visibleRef.current) return;
      visibleRef.current = false;
      cursor.style.opacity = '0';
      if (isViewProjectRef.current) {
        isViewProjectRef.current = false;
        setIsViewProject(false);
      }
    };

    const refreshHoverUnderPointer = () => {
      if (!visibleRef.current || !lastPosRef.current) return;
      const el = document.elementFromPoint(lastPosRef.current.x, lastPosRef.current.y);
      updateCursorMode(el);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        document.documentElement.classList.remove('custom-cursor-active');
        hide();
        return;
      }
      document.documentElement.classList.add('custom-cursor-active');
      showAt(e.clientX, e.clientY);
      updateCursorMode(e.target instanceof Element ? e.target : null);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        document.documentElement.classList.remove('custom-cursor-active');
        hide();
        return;
      }
      requestAnimationFrame(refreshHoverUnderPointer);
    };

    const onClick = () => {
      requestAnimationFrame(refreshHoverUnderPointer);
    };

    const onScroll = () => {
      refreshHoverUnderPointer();
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        hide();
      }
    };

    window.addEventListener('pointermove', onPointerMove, { capture: true, passive: true });
    window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    window.addEventListener('click', onClick, { capture: true, passive: true });
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('blur', hide);

    return () => {
      window.removeEventListener('pointermove', onPointerMove, { capture: true });
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      window.removeEventListener('click', onClick, { capture: true });
      window.removeEventListener('scroll', onScroll, { capture: true });
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('blur', hide);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] pointer-events-none select-none will-change-transform"
      style={{
        opacity: 0,
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isViewProject
            ? 'bg-[#003CD7] text-[#FFFFFD] px-3.5 py-1.5 shadow-[0_6px_18px_rgba(0,60,215,0.35)]'
            : 'w-[15px] h-[15px] bg-black'
        }`}
      >
        {isViewProject && (
          <span className="font-poppins text-[11px] font-medium tracking-wide whitespace-nowrap leading-none">
            View Project
          </span>
        )}
      </div>
    </div>
  );
};
