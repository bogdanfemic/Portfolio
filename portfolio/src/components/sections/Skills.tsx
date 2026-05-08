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
  FaDatabase 
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiRedux, 
  SiStyledcomponents, 
  SiFramer, 
  SiWebpack, 
  SiJest, 
  SiMongodb, 
  SiExpress 
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

const SkillLevel = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const SkillLevelText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.darkGray};
`;

const SkillLevelBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
`;

const SkillLevelFill = styled(motion.div)<{ level: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  width: ${({ level }) => `${level}%`};
`;

const Skills: React.FC = () => {
  const frontendSkills = [
    { name: 'React', icon: FaReact, level: 90 },
    { name: 'TypeScript', icon: SiTypescript, level: 85 },
    { name: 'JavaScript', icon: FaJs, level: 95 },
    { name: 'HTML5', icon: FaHtml5, level: 95 },
    { name: 'CSS3', icon: FaCss3Alt, level: 90 },
    { name: 'Redux', icon: SiRedux, level: 80 },
    { name: 'Styled Components', icon: SiStyledcomponents, level: 85 },
    { name: 'Framer Motion', icon: SiFramer, level: 75 },
  ];
  
  const backendSkills = [
    { name: 'Node.js', icon: FaNodeJs, level: 80 },
    { name: 'Express', icon: SiExpress, level: 75 },
    { name: 'MongoDB', icon: SiMongodb, level: 70 },
    { name: 'SQL', icon: FaDatabase, level: 65 },
  ];
  
  const toolsSkills = [
    { name: 'Git', icon: FaGitAlt, level: 85 },
    { name: 'npm', icon: FaNpm, level: 90 },
    { name: 'Webpack', icon: SiWebpack, level: 70 },
    { name: 'Jest', icon: SiJest, level: 75 },
  ];
  
  const barVariants = {
    hidden: { width: 0 },
    visible: (level: number) => ({
      width: `${level}%`,
      transition: { duration: 1, ease: "easeOut" },
    }),
  };
  
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
                  <SkillLevel>
                    <SkillLevelText>
                      <span>Proficiency</span>
                      <span>{skill.level}%</span>
                    </SkillLevelText>
                    <SkillLevelBar>
                      <SkillLevelFill
                        level={skill.level}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={skill.level}
                        variants={barVariants}
                      />
                    </SkillLevelBar>
                  </SkillLevel>
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
                  <SkillLevel>
                    <SkillLevelText>
                      <span>Proficiency</span>
                      <span>{skill.level}%</span>
                    </SkillLevelText>
                    <SkillLevelBar>
                      <SkillLevelFill
                        level={skill.level}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={skill.level}
                        variants={barVariants}
                      />
                    </SkillLevelBar>
                  </SkillLevel>
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
                  <SkillLevel>
                    <SkillLevelText>
                      <span>Proficiency</span>
                      <span>{skill.level}%</span>
                    </SkillLevelText>
                    <SkillLevelBar>
                      <SkillLevelFill
                        level={skill.level}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={skill.level}
                        variants={barVariants}
                      />
                    </SkillLevelBar>
                  </SkillLevel>
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
