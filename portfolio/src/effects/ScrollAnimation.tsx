import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animationDelay?: number;
  threshold?: number;
  className?: string;
  reducedMotion?: boolean;
  once?: boolean;
}

const AnimatedDiv = styled(motion.div)`
  width: 100%;
`;

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animationDelay = 0,
  threshold = 0.3,
  className = '',
  reducedMotion = false,
  once = false,
}) => {
  return (
    <AnimatedDiv
      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: animationDelay / 1000 }}
      className={className}
    >
      {children}
    </AnimatedDiv>
  );
};

export default ScrollAnimation;
