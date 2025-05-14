import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #6C63FF;
    --secondary-color: #FF6584;
    --accent-color: #43CBFF;
    --background-color: #FFFFFF;
    --text-color: #333333;
    --light-gray: #F5F5F5;
    --medium-gray: #E0E0E0;
    --dark-gray: #888888;
    --success-color: #4CAF50;
    --error-color: #F44336;
    --warning-color: #FFC107;
    --info-color: #2196F3;
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
`;

export default GlobalStyles;
