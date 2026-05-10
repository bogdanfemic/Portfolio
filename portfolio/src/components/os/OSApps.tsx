import React, { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  FaCheck,
  FaCode,
  FaExternalLinkAlt,
  FaGithub,
  FaGraduationCap,
  FaLinkedin,
  FaPaperPlane,
  FaRegClock,
  FaTools,
} from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import { contactLinks, nowPlayingCards, OSAppId, OSSystemAction, osProjects } from './osData';

const Stack = styled.div`
  display: grid;
  gap: 1rem;
  padding: 0 0.85rem;
`;

const HeroCard = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  border: 1px solid var(--os-border);
  border-radius: 10px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--os-accent) 18%, transparent), transparent 50%),
    var(--os-panel-soft);
  padding: 1rem;

  &::after {
    content: '';
    position: absolute;
    right: -44px;
    top: -44px;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--os-accent) 28%, transparent);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Avatar = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  width: 86px;
  height: 86px;
  border-radius: 24px;
  background: linear-gradient(145deg, var(--os-accent), var(--os-accent-2));
  color: var(--os-accent-text);
  font-size: 2rem;
  box-shadow: 0 18px 45px color-mix(in srgb, var(--os-accent) 22%, transparent);
`;

const HeroTitle = styled.h2`
  margin: 0 0 0.4rem;
  color: var(--os-text);
  font-size: clamp(1.35rem, 3vw, 2rem);
  line-height: 1.1;
`;

const Intro = styled.p`
  margin: 0;
  color: var(--os-muted);
  line-height: 1.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.85rem;
`;

const ProjectGrid = styled(Grid)`
  padding: 0 0.85rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  border: 1px solid var(--os-border);
  border-radius: 8px;
  background: var(--os-panel-soft);
  padding: 1rem;
`;

const StatPanel = styled(Panel)`
  min-height: 0;
`;

const PanelTitle = styled.h3`
  margin: 0 0 0.45rem;
  color: var(--os-text);
  font-size: 0.98rem;
`;

const Metric = styled.div`
  color: var(--os-text);
  font-size: 1.25rem;
  font-weight: 900;
`;

const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.85rem;
`;

const Pill = styled.span`
  border: 1px solid var(--os-border);
  border-radius: 999px;
  padding: 0.28rem 0.55rem;
  color: var(--os-muted);
  font-size: 0.75rem;
  font-weight: 700;
`;

const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 0.85rem;
`;

const ActionLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 36px;
  padding: 0 0.75rem;
  border-radius: 999px;
  background: var(--os-accent);
  color: var(--os-accent-text);
  font-size: 0.82rem;
  font-weight: 800;

  &[href='#'] {
    background: var(--os-panel);
    color: var(--os-muted);
    border: 1px solid var(--os-border);
  }
`;

const SoftButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 36px;
  border: 1px solid var(--os-border);
  border-radius: 999px;
  background: var(--os-panel-soft);
  color: var(--os-text);
  padding: 0 0.75rem;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
`;

const ProjectCard = styled(Panel)`
  display: grid;
  align-content: space-between;
  min-height: 0;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--os-accent) 42%, var(--os-border));
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--os-accent) 10%, transparent), transparent 58%),
      var(--os-panel-soft);
  }
`;

const ProjectTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const ProjectStatus = styled.span`
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, var(--os-accent-2) 42%, var(--os-border));
  border-radius: 999px;
  color: var(--os-accent-2);
  padding: 0.22rem 0.5rem;
  font-size: 0.68rem;
  font-weight: 900;
`;

const TerminalShell = styled.div`
  min-height: 100%;
  height: 100%;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  background:
    radial-gradient(circle at 12% 8%, rgba(100, 244, 172, 0.16), transparent 18rem),
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 34px),
    #081017;
  color: #d7ffe5;
  border: 0;
  padding: 0 1rem;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.035) 0,
      rgba(255, 255, 255, 0.035) 1px,
      transparent 1px,
      transparent 4px
    );
    opacity: 0.34;
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
  color: #8deeb7;
  font-size: 0.78rem;
`;

const TerminalDots = styled.div`
  display: flex;
  gap: 0.35rem;

  span {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: #64f4ac;
    opacity: 0.72;
  }
