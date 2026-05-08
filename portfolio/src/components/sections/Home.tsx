import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowDown, FaBolt, FaLayerGroup, FaRocket } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import { ParallaxEffect, ThreeBackground, TypingEffect } from '../../effects';
import { isWebGLAvailable } from '../../utils/webGLUtils';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const HomeSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 18%, rgba(37, 214, 255, 0.12), transparent 26%),
    radial-gradient(circle at 82% 30%, rgba(255, 79, 162, 0.1), transparent 24%),
    linear-gradient(145deg, rgba(5, 8, 22, 0.94), rgba(8, 14, 34, 0.98));
  color: var(--hero-fg);
`;

const HomeFrame = styled.div`
  width: min(92%, 1240px);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HomeGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(330px, 0.95fr);
  align-items: center;
  gap: clamp(2rem, 6vw, 5rem);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Eyebrow = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid rgba(37, 214, 255, 0.22);
  border-radius: 999px;
  background: rgba(8, 14, 34, 0.56);
  color: rgba(243, 247, 255, 0.82);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
`;

const Title = styled(motion.h1)`
  max-width: 10ch;
  font-size: clamp(3.4rem, 8vw, 6.8rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin: 0;
  text-wrap: balance;
`;

const Accent = styled.span`
  display: block;
  color: rgba(243, 247, 255, 0.72);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 600;
  line-height: 1.2;
  margin-top: 0.45rem;
`;

const Lead = styled(motion.p)`
  max-width: 62ch;
  margin: 1.5rem 0 0;
  color: rgba(243, 247, 255, 0.82);
  font-size: clamp(1rem, 1.45vw, 1.125rem);
  line-height: 1.72;
`;

const ActionRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 2rem;
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 50px;
  padding: 0 1.2rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #ffffff 0%, #d7e8ff 100%);
  color: #05101f;
  font-weight: 800;
  box-shadow: 0 18px 40px rgba(37, 214, 255, 0.12);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 48px rgba(255, 79, 162, 0.18);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(37, 214, 255, 0.22);
  background: rgba(8, 14, 34, 0.42);
  color: var(--hero-fg);
  font-weight: 700;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 79, 162, 0.44);
    background: rgba(255, 79, 162, 0.08);
  }
`;

const StatsRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 2.25rem;
  max-width: 560px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    max-width: none;
  }
`;

const StatCard = styled.div`
  border: 1px solid rgba(37, 214, 255, 0.16);
  border-radius: 8px;
  background: rgba(8, 14, 34, 0.52);
  padding: 0.95rem 1rem;
  backdrop-filter: blur(14px);
`;

const StatValue = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
`;

const StatLabel = styled.div`
  margin-top: 0.35rem;
  color: rgba(243, 247, 255, 0.7);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const HeroPanel = styled(motion.div)`
  position: relative;
  display: grid;
  place-items: center;
  min-height: 540px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 420px;
  }
`;

const PortraitShell = styled.div`
  position: relative;
  width: min(100%, 500px);
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
`;

const PortraitRing = styled(motion.div)`
  position: absolute;
  inset: 7%;
  border-radius: 50%;
  border: 1px solid rgba(37, 214, 255, 0.18);
  background:
    radial-gradient(circle at center, rgba(255, 79, 162, 0.08), transparent 58%),
    radial-gradient(circle at center, rgba(37, 214, 255, 0.08), transparent 70%);
  box-shadow: inset 0 0 40px rgba(37, 214, 255, 0.08);
