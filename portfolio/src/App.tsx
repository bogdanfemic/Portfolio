import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/layout/Layout';
import Home from './components/sections/Home';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import FutureGoals from './components/sections/FutureGoals';
import Contact from './components/sections/Contact';
import CommandPalette from './components/ui/CommandPalette';
import { ImpressumPage, PrivacyPage } from './components/legal/LegalPages';
import ScrollAnimation from './effects/ScrollAnimation';
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion';
import { useThemeMode } from './hooks/useThemeMode';
import { portfolioBasePath } from './config/siteConfig';

const MiniOSPage = lazy(() => import('./components/os/MiniOSPage'));
const ThreeJsGame = lazy(() => import('./components/sections/ThreeJsGame'));

const App: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  useThemeMode(); // sets `data-theme` early for CSS variable themes
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const path = pathname === portfolioBasePath
    ? '/'
    : pathname.startsWith(`${portfolioBasePath}/`)
      ? pathname.slice(portfolioBasePath.length)
      : pathname;
  const page = path === '/os'
    ? <MiniOSPage />
    : path === '/impressum'
      ? <ImpressumPage />
      : path === '/datenschutz' || path === '/privacy'
        ? <PrivacyPage />
        : null;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {page ? (
        <Suspense fallback={<div role="status" aria-live="polite">Loading experience…</div>}>{page}</Suspense>
      ) : (
        <>
          <CommandPalette />
          <Layout>
            <Home />
            <ScrollAnimation reducedMotion={prefersReducedMotion}>
              <About />
            </ScrollAnimation>
            <ScrollAnimation animationDelay={80} reducedMotion={prefersReducedMotion}>
              <Projects />
            </ScrollAnimation>
            <ScrollAnimation animationDelay={120} reducedMotion={prefersReducedMotion}>
              <Skills />
            </ScrollAnimation>
            <ScrollAnimation animationDelay={160} reducedMotion={prefersReducedMotion}>
              <FutureGoals />
            </ScrollAnimation>
            <ScrollAnimation animationDelay={200} reducedMotion={prefersReducedMotion}>
              <Suspense fallback={null}><ThreeJsGame /></Suspense>
            </ScrollAnimation>
            <ScrollAnimation animationDelay={240} reducedMotion={prefersReducedMotion}>
              <Contact />
            </ScrollAnimation>
          </Layout>
        </>
      )}
    </ThemeProvider>
  );
};

export default App;