`;

const TerminalOutput = styled.div`
  flex: 1;
  min-height: 120px;
  overflow: auto;
  padding: 0.1rem 0 0.35rem;
`;

const TerminalLine = styled.div`
  margin-bottom: 0.42rem;
  white-space: pre-wrap;
  line-height: 1.55;
`;

const TerminalCommand = styled(TerminalLine)`
  color: #ffffff;
`;

const TerminalOutputLine = styled(TerminalLine)`
  color: #bdfed6;
`;

const TerminalGhost = styled.span`
  color: rgba(215, 255, 229, 0.56);
`;

const Prompt = styled.span`
  color: #64f4ac;
`;

const TerminalForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.45rem;
`;

const TerminalInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #d7ffe5;
  font: inherit;
`;

const SuggestionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.7rem;
`;

const SuggestionButton = styled.button`
  border: 1px solid rgba(146, 255, 190, 0.2);
  border-radius: 999px;
  background: rgba(146, 255, 190, 0.08);
  color: #d7ffe5;
  padding: 0.28rem 0.55rem;
  cursor: pointer;
`;

const TerminalStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.45rem;
  margin-bottom: 0.7rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const TerminalStatus = styled.div`
  border: 1px solid rgba(146, 255, 190, 0.14);
  border-radius: 8px;
  background: rgba(146, 255, 190, 0.06);
  padding: 0.48rem 0.55rem;
  color: #bdfed6;
  font-size: 0.72rem;

  strong {
    display: block;
    color: #ffffff;
    font-size: 0.8rem;
  }
`;

const MailGrid = styled.div`
  display: grid;
  gap: 0.8rem;
  padding: 0 0.85rem;
`;

const MailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid var(--os-border);
  border-radius: 10px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--os-accent) 12%, transparent), transparent),
    var(--os-panel-soft);
  padding: 0.9rem;
`;

const Field = styled.div`
  display: grid;
  gap: 0.3rem;
`;

const Label = styled.span`
  color: var(--os-muted);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const FakeInput = styled.div`
  min-height: 40px;
  border: 1px solid var(--os-border);
  border-radius: 8px;
  background: var(--os-panel-soft);
  color: var(--os-text);
  padding: 0.7rem 0.8rem;
`;

const FakeTextarea = styled(FakeInput)`
  min-height: 84px;
  line-height: 1.65;
`;

const Equalizer = styled.div`
  display: inline-flex;
  align-items: end;
  gap: 0.22rem;
  height: 30px;

  span {
    width: 6px;
    border-radius: 999px;
    background: linear-gradient(180deg, var(--os-accent), var(--os-accent-2));
    animation: os-eq 1s ease-in-out infinite;
  }

  span:nth-child(1) {
    height: 12px;
  }

  span:nth-child(2) {
    height: 26px;
    animation-delay: 120ms;
  }

  span:nth-child(3) {
    height: 18px;
    animation-delay: 240ms;
  }

  span:nth-child(4) {
    height: 24px;
    animation-delay: 360ms;
  }

  @keyframes os-eq {
    0%,
    100% {
      transform: scaleY(0.72);
    }
    50% {
      transform: scaleY(1);
    }
  }
`;

const ResumeSheet = styled.div`
  border: 1px solid var(--os-border);
  border-radius: 8px;
  background: var(--os-paper);
  color: var(--os-paper-text);
  padding: clamp(1rem, 4vw, 1.5rem);
  min-height: 0;
`;

const ResumeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(24, 32, 43, 0.14);
`;

const ResumeSection = styled.div`
  margin-top: 1rem;
`;

const ResumeLine = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 0.8rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid rgba(24, 32, 43, 0.08);

  span:first-child {
    color: #667084;
    font-size: 0.78rem;
    font-weight: 900;
    text-transform: uppercase;
  }
`;

const DisabledButton = styled.button`
  min-height: 40px;
  border: 1px solid var(--os-border);
  border-radius: 999px;
  background: var(--os-panel);
  color: var(--os-muted);
  font-weight: 800;
  padding: 0 0.9rem;
  cursor: not-allowed;
`;

