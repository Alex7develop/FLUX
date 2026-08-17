import { useEffect, useRef } from 'react';
import type { FluxVisualState } from '@flux/types';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

interface FluxParticlesProps {
  visualState: FluxVisualState;
  density?: 'full' | 'low';
}

function particleCount(density: 'full' | 'low', reduced: boolean): number {
  if (reduced) {
    return density === 'full' ? 18 : 8;
  }
  return density === 'full' ? 42 : 14;
}

export function FluxParticles({ visualState, density = 'full' }: FluxParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let frame = 0;
    let running = true;
    const particles: Particle[] = [];

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      const { width, height } = canvas.getBoundingClientRect();
      const count = particleCount(density, reducedMotion);
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.4 + 0.4,
          alpha: Math.random() * 0.35 + 0.12,
        });
      }
    };

    const draw = () => {
      if (!running) {
        return;
      }

      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);

      const energy =
        visualState === 'processing' || visualState === 'receiving' ? 1.8 : 1;
      const successPulse = visualState === 'success' ? 1.4 : 1;
      const errorJitter = visualState === 'error' ? 1.6 : 1;

      for (const particle of particles) {
        if (!reducedMotion) {
          particle.x += particle.vx * energy * errorJitter;
          particle.y += particle.vy * energy;
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
        }

        context.beginPath();
        context.fillStyle =
          visualState === 'error'
            ? `rgba(251, 113, 133, ${particle.alpha})`
            : `rgba(110, 200, 255, ${particle.alpha * successPulse})`;
        context.arc(particle.x, particle.y, particle.r * successPulse, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running && !reducedMotion) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    seed();
    if (reducedMotion) {
      draw();
    } else {
      frame = window.requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, reducedMotion, visualState]);

  return (
    <canvas
      ref={canvasRef}
      className="flux-particles"
      aria-hidden="true"
      data-state={visualState}
    />
  );
}
