import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowDown, FaBolt, FaLayerGroup, FaRocket } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import { ParallaxEffect, ThreeBackground } from '../../effects';
import { isWebGLAvailable } from '../../utils/webGLUtils';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const HomeSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 18%, color-mix(in srgb, var(--accent-color) 18%, transparent), transparent 26%),
    radial-gradient(circle at 82% 30%, color-mix(in srgb, var(--secondary-color) 14%, transparent), transparent 24%),
    linear-gradient(145deg, var(--hero-gradient-start), var(--hero-gradient-end));
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
  border: 1px solid var(--hero-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-color) 76%, transparent);
  color: var(--hero-fg-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
`;

const Title = styled(motion.h1)`
  max-width: 12ch;
  font-size: clamp(3.4rem, 8vw, 6.8rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
  margin: 0;
  text-wrap: balance;
`;

const Subtitle = styled(motion.p)`
  max-width: 28ch;
  margin: 0.8rem 0 0;
  color: var(--hero-fg-muted);
  font-size: clamp(1rem, 1.35vw, 1.2rem);
  font-weight: 600;
  line-height: 1.45;
`;

const Lead = styled(motion.p)`
  max-width: 62ch;
  margin: 1.5rem 0 0;
  color: var(--hero-fg-muted);
  font-size: clamp(1rem, 1.45vw, 1.125rem);
  line-height: 1.72;
`;

const ContextRow = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.25rem;
`;

const ContextPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--hero-border);
  background: color-mix(in srgb, var(--surface-color) 78%, transparent);
  color: var(--hero-fg-muted);
  font-size: 0.82rem;
  font-weight: 700;
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
  background: var(--home-primary-btn-bg);
  color: var(--home-primary-btn-text);
  font-weight: 800;
  box-shadow: 0 18px 40px color-mix(in srgb, var(--accent-color) 22%, transparent);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 48px color-mix(in srgb, var(--secondary-color) 24%, transparent);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 1.2rem;
  border-radius: 999px;
  border: 1px solid var(--hero-border);
  background: color-mix(in srgb, var(--surface-color) 74%, transparent);
  color: var(--hero-fg);
  font-weight: 700;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--secondary-color) 45%, transparent);
    background: color-mix(in srgb, var(--secondary-color) 14%, transparent);
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
  border: 1px solid var(--hero-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--surface-color) 78%, transparent);
  padding: 0.95rem 1rem;
  backdrop-filter: blur(14px);
`;

const StatValue = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--hero-fg);
  line-height: 1;
`;

const StatLabel = styled.div`
  margin-top: 0.35rem;
  color: var(--hero-fg-muted);
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
  border: 1px solid var(--hero-border);
  background:
    radial-gradient(circle at center, color-mix(in srgb, var(--secondary-color) 15%, transparent), transparent 58%),
    radial-gradient(circle at center, color-mix(in srgb, var(--accent-color) 16%, transparent), transparent 70%);
  box-shadow: inset 0 0 40px color-mix(in srgb, var(--accent-color) 14%, transparent);
`;

const PortraitCore = styled(motion.div)`
  width: 58%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--hero-fg) 20%, transparent), transparent 45%),
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--surface-color) 85%, var(--text-color)),
      color-mix(in srgb, var(--surface-2-color) 82%, var(--text-color))
    );
  border: 1px solid color-mix(in srgb, var(--hero-fg) 14%, transparent);
  box-shadow:
    0 32px 90px rgba(0, 0, 0, 0.36),
    inset 0 0 38px color-mix(in srgb, var(--accent-color) 16%, transparent);
`;

const OrbBadge = styled(motion.div)`
  position: absolute;
  border-radius: 999px;
  padding: 0.7rem 0.9rem;
  background: color-mix(in srgb, var(--surface-color) 84%, transparent);
  border: 1px solid var(--hero-border);
  backdrop-filter: blur(12px);
  color: var(--hero-fg);
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
  border: 1px solid var(--hero-border);
  background: color-mix(in srgb, var(--surface-color) 76%, transparent);
  color: var(--hero-fg-muted);
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
            </Title>

            <Subtitle
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
            >
              Frontend Developer building sharp interfaces and expressive interactions.
            </Subtitle>

            <Lead
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              I design and build modern web experiences with React, TypeScript, motion design, and interactive 3D systems.
              <span style={{ display: 'block', marginTop: '0.5rem', color: 'var(--hero-fg-muted)', fontWeight: 600 }}>
                Currently focused on fast, polished product experiences and portfolio work that feels memorable in the first few seconds.
              </span>
            </Lead>

            <ContextRow
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
            >
              <ContextPill>Computer Science student at TU Darmstadt</ContextPill>
              <ContextPill>Based in Frankfurt, Hessen</ContextPill>
              <ContextPill>Mentor for Digitechnikum</ContextPill>
            </ContextRow>

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
                    color: 'var(--hero-fg)',
                    background:
                      'radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--hero-fg) 20%, transparent), transparent 42%), linear-gradient(135deg, color-mix(in srgb, var(--accent-color) 22%, transparent), color-mix(in srgb, var(--secondary-color) 14%, transparent))',
                    boxShadow: '0 0 40px color-mix(in srgb, var(--accent-color) 16%, transparent)',
                  }}
                >
                  <svg width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden="true">
                    <circle cx="110" cy="110" r="72" stroke="color-mix(in srgb, var(--hero-fg) 16%, transparent)" strokeWidth="1.5" />
                    <circle cx="110" cy="92" r="24" fill="color-mix(in srgb, var(--hero-fg) 20%, transparent)" />
                    <path
                      d="M58 156c10-23 31-36 52-36s42 13 52 36"
                      stroke="color-mix(in srgb, var(--hero-fg) 22%, transparent)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40 110h140"
                      stroke="color-mix(in srgb, var(--accent-color) 22%, transparent)"
                      strokeWidth="2"
                      strokeDasharray="6 10"
                    />
                    <path
                      d="M110 30v160"
                      stroke="color-mix(in srgb, var(--secondary-color) 18%, transparent)"
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