interface TerminalEntry {
  id: number;
  command?: string;
  output: string;
}

interface SkillsTerminalAppProps {
  mode: 'dark' | 'light';
  onOpenApp: (id: OSAppId) => void;
  onSetTheme: (mode: 'dark' | 'light') => void;
  onSystemAction: (action: OSSystemAction) => void;
}

const appAliases: Record<string, OSAppId> = {
  about: 'about',
  'about.exe': 'about',
  projects: 'projects',
  project: 'projects',
  skills: 'skills',
  terminal: 'skills',
  contact: 'contact',
  mail: 'contact',
  now: 'now',
  music: 'now',
  resume: 'resume',
  'resume.pdf': 'resume',
};

const commandCompletionOptions = [
  'help',
  'neofetch',
  'ls',
  'open',
  'theme',
  'skills',
  'stack',
  'contact',
  'whoami',
  'date',
  'pwd',
  'echo',
  'matrix',
  'mission',
  'demo',
  'arrange',
  'ignite',
  'closeall',
  'brief',
  'map',
  'history',
  'clear',
];

const appCompletionOptions = ['about', 'projects', 'skills', 'contact', 'now', 'resume'];
const themeCompletionOptions = ['dark', 'light', 'toggle'];

const getCommonPrefix = (items: string[]) => {
  if (items.length === 0) return '';
  return items.reduce((prefix, item) => {
    let index = 0;
    while (index < prefix.length && index < item.length && prefix[index] === item[index]) {
      index += 1;
    }
    return prefix.slice(0, index);
  });
};

const helpText = `Available commands:
  help             Show this command list
  neofetch         Render a Portfolio OS system card
  ls               List desktop apps
  open <app>       Open about, projects, skills, contact, now, or resume
  theme <mode>     Switch theme: dark, light, or toggle
  skills           Print core skills
  stack            Print preferred stack
  contact          Print contact links
  whoami           Print short bio
  date             Print current local time
  echo <text>      Print text
  matrix           Run a fake visual diagnostic
  mission          Open Mission Control
  demo             Compose a staged project/contact workspace
  arrange          Tile open windows
  ignite           Open every OS app
  closeall         Close every OS app
  brief            Print a concise hiring brief
  map              Print the portfolio system map
  history          Print commands used this session
  clear            Clear terminal`;

export const AboutApp: React.FC = () => (
  <Stack>
    <HeroCard>
      <Avatar>
        <IconWrapper icon={FaCode} />
      </Avatar>
      <div>
        <HeroTitle>Bogdan Femic</HeroTitle>
        <Intro>
          Frontend developer and Computer Science student at TU Darmstadt, building sharp
          interfaces, motion-led web experiences, and interactive portfolio systems.
        </Intro>
      </div>
    </HeroCard>
    <StatGrid>
      <StatPanel>
        <IconWrapper icon={FaGraduationCap} />
        <Metric>TU Darmstadt</Metric>
        <Intro>Computer Science student</Intro>
      </StatPanel>
      <StatPanel>
        <IconWrapper icon={FaTools} />
        <Metric>React + TS</Metric>
        <Intro>Primary build stack</Intro>
      </StatPanel>
      <StatPanel>
        <IconWrapper icon={FaRegClock} />
        <Metric>Frankfurt</Metric>
        <Intro>Based in Hessen</Intro>
      </StatPanel>
    </StatGrid>
    <Panel>
      <PanelTitle>What I build</PanelTitle>
      <Grid>
        <Intro>Polished portfolio and product interfaces with strong first impressions.</Intro>
        <Intro>Interactive browser experiences using motion, WebGL, and thoughtful UI systems.</Intro>
        <Intro>Practical tools and learning projects across web, mobile, and mentorship work.</Intro>
      </Grid>
    </Panel>
  </Stack>
);

