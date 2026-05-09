import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #4f63ff;
    --secondary-color: #ff4f9a;
    --accent-color: #0fb8ff;
    --background-color: #f5f8ff;
    --surface-color: #ffffff;
    --surface-2-color: #eff4ff;
    --border-color: rgba(32, 52, 110, 0.12);
    --text-color: #12192f;
    --light-gray: #eff4ff;
    --medium-gray: #d6def0;
    --dark-gray: #61708f;
    --success-color: #1fae72;
    --error-color: #e85a72;
    --warning-color: #d8a63a;
    --info-color: #2f88ff;
    --header-bg: rgba(245, 248, 255, 0.74);
    --header-bg-scrolled: rgba(245, 248, 255, 0.92);
    --parallax-shape-color: rgba(15, 184, 255, 0.08);
    --parallax-shape-opacity: 0.24;
    --home-primary-btn-bg: linear-gradient(135deg, #12192f 0%, #243761 100%);
    --home-primary-btn-text: #ffffff;
    --hero-gradient-start: #f5f8ff;
    --hero-gradient-end: #e8efff;
    --hero-fg: #11172b;
    --hero-fg-muted: rgba(17, 23, 43, 0.76);
    --hero-border: rgba(15, 184, 255, 0.18);
    --shadow-small: 0 8px 18px rgba(18, 25, 47, 0.08);
    --shadow-medium: 0 14px 38px rgba(18, 25, 47, 0.12);
    --shadow-large: 0 22px 70px rgba(18, 25, 47, 0.15);
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
    --parallax-shape-opacity: 0.12;
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
      radial-gradient(circle at top left, rgba(15, 184, 255, 0.12), transparent 28%),
      radial-gradient(circle at 88% 12%, rgba(255, 79, 154, 0.09), transparent 24%),
      radial-gradient(circle at 50% 110%, rgba(79, 99, 255, 0.14), transparent 34%),
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
      linear-gradient(rgba(15, 184, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(15, 184, 255, 0.03) 1px, transparent 1px);
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
