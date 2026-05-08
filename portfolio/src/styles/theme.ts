export const theme = {
  colors: {
    primary: 'var(--primary-color)',
    secondary: 'var(--secondary-color)',
    accent: 'var(--accent-color)',
    background: 'var(--background-color)',
    text: 'var(--text-color)',
    lightGray: 'var(--light-gray)',
    mediumGray: 'var(--medium-gray)',
    darkGray: 'var(--dark-gray)',
    success: 'var(--success-color)',
    error: 'var(--error-color)',
    warning: 'var(--warning-color)',
    info: 'var(--info-color)',
  },
  fonts: {
    primary: "'Poppins', sans-serif",
    secondary: "'Montserrat', sans-serif",
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
    xxlarge: '2rem',
    xxxlarge: '3rem',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1200px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
  shadows: {
    small: 'var(--shadow-small)',
    medium: 'var(--shadow-medium)',
    large: 'var(--shadow-large)',
  },
  transitions: {
    short: '0.2s ease',
    medium: '0.3s ease',
    long: '0.5s ease',
  },
  zIndex: {
    base: 1,
    menu: 10,
    modal: 100,
    tooltip: 1000,
  },
};

export type Theme = typeof theme;
