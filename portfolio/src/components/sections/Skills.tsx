import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaReact, 
  FaNodeJs, 
  FaHtml5, 
  FaCss3Alt, 
  FaJs, 
  FaGitAlt, 
  FaNpm, 
  FaDatabase, 
  FaJava
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiRedux, 
  SiStyledcomponents, 
  SiFramer, 
  SiWebpack, 
  SiJest, 
  SiMongodb, 
  SiExpress, 
  SiTailwindcss
} from 'react-icons/si';
import { IconWrapper } from '../../utils/IconWrapper';

const SkillsSection = styled.section`
  background-color: var(--background-color);
  padding: 100px 0;
`;

const SkillsContainer = styled.div`
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

const SkillsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const SkillCategory = styled(motion.div)`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const SkillCard = styled(motion.div)`
  background-color: var(--surface-color);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const SkillIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const SkillName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const SkillContext = styled.p`
  margin-top: 0.5rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--surface-2-color);
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.darkGray};
`;

const Skills: React.FC = () => {
  const frontendSkills = [
    { name: 'React', icon: FaReact, context: 'Primary stack' },
    { name: 'TypeScript', icon: SiTypescript, context: 'Production use' },
    { name: 'JavaScript', icon: FaJs, context: 'Core language' },
    { name: 'HTML5', icon: FaHtml5, context: 'Semantic UI' },
    { name: 'CSS3', icon: FaCss3Alt, context: 'Responsive systems' },
    { name: 'TailwindCSS', icon: SiTailwindcss, context: 'Working knowledge' },
    { name: 'Styled Components', icon: SiStyledcomponents, context: 'Current portfolio' },
    { name: 'Framer Motion', icon: SiFramer, context: 'Motion systems' },
  ];
  
  const backendSkills = [
    { name: 'Node.js', icon: FaNodeJs, context: 'API experience' },
    { name: 'MongoDB', icon: SiMongodb, context: 'Project experience' },
    { name: 'SQL', icon: FaDatabase, context: 'Working knowledge' },
  ];
  
  const toolsSkills = [
    { name: 'Git', icon: FaGitAlt, context: 'Daily workflow' },
    { name: 'npm', icon: FaNpm, context: 'Daily workflow' },
  ];
  
  return (
    <SkillsSection id="skills">
      <SkillsContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Skills
        </SectionTitle>
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Here are the technologies and tools I work with
        </SectionSubtitle>
        
        <SkillsContent>
          <SkillCategory
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CategoryTitle>Frontend Development</CategoryTitle>
            <SkillsGrid>
              {frontendSkills.map((skill, index) => (
                <SkillCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <SkillIcon><IconWrapper icon={skill.icon} /></SkillIcon>
                  <SkillName>{skill.name}</SkillName>
                  <SkillContext>{skill.context}</SkillContext>
                </SkillCard>
              ))}
            </SkillsGrid>
          </SkillCategory>
          
          <SkillCategory
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CategoryTitle>Backend Development</CategoryTitle>
            <SkillsGrid>
              {backendSkills.map((skill, index) => (
                <SkillCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <SkillIcon><IconWrapper icon={skill.icon} /></SkillIcon>
                  <SkillName>{skill.name}</SkillName>
                  <SkillContext>{skill.context}</SkillContext>
                </SkillCard>
              ))}
            </SkillsGrid>
          </SkillCategory>
          
          <SkillCategory
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CategoryTitle>Tools & Others</CategoryTitle>
            <SkillsGrid>
              {toolsSkills.map((skill, index) => (
                <SkillCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <SkillIcon><IconWrapper icon={skill.icon} /></SkillIcon>
                  <SkillName>{skill.name}</SkillName>
                  <SkillContext>{skill.context}</SkillContext>
                </SkillCard>
              ))}
            </SkillsGrid>
          </SkillCategory>
        </SkillsContent>
      </SkillsContainer>
    </SkillsSection>
  );
};

export default Skills;
