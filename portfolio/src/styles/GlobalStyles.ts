import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #5f7cff;
    --secondary-color: #ff4fa2;
    --accent-color: #25d6ff;
    --background-color: #050816;
    --surface-color: #0d1426;
    --surface-2-color: #111c33;
    --border-color: rgba(151, 174, 255, 0.16);
    --text-color: #eef2ff;
    --light-gray: #0d1426;
    --medium-gray: #1d2b4e;
    --dark-gray: #a6afc9;
    --success-color: #42d392;
    --error-color: #ff5e7a;
    --warning-color: #ffcf5a;
    --info-color: #4fb6ff;
    --header-bg: rgba(5, 8, 22, 0.58);
    --header-bg-scrolled: rgba(5, 8, 22, 0.86);
    --parallax-shape-color: rgba(255, 255, 255, 0.05);
    --home-primary-btn-bg: linear-gradient(135deg, #ffffff 0%, #d7e7ff 100%);
    --home-primary-btn-text: #06101f;
    --hero-gradient-start: #050816;
    --hero-gradient-end: #0d1730;
    --hero-fg: #f3f7ff;
    --hero-fg-muted: rgba(243, 247, 255, 0.78);
    --hero-border: rgba(37, 214, 255, 0.24);
    --shadow-small: 0 8px 18px rgba(0, 0, 0, 0.22);
    --shadow-medium: 0 14px 38px rgba(0, 0, 0, 0.28);
    --shadow-large: 0 22px 70px rgba(0, 0, 0, 0.36);
    color-scheme: light;
  }

  [data-theme='dark'] {
    --background-color: #050816;
    --surface-color: #0d1426;
    --surface-2-color: #111c33;
    --border-color: rgba(151, 174, 255, 0.16);
    --text-color: #eef2ff;
    --light-gray: #0d1426;
    --medium-gray: #1d2b4e;
    --dark-gray: #a6afc9;
    --header-bg: rgba(5, 8, 22, 0.58);
    --header-bg-scrolled: rgba(5, 8, 22, 0.86);
    --parallax-shape-color: rgba(255, 255, 255, 0.05);
    --home-primary-btn-bg: linear-gradient(135deg, #ffffff 0%, #d7e7ff 100%);
    --home-primary-btn-text: #06101f;
    --hero-gradient-start: #050816;
    --hero-gradient-end: #0d1730;
    --hero-fg: #f3f7ff;
    --hero-fg-muted: rgba(243, 247, 255, 0.78);
    --hero-border: rgba(37, 214, 255, 0.24);
    --shadow-small: 0 8px 18px rgba(0, 0, 0, 0.22);
    --shadow-medium: 0 14px 38px rgba(0, 0, 0, 0.28);
    --shadow-large: 0 22px 70px rgba(0, 0, 0, 0.36);
    color-scheme: dark;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Poppins', 'Montserrat', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
    overflow-x: hidden;
    background:
      radial-gradient(circle at top left, rgba(37, 214, 255, 0.14), transparent 28%),
      radial-gradient(circle at 88% 12%, rgba(255, 79, 162, 0.12), transparent 24%),
      radial-gradient(circle at 50% 110%, rgba(95, 124, 255, 0.2), transparent 34%),
      var(--background-color);
  }

  :focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 3px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  button, input, textarea {
    font-family: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  section {
    padding: 80px 0;
    position: relative;
  }

  .container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    section {
      padding: 60px 0;
    }
  }

  ::selection {
    background: rgba(37, 214, 255, 0.24);
    color: #ffffff;
  }

  #root {
    position: relative;
    z-index: 0;
  }

  #root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 28%, rgba(0,0,0,0.8) 82%, transparent);
    opacity: 0.22;
    z-index: -1;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`;

export default GlobalStyles;
