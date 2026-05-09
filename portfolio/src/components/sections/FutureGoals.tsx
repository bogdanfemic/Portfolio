import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaBrain,
  FaCodeBranch,
  FaGamepad,
  FaMobileAlt,
  FaRocket,
  FaSeedling,
  FaUsers,
} from 'react-icons/fa';
import { SiBlender } from 'react-icons/si';
import { IconWrapper } from '../../utils/IconWrapper';

const goals = [
  {
    title: 'Master advanced React systems',
    timeframe: 'Next 3 months',
    description: 'Build cleaner state patterns, stronger component architecture, and smoother motion-driven interfaces.',
    progress: 68,
    icon: FaCodeBranch,
  },
  {
    title: 'Launch a useful product',
    timeframe: 'This year',
    description: 'Ship a polished web app that solves a real problem and can be improved with real user feedback.',
    progress: 42,
    icon: FaRocket,
  },
  {
    title: 'Grow AI engineering skills',
    timeframe: 'Ongoing',
    description: 'Combine frontend craft with AI-powered workflows, smarter tooling, and practical automation.',
    progress: 55,
    icon: FaBrain,
  },
  {
    title: 'Learn game programming and design',
    timeframe: 'Next creative step',
    description: 'Study gameplay systems, level design, interaction loops, and the technical craft behind fun digital experiences.',
    progress: 24,
    icon: FaGamepad,
  },
  {
    title: 'Work more with Blender',
    timeframe: 'Creative practice',
    description: 'Improve 3D modeling, scene composition, materials, and asset creation for interactive projects.',
    progress: 31,
    icon: SiBlender,
  },
  {
    title: 'Polish mobile app development',
    timeframe: 'Skill upgrade',
    description: 'Build smoother mobile-first interfaces and strengthen app development skills across performance, usability, and responsive flows.',
    progress: 48,
    icon: FaMobileAlt,
  },
  {
    title: 'Mentor and collaborate more',
    timeframe: 'Next chapter',
    description: 'Support students, contribute to meaningful teams, and build technology with visible social impact.',
    progress: 76,
    icon: FaUsers,
  },
];

const FutureGoalsSection = styled.section`
  padding: 110px 0;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface-2-color) 86%, transparent), var(--background-color));
  overflow: hidden;
`;

const FutureGoalsContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  text-align: center;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.darkGray};
  text-align: center;
  max-width: 760px;
  margin: 0 auto 3.5rem;
`;

const GoalsExperience = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.15fr);
  gap: 2rem;
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const VisionPanel = styled(motion.div)`
  position: relative;
  min-height: 460px;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background:
    radial-gradient(circle at 22% 18%, rgba(15, 184, 255, 0.28), transparent 24%),
    radial-gradient(circle at 80% 74%, rgba(255, 79, 154, 0.2), transparent 28%),
    linear-gradient(145deg, color-mix(in srgb, var(--surface-color) 90%, transparent), color-mix(in srgb, var(--surface-2-color) 92%, transparent));
  border: 1px solid var(--border-color);
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
`;

const Orbit = styled(motion.div)`
  position: absolute;
  inset: 2.2rem;
  border: 1px solid color-mix(in srgb, var(--accent-color) 28%, transparent);
  border-radius: 50%;

  &:before,
  &:after {
    content: '';
    position: absolute;
    border-radius: 50%;
    border: 1px dashed color-mix(in srgb, var(--secondary-color) 24%, transparent);
  }

  &:before {
    inset: 17%;
  }

  &:after {
    inset: 34%;
    border-color: color-mix(in srgb, var(--primary-color) 24%, transparent);
  }
`;

const GoalSignal = styled(motion.div)<{ $top: string; $left: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  box-shadow: 0 14px 34px color-mix(in srgb, var(--primary-color) 28%, transparent);
`;

