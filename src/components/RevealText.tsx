import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

interface RevealTextProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  type?: 'words' | 'lines' | 'chars';
}

export const RevealText: React.FC<RevealTextProps> = ({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  type = 'words',
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const split = new SplitType(ref.current, { types: type });
    const targets = type === 'lines' ? split.lines : type === 'chars' ? split.chars : split.words;

    gsap.set(targets, { yPercent: 110, opacity: 0 });
    gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.06,
      delay,
    });

    return () => split.revert();
  }, [children, delay, type]);

  return (
    // @ts-ignore
    <Tag ref={ref} className={`${className} overflow-hidden`}>
      {children}
    </Tag>
  );
};