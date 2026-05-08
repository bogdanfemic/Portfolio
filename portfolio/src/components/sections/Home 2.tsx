import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import { ThreeBackground, ParallaxEffect, TypingEffect } from '../../effects';
import { isWebGLAvailable } from '../../utils/webGLUtils';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const HomeSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--hero-gradient-start) 0%, var(--hero-gradient-end) 100%);
  color: var(--hero-fg);
`;

const HomeContent = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column-reverse;
    text-align: center;
    gap: 2rem;
  }
`;

const TextContent = styled.div`
  flex: 1;
  padding-right: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-right: 0;
  }
`;

const ImageContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled(motion.div)`
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background-color: color-mix(in srgb, var(--hero-fg) 18%, transparent);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    border: 2px solid var(--hero-border);
    animation: rotate 10s linear infinite;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 250px;
    height: 250px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 200px;
    height: 200px;
  }
`;

const Greeting = styled(motion.h2)`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--hero-fg-muted);
`;

const Name = styled(motion.h1)`
  font-size: ${({ theme }) => theme.fontSizes.xxxlarge};
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  }
`;

const Title = styled(motion.h3)`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: var(--hero-fg-muted);
`;

const Description = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin: 0 auto 2rem;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const PrimaryButton = styled(motion.a)`
  display: inline-block;
  padding: 0.8rem 2rem;
  background-color: var(--home-primary-btn-bg);
  color: var(--home-primary-btn-text);
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const SecondaryButton = styled(motion.a)`
  display: inline-block;
  padding: 0.8rem 2rem;
  background-color: transparent;
  color: var(--hero-fg);
  font-weight: 600;
  border: 2px solid var(--hero-fg);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    background-color: color-mix(in srgb, var(--hero-fg) 10%, transparent);
    transform: translateY(-3px);
  }
`;

const ScrollDown = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--hero-fg);
  cursor: pointer;
`;

const ScrollText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: 0.5rem;
`;

const ScrollIcon = styled(motion.div)`
  font-size: 1.2rem;
`;

const Home: React.FC = () => {
  const [webGLAvailable, setWebGLAvailable] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  useEffect(() => {
    setWebGLAvailable(isWebGLAvailable());
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const scrollDownVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, 10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HomeSection id="home">
      {webGLAvailable && !prefersReducedMotion && <ThreeBackground sectionId="home" />}
      {!prefersReducedMotion && <ParallaxEffect sectionId="home" />}
      <HomeContent>
        <TextContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Greeting variants={itemVariants}>Hello, I'm</Greeting>
            <Name variants={itemVariants}>Bogdan Femic</Name>
            <Title variants={itemVariants}>
              Frontend Developer <TypingEffect words={["React Expert", "TypeScript Enthusiast", "UI/UX Designer", "Problem Solver"]} />
            </Title>
            <Description variants={itemVariants}>
              I build modern, responsive web applications with React, TypeScript, and other cutting-edge technologies. Let's create something amazing together!
            </Description>
            <ButtonContainer variants={itemVariants}>
              <PrimaryButton href="#projects">View My Work</PrimaryButton>
              <SecondaryButton href="#contact">Contact Me</SecondaryButton>
            </ButtonContainer>
          </motion.div>
        </TextContent>
        
        <ImageContent>
          <ProfileImage
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            {/* You can add an actual image here */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            >
              {/* Placeholder for profile image */}
              <svg width="150" height="150" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" fill="color-mix(in srgb, var(--hero-fg) 18%, transparent)" />
                <circle cx="100" cy="80" r="30" fill="color-mix(in srgb, var(--hero-fg) 26%, transparent)" />
                <path d="M50 140C50 118.954 67.9543 100 100 100C132.046 100 150 118.954 150 140" stroke="var(--hero-border)" strokeWidth="10" />
              </svg>
            </motion.div>
          </ProfileImage>
        </ImageContent>
      </HomeContent>
      
      <ScrollDown onClick={handleScrollDown}>
        <ScrollText>Scroll Down</ScrollText>
        <ScrollIcon
          variants={scrollDownVariants}
          initial="initial"
          animate="animate"
        >
          <IconWrapper icon={FaArrowDown} />
        </ScrollIcon>
      </ScrollDown>
    </HomeSection>
  );
};

export default Home;
