import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import { TiltEffect, ScrollAnimation } from '../../effects';

const ProjectsSection = styled.section`
  background-color: ${({ theme }) => theme.colors.lightGray};
  padding: 100px 0;
`;

const ProjectsContainer = styled.div`
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

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const FilterButton = styled(motion.button)<{ isActive: boolean }>`
  padding: 0.5rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 500;
  background-color: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : 'white'};
  color: ${({ isActive, theme }) => 
    isActive ? 'white' : theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    background-color: ${({ isActive, theme }) => 
      isActive ? theme.colors.primary : theme.colors.lightGray};
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  cursor: pointer;
  position: relative;
`;

const ProjectImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.medium};
  }
  
  ${ProjectCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.4)
  );
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.medium};
  
  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ProjectTags = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ProjectTag = styled.span`
  padding: 0.3rem 0.8rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProjectDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.small};
  transition: color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  z-index: 1;
  transition: background-color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

const ModalImageContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 300px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 200px;
  }
`;

const ModalImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.lightGray};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
  }
`;

const ModalDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const ModalTechStack = styled.div`
  margin-bottom: 2rem;
`;

const ModalTechTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalTechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const ModalTechItem = styled.span`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
`;

const ModalLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ModalLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-3px);
  }
`;

// Sample project data
const projectsData = [
  {
    id: 1,
    title: 'E-commerce Website',
    description: 'A fully responsive e-commerce platform with product filtering, cart functionality, and payment integration.',
    fullDescription: 'This e-commerce platform was built using React and Node.js, featuring a responsive design that works seamlessly across all devices. The application includes product filtering, sorting, and search capabilities, allowing users to easily find what they\'re looking for. The shopping cart is implemented with Redux for state management, and the checkout process integrates with Stripe for secure payments. User authentication is handled with JWT, and the platform also includes an admin dashboard for product management.',
    image: 'ecommerce-placeholder.jpg',
    tags: ['React', 'Node.js', 'Redux'],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'Stripe API', 'JWT', 'Styled Components'],
    liveLink: 'https://example.com',
    githubLink: 'https://github.com',
    category: 'web',
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A drag-and-drop task management application with real-time updates and team collaboration features.',
    fullDescription: 'This task management application was designed to help teams organize their work efficiently. Built with React and Firebase, it features a drag-and-drop interface for easy task management, real-time updates so all team members can see changes instantly, and comprehensive team collaboration tools including comments, attachments, and task assignments. The application also includes data visualization for project progress, deadline reminders, and integrations with popular tools like Slack and Google Calendar.',
    image: 'task-app-placeholder.jpg',
    tags: ['React', 'Firebase', 'TypeScript'],
    techStack: ['React', 'TypeScript', 'Firebase', 'React DnD', 'Chart.js', 'Material UI'],
    liveLink: 'https://example.com',
    githubLink: 'https://github.com',
    category: 'web',
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'A weather application that displays current conditions and forecasts for locations worldwide.',
    fullDescription: 'This weather dashboard provides users with accurate weather information for any location around the world. Using the OpenWeatherMap API, the application displays current weather conditions, hourly forecasts, and 7-day predictions. Users can save their favorite locations for quick access and view detailed weather data including temperature, humidity, wind speed, and precipitation. The dashboard also features interactive charts for visualizing weather trends and a responsive design that works well on both desktop and mobile devices.',
    image: 'weather-placeholder.jpg',
    tags: ['JavaScript', 'API', 'CSS'],
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'OpenWeatherMap API', 'Chart.js', 'Geolocation API'],
    liveLink: 'https://example.com',
    githubLink: 'https://github.com',
    category: 'web',
  },
  {
    id: 4,
    title: 'Social Media Dashboard',
    description: 'A dashboard for managing and analyzing social media accounts across multiple platforms.',
    fullDescription: 'This social media dashboard allows users to manage and analyze their social media presence across multiple platforms from a single interface. Built with React and Node.js, it integrates with APIs from Twitter, Facebook, Instagram, and LinkedIn to provide a comprehensive view of social media performance. The dashboard includes analytics for engagement, reach, and follower growth, as well as tools for scheduling posts, responding to comments, and monitoring mentions. It also features customizable reports and alerts for important metrics.',
    image: 'social-placeholder.jpg',
    tags: ['React', 'Node.js', 'API'],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Social Media APIs', 'Chart.js', 'Socket.io'],
    liveLink: 'https://example.com',
    githubLink: 'https://github.com',
    category: 'web',
  },
];

interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  techStack: string[];
  liveLink: string;
  githubLink: string;
  category: string;
}

const Projects: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(project => project.category === filter);
  
  const openModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };
  
  return (
    <ProjectsSection id="projects">
      <ProjectsContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </SectionTitle>
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Check out some of my recent work
        </SectionSubtitle>
        
        <FilterContainer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FilterButton 
            isActive={filter === 'all'}
            onClick={() => setFilter('all')}
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
          >
            All
          </FilterButton>
          <FilterButton 
            isActive={filter === 'web'}
            onClick={() => setFilter('web')}
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
          >
            Web
          </FilterButton>
          <FilterButton 
            isActive={filter === 'mobile'}
            onClick={() => setFilter('mobile')}
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
          >
            Mobile
          </FilterButton>
          <FilterButton 
            isActive={filter === 'design'}
            onClick={() => setFilter('design')}
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
          >
            Design
          </FilterButton>
        </FilterContainer>
        
        <ProjectsGrid
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredProjects.map((project) => (
            <ScrollAnimation key={project.id} animationDelay={project.id * 100}>
              <TiltEffect>
                <ProjectCard
                  variants={itemVariants}
                  onClick={() => openModal(project)}
                >
                  <ProjectImage>
                    {/* Placeholder for project image */}
                    <div style={{ 
                      backgroundColor: '#e0e0e0', 
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#aaa',
                      fontSize: '1.2rem'
                    }}>
                      Project Image
                    </div>
                    <ProjectOverlay />
                    <ProjectTags>
                      {project.tags.slice(0, 2).map((tag, index) => (
                        <ProjectTag key={index}>{tag}</ProjectTag>
                      ))}
                    </ProjectTags>
                  </ProjectImage>
                  <ProjectContent>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>
                      {project.description}
                    </ProjectDescription>
                    <ProjectLinks>
                      <ProjectLink href={project.githubLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <IconWrapper icon={FaGithub} /> GitHub
                      </ProjectLink>
                      <ProjectLink href={project.liveLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <IconWrapper icon={FaExternalLinkAlt} /> Live Demo
                      </ProjectLink>
                    </ProjectLinks>
                  </ProjectContent>
                </ProjectCard>
              </TiltEffect>
            </ScrollAnimation>
          ))}
        </ProjectsGrid>
        
        <AnimatePresence>
          {selectedProject && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <ModalContent
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <ModalCloseButton onClick={closeModal}>
                  <IconWrapper icon={FaTimes} />
                </ModalCloseButton>
                
                <ModalImageContainer>
                  <ModalImage>
                    {/* Placeholder for modal image */}
                    <div style={{ 
                      backgroundColor: '#e0e0e0', 
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#aaa',
                      fontSize: '1.2rem'
                    }}>
                      Project Image
                    </div>
                  </ModalImage>
                </ModalImageContainer>
                
                <ModalBody>
                  <ModalTitle>{selectedProject.title}</ModalTitle>
                  <ModalDescription>
                    {selectedProject.fullDescription}
                  </ModalDescription>
                  
                  <ModalTechStack>
                    <ModalTechTitle>Technologies Used</ModalTechTitle>
                    <ModalTechList>
                      {selectedProject.techStack.map((tech, index) => (
                        <ModalTechItem key={index}>{tech}</ModalTechItem>
                      ))}
                    </ModalTechList>
                  </ModalTechStack>
                  
                  <ModalLinks>
                    <ModalLink href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer">
                      <IconWrapper icon={FaGithub} /> View Source Code
                    </ModalLink>
                    <ModalLink href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer">
                      <IconWrapper icon={FaExternalLinkAlt} /> View Live Demo
                    </ModalLink>
                  </ModalLinks>
                </ModalBody>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </ProjectsContainer>
    </ProjectsSection>
  );
};

export default Projects;
