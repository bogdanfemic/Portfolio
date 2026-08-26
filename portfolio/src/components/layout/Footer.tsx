import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import { portfolioPath } from '../../config/siteConfig';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 3rem 0 2rem;
`;

const FooterContent = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterLogo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SocialLink = styled(motion.a)`
  color: white;
  font-size: 1.5rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FooterNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const FooterLink = styled.a`
  color: white;
  font-weight: 500;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Copyright = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
  opacity: 0.8;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const socialVariants = {
    hover: { 
      y: -5,
      transition: { duration: 0.3 }
    }
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterLogo>Bogdan Femic</FooterLogo>
        
        <SocialLinks>
          <SocialLink 
            href="https://github.com/bogdanfemic" 
            target="_blank" 
            rel="noopener noreferrer"
            variants={socialVariants}
            whileHover="hover"
            aria-label="Bogdan Femic on GitHub"
          >
            <IconWrapper icon={FaGithub} />
          </SocialLink>
          <SocialLink 
            href="https://www.linkedin.com/in/bogdan-femic/" 
            target="_blank" 
            rel="noopener noreferrer"
            variants={socialVariants}
            whileHover="hover"
            aria-label="Bogdan Femic on LinkedIn"
          >
            <IconWrapper icon={FaLinkedin} />
          </SocialLink>
          <SocialLink 
            href="mailto:bogdanfemic07@gmail.com" 
            variants={socialVariants}
            whileHover="hover"
            aria-label="Email Bogdan Femic"
          >
            <IconWrapper icon={FaEnvelope} />
          </SocialLink>
        </SocialLinks>
        
        <FooterNav>
          <FooterLink href="#home">Home</FooterLink>
          <FooterLink href="#about">About</FooterLink>
          <FooterLink href="#projects">Projects</FooterLink>
          <FooterLink href="#skills">Skills</FooterLink>
          <FooterLink href="#contact">Contact</FooterLink>
          <FooterLink href={portfolioPath('impressum')}>Impressum</FooterLink>
          <FooterLink href={portfolioPath('datenschutz')}>Privacy</FooterLink>
        </FooterNav>
        
        <Copyright>
          &copy; {currentYear} Bogdan Femic. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
