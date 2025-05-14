import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const CursorElement = styled.div`
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  pointer-events: none;
  mix-blend-mode: difference;
  z-index: 9999;
  transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
  margin-top: -10px;
  margin-left: -10px;
  will-change: transform;
  
  &.hover {
    width: 50px;
    height: 50px;
    margin-top: -25px;
    margin-left: -25px;
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    // Check if the device supports touch - do this check only once
    const isTouchDevice = ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0);
    
    // Don't initialize custom cursor on touch devices
    if (isTouchDevice || !cursorRef.current) {
      return;
    }
    
    // Throttle function to limit how often a function can be called
    const throttle = (func: Function, limit: number) => {
      let inThrottle: boolean;
      return function(this: any, ...args: any[]) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    };
    
    // Use requestAnimationFrame for smoother cursor movement
    let cursorX = 0;
    let cursorY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Update cursor position with faster animation
    const render = () => {
      // Faster interpolation for cursor movement
      currentX += (cursorX - currentX) * 0.5;
      currentY += (cursorY - currentY) * 0.5;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      requestAnimationFrame(render);
    };
    
    // Start animation loop
    requestAnimationFrame(render);
    
    // Update cursor target position
    const updateCursorPosition = throttle((e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    }, 5); // Throttle to reduce event handling
    
    // Handle hover effects
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.classList.contains('tilt-effect') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('.project-card') ||
        target.closest('.skill-card') ||
        target.closest('.service-card')
      ) {
        setIsHovered(true);
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.classList.contains('tilt-effect') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('.project-card') ||
        target.closest('.skill-card') ||
        target.closest('.service-card')
      ) {
        setIsHovered(false);
      }
    };
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Hide custom cursor when leaving window
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.relatedTarget === null && cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };
    
    // Show custom cursor when entering window
    const handleMouseEnter = (e: MouseEvent) => {
      if (document.body.contains(e.target as Node) && cursorRef.current) {
        cursorRef.current.style.opacity = '1';
      }
    };
    
    // Add event listeners
    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseEnter);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseEnter);
      
      // Restore default cursor
      document.body.style.cursor = '';
    };
  }, []);
  
  return <CursorElement ref={cursorRef} className={isHovered ? 'hover' : ''} />;
};

export default CustomCursor;
