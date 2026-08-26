import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const Main = styled.main`
  min-height: 100vh;
  padding-top: 80px; /* To account for fixed header */
`;

const SkipLink = styled.a`
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10000;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  background: var(--text-color);
  color: var(--background-color);
  font-weight: 800;
  transform: translateY(-160%);

  &:focus {
    transform: translateY(0);
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Header />
      <Main id="main-content" tabIndex={-1}>{children}</Main>
      <Footer />
    </>
  );
};

export default Layout;