`;

const PortraitCore = styled(motion.div)`
  width: 58%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.18), transparent 45%),
    linear-gradient(145deg, rgba(13, 20, 38, 0.96), rgba(33, 46, 80, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 32px 90px rgba(0, 0, 0, 0.36),
    inset 0 0 38px rgba(37, 214, 255, 0.08);
`;

const OrbBadge = styled(motion.div)`
  position: absolute;
  border-radius: 999px;
  padding: 0.7rem 0.9rem;
  background: rgba(8, 14, 34, 0.76);
  border: 1px solid rgba(37, 214, 255, 0.16);
  backdrop-filter: blur(12px);
  color: rgba(243, 247, 255, 0.92);
  font-size: 0.8rem;
  font-weight: 700;
`;

const OrbBadgeTop = styled(OrbBadge)`
  top: 8%;
  right: 6%;
`;

const OrbBadgeBottom = styled(OrbBadge)`
  bottom: 12%;
  left: 4%;
`;

const ScrollDown = styled(motion.button)`
  position: absolute;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.65rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(37, 214, 255, 0.16);
  background: rgba(8, 14, 34, 0.45);
  color: rgba(243, 247, 255, 0.82);
  backdrop-filter: blur(12px);
`;

const Home: React.FC = () => {
  const [webGLAvailable, setWebGLAvailable] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setWebGLAvailable(isWebGLAvailable());
  }, []);

  const handleScrollDown = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HomeSection id="home">
      {webGLAvailable && !prefersReducedMotion && <ThreeBackground sectionId="home" />}
      {!prefersReducedMotion && <ParallaxEffect sectionId="home" />}

      <HomeFrame>
        <HomeGrid>
          <div>
            <Eyebrow
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <IconWrapper icon={FaBolt} />
              Portfolio / Frontend / Three.js
            </Eyebrow>

            <Title
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              Bogdan Femic
              <Accent>Frontend Developer building sharp interfaces and expressive interactions.</Accent>
            </Title>

            <Lead
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              I design and build modern web experiences with React, TypeScript, motion design, and interactive 3D systems.
              <span style={{ display: 'block', marginTop: '0.5rem', color: 'rgba(243, 247, 255, 0.65)', fontWeight: 600 }}>
                Currently focused on fast, polished product experiences and portfolio work that feels memorable in the first few seconds.
              </span>
            </Lead>

            <ActionRow
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
            >
              <PrimaryButton href="#projects">
                <IconWrapper icon={FaRocket} />
                View Work
              </PrimaryButton>
              <SecondaryButton href="#threejs-game">
                <IconWrapper icon={FaLayerGroup} />
                Open Neon Drift
              </SecondaryButton>
            </ActionRow>

            <StatsRow
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <StatCard>
                <StatValue>React + TS</StatValue>
                <StatLabel>Primary stack</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>Motion-led</StatValue>
                <StatLabel>Interaction style</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>3D-ready</StatValue>
                <StatLabel>Portfolio focus</StatLabel>
              </StatCard>
            </StatsRow>
          </div>

          <HeroPanel
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <PortraitShell>
              <PortraitRing
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              />
              <PortraitCore
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  animate={{ rotate: [0, 7, 0, -7, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '68%',
                    aspectRatio: '1 / 1',
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'white',
                    background:
                      'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.18), transparent 42%), linear-gradient(135deg, rgba(37,214,255,0.18), rgba(255,79,162,0.12))',
                    boxShadow: '0 0 40px rgba(37,214,255,0.08)',
                  }}
                >
                  <svg width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden="true">
                    <circle cx="110" cy="110" r="72" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    <circle cx="110" cy="92" r="24" fill="rgba(255,255,255,0.18)" />
                    <path
                      d="M58 156c10-23 31-36 52-36s42 13 52 36"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40 110h140"
                      stroke="rgba(37,214,255,0.18)"
                      strokeWidth="2"
                      strokeDasharray="6 10"
                    />
                    <path
                      d="M110 30v160"
                      stroke="rgba(255,79,162,0.14)"
                      strokeWidth="2"
                      strokeDasharray="6 10"
                    />
                  </svg>
                </motion.div>
              </PortraitCore>
              <OrbBadgeTop
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                UI systems
              </OrbBadgeTop>
              <OrbBadgeBottom
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut' }}
              >
                3D + motion
              </OrbBadgeBottom>
            </PortraitShell>
          </HeroPanel>
        </HomeGrid>
      </HomeFrame>

      <ScrollDown type="button" onClick={handleScrollDown} aria-label="Scroll to about section">
        Scroll
        <IconWrapper icon={FaArrowDown} />
      </ScrollDown>
    </HomeSection>
  );
};

export default Home;
