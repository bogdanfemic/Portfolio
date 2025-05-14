import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndex.menu};
  padding: 1rem 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.medium};
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(motion.div)`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const NavLinks = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 70%;
    max-width: 300px;
    flex-direction: column;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.background};
    box-shadow: ${({ theme }) => theme.shadows.large};
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform ${({ theme }) => theme.transitions.medium};
    z-index: ${({ theme }) => theme.zIndex.menu};
  }
`;

const NavLink = styled(motion.a)`
  margin: 0 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width ${({ theme }) => theme.transitions.medium};
  }
  
  &:hover:after, &.active:after {
    width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin: 1rem 0;
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  z-index: ${({ theme }) => theme.zIndex.menu + 1};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all ${({ theme }) => theme.transitions.medium};
  z-index: ${({ theme }) => theme.zIndex.menu - 1};
`;

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const headerVariants = {
    hidden: { y: -100 },
    visible: { y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const logoVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
  };

  const linkVariants = {
    hover: { y: -2, transition: { duration: 0.3 } },
  };

  return (
    <HeaderContainer 
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      style={{ 
        padding: scrolled ? '0.7rem 0' : '1rem 0',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <NavContainer>
        <Logo 
          variants={logoVariants}
          whileHover="hover"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeMenu();
          }}
        >
          BF
        </Logo>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isOpen ? <IconWrapper icon={FaTimes} /> : <IconWrapper icon={FaBars} />}
        </MobileMenuButton>
        
        <NavLinks isOpen={isOpen}>
          <NavLink 
            href="#home" 
            variants={linkVariants}
            whileHover="hover"
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink 
            href="#about" 
            variants={linkVariants}
            whileHover="hover"
            onClick={closeMenu}
          >
            About
          </NavLink>
          <NavLink 
            href="#projects" 
            variants={linkVariants}
            whileHover="hover"
            onClick={closeMenu}
          >
            Projects
          </NavLink>
          <NavLink 
            href="#skills" 
            variants={linkVariants}
            whileHover="hover"
            onClick={closeMenu}
          >
            Skills
          </NavLink>
          <NavLink 
            href="#threejs-game" 
            variants={linkVariants}
            whileHover="hover"
            onClick={closeMenu}
          >
            3D Game
          </NavLink>
          <NavLink 
            href="#contact" 
            variants={linkVariants}
            whileHover="hover"
            onClick={closeMenu}
          >
            Contact
          </NavLink>
        </NavLinks>
        
        <Overlay isOpen={isOpen} onClick={closeMenu} />
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;