export const ProjectsApp: React.FC = () => (
  <ProjectGrid>
    {osProjects.map((project) => (
      <ProjectCard key={project.title}>
        <div>
          <ProjectTop>
            <PanelTitle>{project.title}</PanelTitle>
            <ProjectStatus>{project.status}</ProjectStatus>
          </ProjectTop>
          <Intro>{project.description}</Intro>
          <PillRow>
            {project.techStack.map((tech) => (
              <Pill key={tech}>{tech}</Pill>
            ))}
          </PillRow>
        </div>
        <LinkRow>
          <ActionLink href={project.liveLink} target={project.liveLink === '#' ? undefined : '_blank'} rel="noopener noreferrer">
            <IconWrapper icon={FaExternalLinkAlt} />
            Live
          </ActionLink>
          <ActionLink href={project.codeLink}>
            <IconWrapper icon={FaGithub} />
            Code
          </ActionLink>
        </LinkRow>
      </ProjectCard>
    ))}
  </ProjectGrid>
);

export const SkillsTerminalApp: React.FC<SkillsTerminalAppProps> = ({ mode, onOpenApp, onSetTheme, onSystemAction }) => {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      id: 1,
      output:
        'Portfolio OS terminal online. Try mission, demo, neofetch, open projects, theme toggle, brief, or help.',
    },
  ]);
  const [value, setValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const entryId = useRef(2);
  const outputRef = useRef<HTMLDivElement>(null);
  const commands = useMemo(
    () => ['mission', 'demo', 'brief', 'open projects', 'arrange', 'theme toggle', 'map', 'help'],
    []
  );

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [entries]);

  const appendEntry = (command: string, output: string) => {
    setEntries((items) => [...items, { id: entryId.current++, command, output }]);
  };

  const appendSystemLine = (output: string) => {
    setEntries((items) => [...items, { id: entryId.current++, output }]);
  };

  const completeValue = (rawValue: string) => {
    const lowerValue = rawValue.toLowerCase();
    const hasTrailingSpace = /\s$/.test(lowerValue);
    const [base = '', ...args] = lowerValue.trimStart().split(/\s+/);
    const argument = hasTrailingSpace ? '' : args.join(' ');

    const formatMatches = (matches: string[]) => `completions:\n  ${matches.join('\n  ')}`;
    const completeFrom = (prefix: string, options: string[], format: (match: string) => string) => {
      const matches = options.filter((option) => option.startsWith(prefix));
      if (matches.length === 0) return { output: 'no completions' };
      if (matches.length === 1) return { value: format(matches[0]) };

      const commonPrefix = getCommonPrefix(matches);
      if (commonPrefix.length > prefix.length) {
        return { value: format(commonPrefix), output: formatMatches(matches) };
      }
      return { output: formatMatches(matches) };
    };

    if (base === 'open') {
      return completeFrom(argument, appCompletionOptions, (match) => `open ${match}`);
    }

    if (base === 'theme') {
      return completeFrom(argument, themeCompletionOptions, (match) => `theme ${match}`);
    }

    if (args.length > 0) return { output: 'no completions' };

    return completeFrom(base, commandCompletionOptions, (match) => (match === 'open' || match === 'theme' ? `${match} ` : match));
  };

  const getOutput = (command: string) => {
    const [base, ...args] = command.split(/\s+/);
    const argument = args.join(' ');

    switch (base) {
      case 'help':
        return helpText;
      case 'whoami':
        return 'Bogdan Femic - Computer Science student at TU Darmstadt, based near Frankfurt, building sharp web interfaces and interactive portfolio systems.';
      case 'skills':
        return 'React, TypeScript, styled-components, Framer Motion, Three.js, Swift, Node.js, Firebase, MongoDB, accessibility, UI polish, mentorship.';
      case 'stack':
        return 'Preferred stack: React + TypeScript for structure, styled-components for scoped visual systems, Framer Motion for feel, Three.js for depth.';
      case 'brief':
        return 'Bogdan Femic: CS student and frontend developer near Frankfurt. Strong fit for React/TypeScript UI work, motion-heavy product surfaces, portfolio systems, and teams that care about interface taste as much as implementation quality.';
      case 'contact':
        return 'Email: bogdanfemic07@gmail.com\nGitHub: github.com/bogdanfemic\nLinkedIn: linkedin.com/in/bogdan-femic';
      case 'now':
        return 'Current focus: 3D scene composition, materials, interaction polish, and portfolio experiences that feel native to the browser.';
      case 'date':
        return new Intl.DateTimeFormat(undefined, {
          dateStyle: 'full',
          timeStyle: 'medium',
        }).format(new Date());
      case 'pwd':
        return '/Users/bogdan/PortfolioOS/workspace';
      case 'ls':
        return 'About.exe\nProjects.app\nSkills Terminal\nContact Mail\nNow Playing\nResume.pdf';
      case 'neofetch':
        return `Portfolio OS
Host: React 19 + Vite
Shell: Skills Terminal
Theme: ${mode}
Window server: Framer Motion + controlled resize
Desktop: glass grid / live widgets
Mission Control: enabled
Stack: React, TypeScript, styled-components, Three.js
Identity: Bogdan Femic`;
      case 'matrix':
        return '01010000 01101111 01110010 01110100 01100110 01101111 01101100 01101001 01101111\nSignal locked. Creativity bus nominal. UI latency low. Build taste detected.';
      case 'map':
        return 'System map:\nHome hero -> Mini OS preview -> /os route\nDesktop shell -> windows, dock, widgets, command palette, Mission Control\nTerminal -> app launcher, theme switcher, workspace composer\nProjects -> storefront, mobile concept, mentorship surface';
      case 'mission':
        onSystemAction('mission');
        return 'Mission Control opened. Click any tile to focus an app.';
      case 'demo':
        onSystemAction('demo');
        return 'Demo workspace composed: Projects, Terminal, and Contact staged for review.';
      case 'arrange':
        onSystemAction('arrange');
        return 'Open windows tiled into a clean review grid.';
      case 'ignite':
        onSystemAction('open-all');
        return 'All Portfolio OS apps are now mounted.';
      case 'closeall':
        onSystemAction('close-all');
        return 'All windows closed. Dock launchers remain available.';
      case 'history':
        return commandHistory.length > 0 ? commandHistory.map((item, index) => `${index + 1}  ${item}`).join('\n') : 'No commands yet.';
      case 'echo':
        return argument || '';
      case 'open': {
        const appId = appAliases[argument.toLowerCase()];
        if (!appId) return `Unknown app: ${argument || '(empty)'}. Try ls.`;
        onOpenApp(appId);
        return `Opened ${argument}.`;
      }
      case 'theme': {
        const target = argument.toLowerCase();
        if (target === 'toggle') {
          onSetTheme(mode === 'dark' ? 'light' : 'dark');
          return `Theme switched to ${mode === 'dark' ? 'light' : 'dark'}.`;
        }
        if (target === 'dark' || target === 'light') {
          onSetTheme(target);
          return `Theme switched to ${target}.`;
        }
        return 'Usage: theme dark | theme light | theme toggle';
      }
      default:
        return `Command not found: ${base}. Type help.`;
    }
  };

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;
    if (command === 'clear') {
      setEntries([]);
      setValue('');
      return;
    }
    appendEntry(command, getOutput(command));
    setCommandHistory((items) => [...items, command]);
    setHistoryIndex(null);
    setValue('');
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    runCommand(value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const completion = completeValue(value);
      if (completion.value !== undefined) {
        setValue(completion.value);
      }
      if (completion.output) {
        appendSystemLine(completion.output);
      }
      setHistoryIndex(null);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setValue(commandHistory[nextIndex]);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setValue('');
      } else {
        setHistoryIndex(nextIndex);
        setValue(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <TerminalShell>
      <TerminalHeader>
        <TerminalDots aria-hidden="true">
          <span />
          <span />
          <span />
        </TerminalDots>
        <span>portfolio-os:/workspace</span>
      </TerminalHeader>
      <TerminalStatusGrid>
        <TerminalStatus>
          <strong>12 ms</strong>
          shell latency
        </TerminalStatus>
        <TerminalStatus>
          <strong>{mode}</strong>
          theme
        </TerminalStatus>
        <TerminalStatus>
          <strong>6 apps</strong>
          mounted
        </TerminalStatus>
        <TerminalStatus>
          <strong>local</strong>
          session
        </TerminalStatus>
      </TerminalStatusGrid>
      <SuggestionRow aria-label="Suggested terminal commands">
        {commands.map((command) => (
          <SuggestionButton key={command} type="button" onClick={() => runCommand(command)}>
            {command}
          </SuggestionButton>
        ))}
      </SuggestionRow>
      <TerminalOutput ref={outputRef}>
        {entries.map((entry) => (
          <div key={entry.id}>
            {entry.command && (
              <TerminalCommand>
                <Prompt>portfolio@os</Prompt>
                <TerminalGhost>:</TerminalGhost>
                <span>~</span>
                <TerminalGhost>$ </TerminalGhost>
                {entry.command}
              </TerminalCommand>
            )}
            <TerminalOutputLine>{entry.output}</TerminalOutputLine>
          </div>
        ))}
      </TerminalOutput>
      <TerminalForm onSubmit={onSubmit}>
        <Prompt>portfolio@os</Prompt>
        <TerminalGhost>:</TerminalGhost>
        <span>~</span>
        <TerminalGhost>$</TerminalGhost>
        <TerminalInput
          aria-label="Terminal command"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
          autoFocus
        />
      </TerminalForm>
    </TerminalShell>
  );
};

