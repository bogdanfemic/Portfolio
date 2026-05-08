import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('./utils/webGLUtils', () => ({
  isWebGLAvailable: () => false,
}));

jest.mock('./components/sections/ThreeJsGame', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./effects', () => ({
  CustomCursor: () => null,
  ThreeProjectViewer: () => null,
  ThreeBackground: () => null,
  ParallaxEffect: () => null,
  TypingEffect: () => null,
  TiltEffect: () => null,
  ScrollAnimation: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('framer-motion', () => ({
  __esModule: true,
  motion: new Proxy(
    {},
    {
      get:
        () =>
        // Minimal stub that strips motion-specific props so React doesn't warn.
        ({ children, ...rest }: any) => {
          const {
            whileHover,
            whileTap,
            whileInView,
            initial,
            animate,
            exit,
            variants,
            transition,
            viewport,
            layout,
            layoutId,
            ...domProps
          } = rest;
          return <div {...domProps}>{children}</div>;
        },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const App = require('./App').default;

test('renders the home hero name', () => {
  render(<App />);
  expect(screen.getAllByText(/Bogdan Femic/i).length).toBeGreaterThan(0);
});
