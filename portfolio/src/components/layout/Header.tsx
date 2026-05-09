import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaMoon, FaSun, FaSearch } from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import { useThemeMode } from '../../hooks/useThemeMode';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndex.menu};
  padding: 0.8rem 0;
  background-color: var(--header-bg);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
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
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 700;
  color: var(--text-color);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
    box-shadow: 0 0 18px color-mix(in srgb, var(--accent-color) 45%, transparent);
  }
`;

const NavLinks = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--surface-color) 76%, transparent);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 70%;
    max-width: 300px;
    flex-direction: column;
    justify-content: center;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--background-color) 95%, transparent),
      color-mix(in srgb, var(--surface-color) 96%, transparent)
    );
    box-shadow: ${({ theme }) => theme.shadows.large};
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform ${({ theme }) => theme.transitions.medium};
    z-index: ${({ theme }) => theme.zIndex.menu};
    backdrop-filter: blur(18px);
  }
`;

const NavLink = styled(motion.a)`
  margin: 0 0.1rem;
  font-weight: 500;
  color: var(--text-color);
  position: relative;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent-color) 12%, transparent);
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.medium};
  }
  
  &:hover:after, &.active:after {
    opacity: 1;
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

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: var(--text-color);
  background: color-mix(in srgb, var(--surface-color) 78%, transparent);
  border: 1px solid var(--border-color);
  transition: transform ${({ theme }) => theme.transitions.short}, background-color ${({ theme }) => theme.transitions.short}, border-color ${({ theme }) => theme.transitions.short};

  &:hover {
    transform: translateY(-1px);
    background: color-mix(in srgb, var(--accent-color) 12%, transparent);
    border-color: color-mix(in srgb, var(--secondary-color) 28%, transparent);
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all ${({ theme }) => theme.transitions.medium};
  z-index: ${({ theme }) => theme.zIndex.menu - 1};
`;

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { mode, toggle } = useThemeMode();

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
        backgroundColor: scrolled ? 'var(--header-bg-scrolled)' : 'var(--header-bg)',
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

        <ActionRow>
          <ActionButton
            type="button"
            aria-label="Open command palette"
            title="Search (Ctrl/⌘ K or /)"
            onClick={() => window.dispatchEvent(new Event('command-palette:open'))}
          >
            <IconWrapper icon={FaSearch} />
          </ActionButton>
          <ActionButton
            type="button"
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            title="Toggle theme"
            onClick={toggle}
          >
            <IconWrapper icon={mode === 'dark' ? FaMoon : FaSun} />
          </ActionButton>

          <MobileMenuButton onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <IconWrapper icon={FaTimes} /> : <IconWrapper icon={FaBars} />}
          </MobileMenuButton>
        </ActionRow>

        <NavLinks $isOpen={isOpen}>
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
            href="#future-goals"
            variants={linkVariants}
            whileHover="hover"
            onClick={closeMenu}
          >
            Goals
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
        
        <Overlay $isOpen={isOpen} onClick={closeMenu} />
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;
