import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Tilt3D
 * Drop-in wrapper that gives ANY card/element real 3D depth:
 * it tilts toward the cursor (rotateX/rotateY), lifts on hover (translateZ),
 * and adds a soft moving glare highlight. This is the reusable building
 * block to make every card across MarketLink feel 3D, not just the Hero.
 *
 * Usage — wrap any existing card:
 *   <Tilt3D>
 *     <div className="rounded-2xl bg-white p-4 shadow-md">...card content...</div>
 *   </Tilt3D>
 *
 * Tune strength with `maxTilt` (degrees) and `lift` (px on the Z axis).
 */

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;   // degrees of rotation at the edge of the element
  lift?: number;      // how far it "pops" toward the viewer on hover
  glare?: boolean;    // moving light-glare overlay
  scaleOnHover?: number;
}

export const Tilt3D: React.FC<Tilt3DProps> = ({
  children,
  className = '',
  maxTilt = 10,
  lift = 24,
  glare = true,
  scaleOnHover = 1.02
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Spring-smoothed so the tilt feels physical, not jittery
  const rotateX = useSpring(rotateXRaw, { stiffness: 220, damping: 18, mass: 0.6 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 220, damping: 18, mass: 0.6 });
  const translateZ = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });

  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 55%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1
    const py = (e.clientY - rect.top) / rect.height;    // 0..1

    rotateYRaw.set((px - 0.5) * 2 * maxTilt);
    rotateXRaw.set(-(py - 0.5) * 2 * maxTilt);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const handleEnter = () => translateZ.set(lift);
  const handleLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    translateZ.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        perspective: 900,
      }}
      className={className}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          z: translateZ,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: scaleOnHover }}
        transition={{ scale: { duration: 0.2 } }}
        className="relative will-change-transform"
      >
        {children}

        {glare && (
          <motion.div
            style={{ background: glareBackground }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          />
        )}
      </motion.div>
    </motion.div>
  );
};
