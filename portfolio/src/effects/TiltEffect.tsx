import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

interface TiltEffectProps {
  children: React.ReactNode;
  perspective?: number;
  tiltFactor?: number;
  transitionDuration?: number;
  className?: string;
}

const TiltContainer = styled.div<{ $perspective: number; $transitionDuration: number }>`
  transform-style: preserve-3d;
  perspective: ${props => props.$perspective}px;
  transition: transform ${props => props.$transitionDuration}s ease;
  will-change: transform;
`;

const TiltEffect: React.FC<TiltEffectProps> = ({
  children,
  perspective = 1000,
  tiltFactor = 10,
  transitionDuration = 0.3,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / tiltFactor * -1; // Invert Y axis for natural tilt
      const rotateY = (x - centerX) / tiltFactor;
      
      container.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
      container.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0)`;
    };
    
    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Clean up event listeners
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [perspective, tiltFactor]);
  
  return (
    <TiltContainer 
      ref={containerRef} 
      $perspective={perspective} 
      $transitionDuration={transitionDuration}
      className={`tilt-effect ${className}`}
    >
      {children}
    </TiltContainer>
  );
};

export default TiltEffect;
