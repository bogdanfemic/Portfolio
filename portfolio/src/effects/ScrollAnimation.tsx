import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animationDelay?: number;
  threshold?: number;
  className?: string;
}

interface AnimatedDivProps {
  $isVisible: boolean;
  $animationDelay: number;
}

const AnimatedDiv = styled.div<AnimatedDivProps>`
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  transform: translateY(${props => (props.$isVisible ? 0 : 30)}px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  transition-delay: ${props => props.$animationDelay}ms;
`;

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animationDelay = 0,
  threshold = 0.3,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: threshold
      }
    );
    
    observer.observe(element);
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);
  
  return (
    <AnimatedDiv
      ref={elementRef}
      $isVisible={isVisible}
      $animationDelay={animationDelay}
      className={`animate-on-scroll ${isVisible ? 'animate' : ''} ${className}`}
    >
      {children}
    </AnimatedDiv>
  );
};

export default ScrollAnimation;
