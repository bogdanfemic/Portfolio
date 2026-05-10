import {
  FaAddressCard,
  FaBriefcase,
  FaEnvelope,
  FaFilePdf,
  FaMusic,
  FaTerminal,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

export type OSAppId = 'about' | 'projects' | 'skills' | 'contact' | 'now' | 'resume';
export type OSSystemAction = 'mission' | 'arrange' | 'open-all' | 'close-all' | 'demo';

export interface OSAppConfig {
  id: OSAppId;
  label: string;
  title: string;
  icon: IconType;
  shortcut: string;
  summary: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
}

export const osApps: OSAppConfig[] = [
  {
    id: 'about',
    label: 'About.exe',
    title: 'About.exe',
    icon: FaAddressCard,
    shortcut: 'A',
    summary: 'Personal intro and build style',
    defaultPosition: { x: 124, y: 0 },
    defaultSize: { width: 520, height: 342 },
  },
  {
    id: 'projects',
    label: 'Projects',
    title: 'Projects',
    icon: FaBriefcase,
    shortcut: 'P',
    summary: 'Selected work and project links',
    defaultPosition: { x: 306, y: 0 },
    defaultSize: { width: 690, height: 372 },
  },
  {
    id: 'skills',
    label: 'Skills Terminal',
    title: 'Skills Terminal',
    icon: FaTerminal,
    shortcut: 'S',
    summary: 'Interactive commands and stack',
    defaultPosition: { x: 448, y: 0 },
    defaultSize: { width: 660, height: 428 },
  },
  {
    id: 'contact',
    label: 'Contact Mail',
    title: 'Contact Mail',
    icon: FaEnvelope,
    shortcut: 'C',
    summary: 'Email and social links',
    defaultPosition: { x: 196, y: 42 },
    defaultSize: { width: 570, height: 386 },
  },
  {
    id: 'now',
    label: 'Now Playing',
    title: 'Now Playing',
    icon: FaMusic,
    shortcut: 'N',
    summary: 'Current interests and favorites',
    defaultPosition: { x: 696, y: 48 },
    defaultSize: { width: 430, height: 312 },
  },
  {
    id: 'resume',
    label: 'Resume.pdf',
    title: 'Resume.pdf',
    icon: FaFilePdf,
    shortcut: 'R',
    summary: 'Resume placeholder and focus areas',
    defaultPosition: { x: 536, y: 20 },
    defaultSize: { width: 510, height: 382 },
  },
];

export const contactLinks = {
  email: 'mailto:bogdanfemic07@gmail.com',
  github: 'https://github.com/bogdanfemic',
  linkedin: 'https://www.linkedin.com/in/bogdan-femic/',
};

export const osProjects = [
  {
    title: 'Yara Shop',
    status: 'Live storefront',
    description:
      'An African brand storefront focused on clothing inspired by African culture and heritage.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Styled Components'],
    liveLink: 'https://shop.yara.community',
    codeLink: '#',
  },
  {
    title: 'HotTake',
    status: 'Mobile concept',
    description:
      'A Swift iOS app concept for sharing short, critical opinions and discussing topics with other users.',
    techStack: ['Swift', 'iOS', 'Firebase', 'Push Notifications'],
    liveLink: '#',
    codeLink: '#',
  },
  {
    title: 'Digitechnikum',
    status: 'Mentorship',
    description:
      'Mentorship work helping young developers build technology projects around mobility, climate, energy, and accessibility.',
    techStack: ['Mentorship', 'Career Guidance'],
    liveLink: 'https://sptg.de/projekte/wissenschaft-und-technik/digitechnikum',
    codeLink: '#',
  },
];

export const nowPlayingCards = [
  { label: 'Currently learning', value: '3D modeling, materials, and scene composition' },
  { label: 'Favorite stack', value: 'React, TypeScript, styled-components, Framer Motion' },
  { label: 'Recent obsession', value: 'Tiny interactive systems that make portfolios feel alive' },
  { label: 'Coding soundtrack', value: 'Focused electronic sets and late-night instrumentals' },
];
