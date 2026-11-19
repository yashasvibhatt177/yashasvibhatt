export function attachTightSpringMotion(
  el: HTMLElement,
  maxX = 8,
  maxY = 6
): () => void {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) {
    return () => {};
  }

  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let velX = 0;
  let velY = 0;
  let rafId: number | null = null;
  let lastTime = performance.now();

  const step = (now: number) => {
    const dt = Math.min((now - lastTime) / 16.667, 2);
    lastTime = now;

    const stiffness = 0.055;
    const retention = Math.pow(0.74, dt);

    velX = (velX + (targetX - curX) * stiffness * dt) * retention;
    velY = (velY + (targetY - curY) * stiffness * dt) * retention;
    curX += velX * dt;
    curY += velY * dt;

    el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;

    const isSettled =
      Math.abs(targetX - curX) < 0.02 &&
      Math.abs(targetY - curY) < 0.02 &&
      Math.abs(velX) < 0.02 &&
      Math.abs(velY) < 0.02;

    if (isSettled) {
      curX = targetX;
      curY = targetY;
      velX = 0;
      velY = 0;
      el.style.transform =
        targetX === 0 && targetY === 0
          ? ''
          : `translate3d(${targetX.toFixed(2)}px, ${targetY.toFixed(2)}px, 0)`;
      rafId = null;
      return;
    }

    rafId = window.requestAnimationFrame(step);
  };

  const startSpring = () => {
    if (rafId === null) {
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(step);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5));
    const ny = Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5));
    targetX = nx * maxX;
    targetY = ny * maxY;
    startSpring();
  };

  const onPointerLeave = () => {
    targetX = 0;
    targetY = 0;
    startSpring();
  };

  el.addEventListener('pointermove', onPointerMove, { passive: true });
  el.addEventListener('pointerleave', onPointerLeave, { passive: true });

  return () => {
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerleave', onPointerLeave);
    if (rafId !== null) window.cancelAnimationFrame(rafId);
    el.style.transform = '';
  };
}