export const ContactMailApp: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'bogdanfemic07@gmail.com';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <MailGrid>
      <MailHeader>
        <div>
          <PanelTitle>New message</PanelTitle>
          <Intro>Fastest path: email or LinkedIn.</Intro>
        </div>
        <SoftButton type="button" onClick={copyEmail}>
          <IconWrapper icon={copied ? FaCheck : FaPaperPlane} />
          {copied ? 'Copied' : 'Copy email'}
        </SoftButton>
      </MailHeader>
      <Field>
        <Label>To</Label>
        <FakeInput>Bogdan Femic &lt;{email}&gt;</FakeInput>
      </Field>
      <Field>
        <Label>Subject</Label>
        <FakeInput>Portfolio OS hello</FakeInput>
      </Field>
      <Field>
        <Label>Message</Label>
        <FakeTextarea>
          Hi Bogdan, I found your portfolio OS and would like to connect about a project.
        </FakeTextarea>
      </Field>
      <LinkRow>
        <ActionLink href={contactLinks.email}>
          <IconWrapper icon={FaPaperPlane} />
          Email
        </ActionLink>
        <ActionLink href={contactLinks.github} target="_blank" rel="noopener noreferrer">
          <IconWrapper icon={FaGithub} />
          GitHub
        </ActionLink>
        <ActionLink href={contactLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <IconWrapper icon={FaLinkedin} />
          LinkedIn
        </ActionLink>
      </LinkRow>
    </MailGrid>
  );
};

