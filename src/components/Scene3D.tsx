import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Icosahedron, Torus, Sphere, Environment } from '@react-three/drei';

/**
 * Scene3D
 * A lightweight, decorative Three.js scene used as a background layer
 * across MarketLink pages to give the whole site real 3D depth
 * (not just CSS shadows). Colors match the eGreen Basket theme.
 *
 * Usage:
 *   <div className="relative">
 *     <Scene3D className="absolute inset-0 -z-10" />
 *     ...your normal content on top...
 *   </div>
 *
 * Keep it absolutely positioned behind content with pointer-events-none
 * so it never blocks clicks/scrolling.
 */

interface Scene3DProps {
  className?: string;
  variant?: 'hero' | 'section' | 'minimal';
}

const ThemeShapes: React.FC<{ variant: 'hero' | 'section' | 'minimal' }> = ({ variant }) => {
  const density = variant === 'hero' ? 1 : variant === 'section' ? 0.6 : 0.3;

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#FFF4D6" />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#194D26" />

      {/* Big soft icosahedron = stylised "produce" gem — pushed to the right/back, over the image column */}
      <Float speed={1.4} rotationIntensity={1.1} floatIntensity={1.6}>
        <Icosahedron args={[1.1, 0]} position={[3.4, 0.7, -2.5]}>
          <meshStandardMaterial color="#2F7D46" roughness={0.35} metalness={0.15} />
        </Icosahedron>
      </Float>

      {/* Torus ring = "basket loop" motif — kept far right/back */}
      {density > 0.4 && (
        <Float speed={1.1} rotationIntensity={0.8} floatIntensity={1.2}>
          <Torus args={[0.7, 0.22, 16, 48]} position={[3.6, -1.0, -3]} rotation={[0.6, 0.4, 0]}>
            <meshStandardMaterial color="#E8B84B" roughness={0.4} metalness={0.2} />
          </Torus>
        </Float>
      )}

      {/* Small sphere accents — moved off the left text column, tucked behind the hero image */}
      {density > 0.2 && (
        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={2}>
          <Sphere args={[0.35, 32, 32]} position={[3.2, -0.6, -2.2]}>
            <meshStandardMaterial color="#C0392B" roughness={0.3} metalness={0.1} />
          </Sphere>
        </Float>
      )}

      {density >= 1 && (
        <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.4}>
          <Sphere args={[0.28, 32, 32]} position={[3.0, 1.4, -2.8]}>
            <meshStandardMaterial color="#F5F1E6" roughness={0.5} metalness={0.05} />
          </Sphere>
        </Float>
      )}
    </>
  );
};

export const Scene3D: React.FC<Scene3DProps> = ({ className = '', variant = 'hero' }) => {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ThemeShapes variant={variant} />
        </Suspense>
      </Canvas>
    </div>
  );
};