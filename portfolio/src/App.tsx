import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/layout/Layout';
import Home from './components/sections/Home';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';
import ThreeJsGame from './components/sections/ThreeJsGame';
import { CustomCursor, ThreeProjectViewer } from './effects';
import { isWebGLAvailable } from './utils/webGLUtils';

// Sample project data for the 3D viewer
const projectData = [
  {
    id: 0,
    title: 'E-commerce Website',
    description: 'A fully responsive e-commerce platform with product filtering, cart functionality, and payment integration.'
  },
  {
    id: 1,
    title: 'Task Management App',
    description: 'A drag-and-drop task management application with real-time updates and team collaboration features.'
  },
  {
    id: 2,
    title: 'Weather Dashboard',
    description: 'A weather application that displays current conditions and forecasts for locations worldwide.'
  }
];

const App: React.FC = () => {
  const [webGLAvailable, setWebGLAvailable] = useState(false);
  
  useEffect(() => {
    setWebGLAvailable(isWebGLAvailable());
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CustomCursor />
      {webGLAvailable && <ThreeProjectViewer projects={projectData} />}
      <Layout>
        <Home />
        <About />
        <Projects />
        <Skills />
        <ThreeJsGame />
        <Contact />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
