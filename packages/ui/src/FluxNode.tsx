import { motion, useReducedMotion } from 'framer-motion';
import type { FluxVisualState } from '@flux/types';

interface FluxNodeProps {
  visualState: FluxVisualState;
  label?: string;
  size?: 'hero' | 'canvas';
}

export function FluxNode({
  visualState,
  label = 'FLUX',
  size = 'canvas',
}: FluxNodeProps) {
  const reducedMotion = useReducedMotion();
  const animate =
    reducedMotion || visualState === 'idle'
      ? { scale: 1, rotate: 0 }
      : visualState === 'processing' || visualState === 'receiving'
        ? { scale: [1, 1.03, 1], rotate: [0, 6, 0] }
        : visualState === 'success'
          ? { scale: [1, 1.08, 1] }
          : visualState === 'error'
            ? { x: [0, -3, 3, -2, 0] }
            : { scale: 1, rotate: 0 };

  return (
    <motion.div
      className={`flux-node flux-node--${size}`}
      data-state={visualState}
      animate={animate}
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : {
              duration: visualState === 'processing' ? 2.4 : 0.6,
              repeat:
                visualState === 'processing' || visualState === 'receiving'
                  ? Infinity
                  : 0,
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
      <span className="flux-node__ring" aria-hidden="true" />
      <span className="flux-node__core" aria-hidden="true" />
      <span className="flux-node__label">{label}</span>
    </motion.div>
  );
}
