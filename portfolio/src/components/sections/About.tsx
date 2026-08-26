import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCode, FaLaptopCode, FaMobileAlt, FaRobot } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import profileImage from '../../assets/Bogdan-Femic-profile.webp';

const AboutSection = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 100px 0;
`;

const AboutContainer = styled.div`
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
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const AboutContent = styled.div`
  display: flex;
  gap: 3rem;
  margin-bottom: 4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const AboutImage = styled(motion.div)`
  flex: 1;
  min-height: 520px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 0;
    aspect-ratio: 4 / 5;
  }
`;

const AboutText = styled(motion.div)`
  flex: 1;
`;

const AboutHeading = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const AboutDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
`;

const HighlightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 2rem 0 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const HighlightCard = styled.div`
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 1rem 1.1rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const HighlightLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const HighlightValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const AboutStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const StatItem = styled(motion.div)`
  flex: 1;
`;

const StatNumber = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.darkGray};
`;

const CareerSection = styled.div`
  margin: 0 0 5rem;
`;

const CareerHeading = styled.h3`
  margin-bottom: 1.4rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  text-align: center;
`;

const CareerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const CareerCard = styled(motion.article)`
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: var(--surface-color);
  padding: 1.35rem;
  box-shadow: ${({ theme }) => theme.shadows.small};

  span {
    display: block;
    margin-bottom: 0.55rem;
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.small};
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  h4 {
    margin-bottom: 0.55rem;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.large};
  }

  p {
    color: ${({ theme }) => theme.colors.darkGray};
    line-height: 1.65;
  }
`;

const ServicesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const ServiceCard = styled(motion.div)`
  background-color: var(--surface-color);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const ServiceTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ServiceDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <AboutSection id="about">
      <AboutContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </SectionTitle>
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Get to know more about me and what I do
        </SectionSubtitle>
        
        <AboutContent>
          <AboutImage
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={profileImage}
              alt="Bogdan Femic at a Digitechnikum award event"
              loading="lazy"
              decoding="async"
            />
          </AboutImage>
          
          <AboutText
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <AboutHeading>Who am I?</AboutHeading>
            <AboutDescription>
              I'm a Software Developer at Digital David AG and a Computer Science student at TU Darmstadt, based in Frankfurt. Since August 2023, I have worked on production web applications with React, Blazor, TypeScript, JavaScript, and C# - from implementation and testing to debugging and reliable delivery.
            </AboutDescription>
            <AboutDescription>
              I work AI-first, using coding assistants, agents, and automation to speed up research, prototyping, debugging, and repetitive tasks. Beyond development, I mentor students through the Digitechnikum initiative and have supported 20 scholarship students with software and hardware projects.
            </AboutDescription>

            <HighlightGrid>
              <HighlightCard>
                <HighlightLabel>Professional role</HighlightLabel>
                <HighlightValue>Software Developer, Digital David AG</HighlightValue>
              </HighlightCard>
              <HighlightCard>
                <HighlightLabel>Education</HighlightLabel>
                <HighlightValue>B.Sc. Computer Science, TU Darmstadt</HighlightValue>
              </HighlightCard>
              <HighlightCard>
                <HighlightLabel>Mentoring</HighlightLabel>
                <HighlightValue>Digitechnikum, Stiftung Polytechnische Gesellschaft</HighlightValue>
              </HighlightCard>
              <HighlightCard>
                <HighlightLabel>Languages</HighlightLabel>
                <HighlightValue>German &amp; Serbian (bilingual), English</HighlightValue>
              </HighlightCard>
            </HighlightGrid>
            
            <AboutStats>
              <StatItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StatNumber>3+</StatNumber>
                <StatTitle>Years in professional software development</StatTitle>
              </StatItem>
              <StatItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StatNumber>20</StatNumber>
                <StatTitle>Digitechnikum students supported in 2023/24</StatTitle>
              </StatItem>
              <StatItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <StatNumber>AI-first</StatNumber>
                <StatTitle>Development and automation workflow</StatTitle>
              </StatItem>
            </AboutStats>
          </AboutText>
        </AboutContent>

        <CareerSection>
          <CareerHeading>Experience snapshot</CareerHeading>
          <CareerGrid>
            <CareerCard whileHover={{ y: -6 }}>
              <span>08/2023 - present</span>
              <h4>Software Developer · Digital David AG</h4>
              <p>Building and maintaining web applications, resolving complex defects, reviewing code, and shipping tested improvements in agile teams.</p>
            </CareerCard>
            <CareerCard whileHover={{ y: -6 }}>
              <span>10/2022 - present</span>
              <h4>Mentor · Digitechnikum</h4>
              <p>Guiding young technologists through software and hardware projects with structured feedback, problem solving, and technical communication.</p>
            </CareerCard>
            <CareerCard whileHover={{ y: -6 }}>
              <span>Selected foundations</span>
              <h4>DigiClean &amp; programming education</h4>
              <p>Built a recycling-app concept as a Digitechnikum scholar and delivered an introductory programming workshop at Goethe University in 2019.</p>
            </CareerCard>
          </CareerGrid>
        </CareerSection>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What I Do
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Here are some of the services I offer
          </SectionSubtitle>
          
          <ServicesContainer>
            <ServiceCard
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <ServiceIcon>
                <IconWrapper icon={FaCode} />
              </ServiceIcon>
              <ServiceTitle>Product Engineering</ServiceTitle>
              <ServiceDescription>
                Taking features from requirements through implementation, testing, debugging, code review, and reliable delivery.
              </ServiceDescription>
            </ServiceCard>
            
            <ServiceCard
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <ServiceIcon>
                <IconWrapper icon={FaLaptopCode} />
              </ServiceIcon>
              <ServiceTitle>React Applications</ServiceTitle>
              <ServiceDescription>
                Developing complex, interactive web applications with React, TypeScript, and motion-driven interfaces.
              </ServiceDescription>
            </ServiceCard>
            
            <ServiceCard
              custom={2}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <ServiceIcon>
                <IconWrapper icon={FaMobileAlt} />
              </ServiceIcon>
              <ServiceTitle>Mobile App Development</ServiceTitle>
              <ServiceDescription>
                Building and prototyping mobile experiences with Flutter, Swift, and React Native.
              </ServiceDescription>
            </ServiceCard>
            
            <ServiceCard
              custom={3}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <ServiceIcon>
                <IconWrapper icon={FaRobot} />
              </ServiceIcon>
              <ServiceTitle>AI &amp; Automation</ServiceTitle>
              <ServiceDescription>
                Integrating coding assistants, agents, and automations into practical development workflows.
              </ServiceDescription>
            </ServiceCard>
          </ServicesContainer>
        </motion.div>
      </AboutContainer>
    </AboutSection>
  );
};

export default About;