const VisionContent = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-color) 13%, transparent);
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
`;

const VisionTitle = styled.h3`
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.12;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const VisionText = styled.p`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.8;
  max-width: 440px;
`;

const Console = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: color-mix(in srgb, var(--background-color) 76%, transparent);
  border: 1px solid var(--border-color);
`;

const ConsoleLine = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-family: 'Montserrat', sans-serif;

  span {
    color: ${({ theme }) => theme.colors.secondary};
    font-weight: 700;
  }
`;

const Roadmap = styled(motion.div)`
  display: grid;
  gap: 1rem;
`;

const GoalCard = styled(motion.article)`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  padding: 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: transform ${({ theme }) => theme.transitions.medium}, box-shadow ${({ theme }) => theme.transitions.medium};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const GoalIcon = styled.div`
  width: 54px;
  height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--accent-color) 18%, transparent), color-mix(in srgb, var(--secondary-color) 16%, transparent));
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.35rem;
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.35rem;
  }
`;

const GoalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.large};
  line-height: 1.25;
`;

const GoalTimeframe = styled.span`
  flex: 0 0 auto;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 700;
`;

const GoalDescription = styled.p`
  color: ${({ theme }) => theme.colors.darkGray};
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.45rem;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const ProgressTrack = styled.div`
  height: 9px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--medium-gray) 70%, transparent);
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  border-radius: inherit;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color), var(--secondary-color));
`;

const FutureGoals: React.FC = () => {
  const signalPositions = [
    { top: '13%', left: '58%' },
    { top: '28%', left: '21%' },
    { top: '39%', left: '72%' },
    { top: '54%', left: '15%' },
    { top: '63%', left: '61%' },
    { top: '76%', left: '34%' },
    { top: '18%', left: '39%' },
  ];

  return (
    <FutureGoalsSection id="future-goals">
      <FutureGoalsContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Future Goals
        </SectionTitle>
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          A living roadmap for what I want to build, learn, and contribute next.
        </SectionSubtitle>

        <GoalsExperience>
          <VisionPanel
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Orbit
              animate={{ rotate: 360 }}
              transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
            />
            {goals.map((goal, index) => (
              <GoalSignal
                key={goal.title}
                $top={signalPositions[index].top}
                $left={signalPositions[index].left}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                <IconWrapper icon={goal.icon} />
              </GoalSignal>
            ))}

            <VisionContent>
              <Eyebrow>
                <IconWrapper icon={FaSeedling} />
                Next focus
              </Eyebrow>
              <VisionTitle>Turning ambition into shipped work.</VisionTitle>
              <VisionText>
                This space is designed as a personal mission control: clear goals, visible momentum, and room to update the next milestone whenever the plan grows.
              </VisionText>
              <Console>
                <ConsoleLine><span>status:</span> learning, building, iterating</ConsoleLine>
                <ConsoleLine><span>next:</span> add your newest goal in the goals array</ConsoleLine>
              </Console>
            </VisionContent>
          </VisionPanel>

          <Roadmap
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.12 }}
          >
            {goals.map((goal, index) => (
              <GoalCard
                key={goal.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
              >
                <GoalIcon>
                  <IconWrapper icon={goal.icon} />
                </GoalIcon>
                <div>
                  <GoalHeader>
                    <GoalTitle>{goal.title}</GoalTitle>
                    <GoalTimeframe>{goal.timeframe}</GoalTimeframe>
                  </GoalHeader>
                  <GoalDescription>{goal.description}</GoalDescription>
                  <ProgressMeta>
                    <span>Momentum</span>
                    <span>{goal.progress}%</span>
                  </ProgressMeta>
                  <ProgressTrack>
                    <ProgressFill
                      $progress={goal.progress}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${goal.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </ProgressTrack>
                </div>
              </GoalCard>
            ))}
          </Roadmap>
        </GoalsExperience>
      </FutureGoalsContainer>
    </FutureGoalsSection>
  );
};

export default FutureGoals;