export const NowPlayingApp: React.FC = () => (
  <Stack>
    <HeroCard>
      <Equalizer aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </Equalizer>
      <div>
        <HeroTitle>Currently tuned for polish</HeroTitle>
        <Intro>Small details, fast interfaces, and browser-native interactions.</Intro>
      </div>
    </HeroCard>
    <Grid>
      {nowPlayingCards.map((card) => (
        <Panel key={card.label}>
          <Label>{card.label}</Label>
          <PanelTitle>{card.value}</PanelTitle>
        </Panel>
      ))}
    </Grid>
  </Stack>
);

export const ResumeApp: React.FC = () => (
  <Stack>
    <ResumeSheet>
      <ResumeHeader>
        <div>
          <Label>Resume.pdf</Label>
          <h2>Resume placeholder</h2>
        </div>
        <Pill>Draft</Pill>
      </ResumeHeader>
      <Intro>
        No resume PDF was found in the repository, so this window is intentionally a clean
        placeholder. Add a real PDF later and update the button target in this app.
      </Intro>
      <ResumeSection>
        <ResumeLine>
          <span>Focus</span>
          <strong>Frontend development, interactive UI, motion systems</strong>
        </ResumeLine>
        <ResumeLine>
          <span>Stack</span>
          <strong>React, TypeScript, styled-components, Framer Motion, Three.js</strong>
        </ResumeLine>
        <ResumeLine>
          <span>Education</span>
          <strong>Computer Science at TU Darmstadt</strong>
        </ResumeLine>
      </ResumeSection>
    </ResumeSheet>
    <DisabledButton type="button" disabled>
      Download Resume unavailable
    </DisabledButton>
  </Stack>
);
