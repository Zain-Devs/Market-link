import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modal3D
 * Wraps a modal's inner panel with a real 3D flip-in entrance
 * (rotateX + perspective + scale) instead of a flat fade/scale.
 * Use this around the panel div inside any modal component.
 *
 * Usage:
 *   <div className="fixed inset-0 z-50 ...backdrop...">
 *     <Modal3D>
 *       <div className="relative w-full max-w-md bg-white rounded-2xl ...">
 *         ...modal content...
 *       </div>
 *     </Modal3D>
 *   </div>
 */
export const Modal3D: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        initial={{ opacity: 0, rotateX: -18, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        exit={{ opacity: 0, rotateX: 14, y: -12, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  );
};
