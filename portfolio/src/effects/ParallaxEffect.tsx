import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ParallaxContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const ParallaxLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
  pointer-events: none;
`;

const ParallaxShape = styled.div`
  position: absolute;
  opacity: 0.1;
  background-color: rgba(255, 255, 255, 0.5);
`;

const Circle = styled(ParallaxShape)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  top: 20%;
  left: 10%;
`;

const Square = styled(ParallaxShape)`
  width: 100px;
  height: 100px;
  bottom: 30%;
  right: 15%;
  transform: rotate(45deg);
`;

interface ParallaxEffectProps {
  sectionId: string;
}

const ParallaxEffect: React.FC<ParallaxEffectProps> = ({ sectionId }) => {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if the device supports parallax (non-touch devices)
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.maxTouchPoints > 0));
    };
    
    // Don't initialize parallax on touch devices
    if (isTouchDevice()) return;
    
    // Only initialize if the section exists
    const section = document.getElementById(sectionId);
    if (!section) {
      console.warn(`Section with ID "${sectionId}" not found. Skipping parallax effect initialization.`);
      return;
    }
    
    // Throttle function to limit how often a function can be called
    const throttle = (func: Function, limit: number) => {
      let lastFunc: ReturnType<typeof setTimeout>;
      let lastRan: number;
      return function(this: any, ...args: any[]) {
        if (!lastRan) {
          func.apply(this, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(() => {
            if ((Date.now() - lastRan) >= limit) {
              func.apply(this, args);
              lastRan = Date.now();
            }
          }, limit - (Date.now() - lastRan));
        }
      };
    };
    
    // Handle mouse movement for parallax effect with throttling
    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!layer1Ref.current || !layer2Ref.current) return;
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
        if (layer1Ref.current && layer2Ref.current) {
          const depth1 = 0.05;
          const depth2 = 0.1;
          
          const moveX1 = (mouseX * depth1) * -1;
          const moveY1 = (mouseY * depth1) * -1;
          
          const moveX2 = (mouseX * depth2) * -1;
          const moveY2 = (mouseY * depth2) * -1;
          
          // Use transform translate instead of translate3d for better performance
          layer1Ref.current.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
          layer2Ref.current.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
        }
      });
    }, 16); // Throttle to approximately 60fps
    
    // Add event listener
    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sectionId]);
  
  return (
    <ParallaxContainer>
      <ParallaxLayer ref={layer1Ref} data-depth="0.05">
        <Circle />
      </ParallaxLayer>
      <ParallaxLayer ref={layer2Ref} data-depth="0.1">
        <Square />
      </ParallaxLayer>
    </ParallaxContainer>
  );
};

export default ParallaxEffect;
