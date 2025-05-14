import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCode, FaLaptopCode, FaMobileAlt, FaServer } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';

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
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

const ServicesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const ServiceCard = styled(motion.div)`
  background-color: white;
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

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
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
            {/* Placeholder for about image */}
            <div style={{ 
              backgroundColor: '#f0f0f0', 
              height: '100%', 
              minHeight: '400px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#aaa',
              fontSize: '1.2rem'
            }}>
              Profile Image
            </div>
          </AboutImage>
          
          <AboutText
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <AboutHeading>Who am I?</AboutHeading>
            <AboutDescription>
              I'm a passionate Frontend Developer with expertise in building modern web applications using React, TypeScript, and other cutting-edge technologies. With a strong foundation in JavaScript and a keen eye for design, I create responsive and user-friendly interfaces that deliver exceptional user experiences.
            </AboutDescription>
            <AboutDescription>
              My journey in web development started several years ago, and since then, I've been continuously learning and adapting to the ever-evolving landscape of frontend technologies. I believe in writing clean, maintainable code and following best practices to ensure scalable and robust applications.
            </AboutDescription>
            
            <AboutStats>
              <StatItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StatNumber>3+</StatNumber>
                <StatTitle>Years Experience</StatTitle>
              </StatItem>
              <StatItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StatNumber>20+</StatNumber>
                <StatTitle>Projects Completed</StatTitle>
              </StatItem>
              <StatItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <StatNumber>10+</StatNumber>
                <StatTitle>Happy Clients</StatTitle>
              </StatItem>
            </AboutStats>
          </AboutText>
        </AboutContent>
        
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
              <ServiceTitle>Web Development</ServiceTitle>
              <ServiceDescription>
                Building responsive and performant websites using modern HTML, CSS, and JavaScript frameworks.
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
                Developing complex, interactive web applications with React, Redux, and TypeScript.
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
              <ServiceTitle>Responsive Design</ServiceTitle>
              <ServiceDescription>
                Creating websites that work flawlessly across all devices, from desktops to smartphones.
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
                <IconWrapper icon={FaServer} />
              </ServiceIcon>
              <ServiceTitle>API Integration</ServiceTitle>
              <ServiceDescription>
                Connecting frontend applications with backend services and third-party APIs.
              </ServiceDescription>
            </ServiceCard>
          </ServicesContainer>
        </motion.div>
      </AboutContainer>
    </AboutSection>
  );
};

export default About;
