import React, { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaCodeBranch,
  FaKeyboard,
  FaMagic,
  FaMoon,
  FaPowerOff,
  FaSearch,
  FaSun,
  FaThLarge,
  FaWifi,
} from 'react-icons/fa';
import { IconWrapper } from '../../utils/IconWrapper';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import { AboutApp, ContactMailApp, NowPlayingApp, ProjectsApp, ResumeApp, SkillsTerminalApp } from './OSApps';
import { OSAppConfig, OSAppId, OSSystemAction, osApps } from './osData';
import { portfolioPath } from '../../config/siteConfig';

type OSTheme = 'dark' | 'light';
type ResizeEdge = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';

interface WindowState {
  id: OSAppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ContextMenuState {
  x: number;
  y: number;
}

const OSRoot = styled.div<{ $mode: OSTheme }>`
  --os-text: ${({ $mode }) => ($mode === 'dark' ? '#f6fbff' : '#121923')};
  --os-muted: ${({ $mode }) => ($mode === 'dark' ? '#b9c9d8' : '#526173')};
  --os-border: ${({ $mode }) => ($mode === 'dark' ? 'rgba(226, 241, 255, 0.18)' : 'rgba(24, 34, 46, 0.16)')};
  --os-panel: ${({ $mode }) => ($mode === 'dark' ? 'rgba(12, 20, 31, 0.72)' : 'rgba(255, 255, 255, 0.78)')};
  --os-panel-solid: ${({ $mode }) => ($mode === 'dark' ? '#111b28' : '#f8fbff')};
  --os-panel-soft: ${({ $mode }) => ($mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(14, 54, 88, 0.06)')};
  --os-titlebar: ${({ $mode }) => ($mode === 'dark' ? 'rgba(8, 15, 24, 0.62)' : 'rgba(255, 255, 255, 0.5)')};
  --os-glass-line: ${({ $mode }) => ($mode === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.72)')};
  --os-accent: ${({ $mode }) => ($mode === 'dark' ? '#76e4f7' : '#106fb0')};
  --os-accent-2: ${({ $mode }) => ($mode === 'dark' ? '#9cffbd' : '#0f9c76')};
  --os-accent-text: ${({ $mode }) => ($mode === 'dark' ? '#07131d' : '#ffffff')};
  --os-danger: #ff6b6b;
  --os-warning: #ffd166;
  --os-success: #7cf7b5;
  --os-paper: ${({ $mode }) => ($mode === 'dark' ? '#f7f7f2' : '#ffffff')};
  --os-paper-text: #18202b;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 42%), color-mix(in srgb, var(--os-accent) 18%, transparent), transparent 22rem),
    linear-gradient(90deg, color-mix(in srgb, var(--os-border) 42%, transparent) 1px, transparent 1px),
    linear-gradient(color-mix(in srgb, var(--os-border) 34%, transparent) 1px, transparent 1px),
    radial-gradient(circle at 17% 18%, ${({ $mode }) => ($mode === 'dark' ? 'rgba(118, 228, 247, 0.24)' : 'rgba(16, 111, 176, 0.2)')}, transparent 25%),
    radial-gradient(circle at 78% 24%, ${({ $mode }) => ($mode === 'dark' ? 'rgba(156, 255, 189, 0.16)' : 'rgba(15, 156, 118, 0.18)')}, transparent 27%),
    linear-gradient(135deg, ${({ $mode }) => ($mode === 'dark' ? '#07111c 0%, #162334 52%, #0d1723 100%' : '#dce9f7 0%, #f6fbff 52%, #d8efe7 100%')});
  background-size: auto, 58px 58px, 58px 58px, auto, auto, auto;
  color: var(--os-text);
  font-family: ${({ theme }) => theme.fonts.primary};

  &::before,
  &::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  &::before {
    z-index: 0;
    background:
      linear-gradient(115deg, transparent 12%, color-mix(in srgb, var(--os-accent) 13%, transparent) 33%, transparent 48%),
      linear-gradient(245deg, transparent 34%, color-mix(in srgb, var(--os-accent-2) 12%, transparent) 58%, transparent 74%);
    opacity: 0.9;
  }

  &::after {
    z-index: 1;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 3px 3px;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.48), transparent 70%);
  }
`;

const Desktop = styled.main`
  position: relative;
  z-index: 2;
  height: 100vh;
  padding: 0;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
    padding: 48px 10px 86px;
  }
`;

const TopBarShell = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 6000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 44px;
  padding: 0 1rem;
  border-bottom: 1px solid var(--os-border);
  background: color-mix(in srgb, var(--os-panel-solid) 78%, transparent);
  backdrop-filter: blur(18px);
`;

const TopCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
`;

const OSTitle = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--os-text);
  font-weight: 900;
  white-space: nowrap;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--os-accent), var(--os-accent-2));
    box-shadow: 0 0 18px color-mix(in srgb, var(--os-accent) 72%, transparent);
  }
`;

const StatusText = styled.span`
  color: var(--os-muted);
  font-size: 0.86rem;
  font-weight: 700;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-width: 36px;
  min-height: 36px;
  border: 1px solid var(--os-border);
  border-radius: 999px;
  background: var(--os-panel);
  color: var(--os-text);
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-1px);
    background: var(--os-panel-soft);
  }
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 30px;
  padding: 0 0.65rem;
  border: 1px solid var(--os-border);
  border-radius: 999px;
  background: var(--os-panel);
  color: var(--os-muted);
  font-size: 0.78rem;
  font-weight: 800;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const SignalStrip = styled.div`
  position: absolute;
  left: 50%;
  top: 56px;
  z-index: 1;
  display: flex;
  gap: 0.5rem;
  transform: translateX(-50%);
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const SignalToken = styled(motion.div)`
  min-width: 130px;
  border: 1px solid var(--os-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--os-panel-solid) 54%, transparent);
  color: var(--os-muted);
  padding: 0.4rem 0.7rem;
  font-size: 0.72rem;
  font-weight: 900;
  text-align: center;
  backdrop-filter: blur(14px);
`;

const DesktopIcons = styled.div`
  position: absolute;
  top: 56px;
  left: 24px;
  display: grid;
  gap: 0.85rem;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: relative;
    top: auto;
    left: auto;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-bottom: 1rem;
  }
`;

const DesktopIconButton = styled.button`
  width: 92px;
  min-height: 86px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--os-text);
  display: grid;
  place-items: center;
  gap: 0.35rem;
  cursor: pointer;
  text-align: center;
  padding: 0.5rem;

  &:hover,
  &:focus-visible {
    border-color: var(--os-border);
    background: var(--os-panel);
  }

  span:first-child {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 8px;
    background: linear-gradient(145deg, var(--os-accent), var(--os-accent-2));
    color: var(--os-accent-text);
  }

  span:last-child {
    font-size: 0.76rem;
    font-weight: 800;
    text-shadow: 0 1px 14px rgba(0, 0, 0, 0.24);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: auto;
  }
`;

const DesktopWidgetRail = styled.aside`
  position: absolute;
  top: 56px;
  right: 24px;
  width: min(320px, calc(100vw - 48px));
  display: grid;
  gap: 0.85rem;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: relative;
    top: auto;
    right: auto;
    width: auto;
    margin-bottom: 1rem;
  }
`;

const DesktopWidget = styled(motion.div)`
  border: 1px solid var(--os-border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--os-panel-solid) 64%, transparent);
  backdrop-filter: blur(18px);
  padding: 1rem;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.18);
`;

const WidgetKicker = styled.div`
  color: var(--os-muted);
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const WidgetTitle = styled.div`
  margin-top: 0.35rem;
  color: var(--os-text);
  font-size: 1.05rem;
  font-weight: 900;
`;

const WidgetMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.75rem;
`;

const TinyChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 26px;
  border: 1px solid var(--os-border);
  border-radius: 999px;
  background: var(--os-panel-soft);
  color: var(--os-muted);
  padding: 0 0.55rem;
  font-size: 0.72rem;
  font-weight: 800;
`;

const FocusList = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-top: 0.85rem;
`;

const FocusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  color: var(--os-muted);
  font-size: 0.8rem;
  font-weight: 700;

  span:last-child {
    color: var(--os-text);
  }
`;

const WindowLayer = styled.div`
  position: absolute;
  inset: 44px 0 0;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: relative;
    inset: auto;
    display: grid;
    gap: 1rem;
    pointer-events: auto;
  }
`;

const WindowShell = styled(motion.section)<{ $zIndex: number; $maximized: boolean; $active: boolean }>`
  position: absolute;
  z-index: ${({ $zIndex }) => $zIndex};
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ $active }) => ($active ? 'color-mix(in srgb, var(--os-accent) 58%, var(--os-border))' : 'var(--os-border)')};
  border-radius: 12px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--os-glass-line) 46%, transparent), transparent 36px),
    var(--os-panel);
  color: var(--os-text);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 var(--os-glass-line),
    ${({ $active }) => ($active ? '0 0 0 1px color-mix(in srgb, var(--os-accent) 22%, transparent), 0 0 55px color-mix(in srgb, var(--os-accent) 16%, transparent)' : 'none')};
  backdrop-filter: blur(18px);
  overflow: hidden;
  pointer-events: auto;
  height: auto;
  padding: 0;
  isolation: isolate;

  ${({ $maximized }) =>
    $maximized &&
    `
      left: 0 !important;
      top: 0 !important;
      width: 100vw !important;
      height: calc(100vh - 44px) !important;
      border-radius: 0 !important;
      transform: none !important;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: static;
    width: 100% !important;
    height: auto !important;
    min-height: 0;
    max-height: none;
    transform: none !important;
  }
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.8rem;
  min-height: 26px;
  padding: 0 0.7rem;
  border-bottom: 1px solid var(--os-border);
  background: var(--os-titlebar);
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

const WindowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
  font-size: 0.88rem;
  font-weight: 900;
`;

const TrafficLights = styled.div`
  display: flex;
  align-items: center;
  gap: 0.42rem;

  button {
    position: relative;
    display: grid;
    place-items: center;
    width: 13px;
    height: 13px;
    border: 0;
    border-radius: 999px;
    color: rgba(0, 0, 0, 0.58);
    font-size: 0;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
    cursor: pointer;
    padding: 0;

    &::before {
      opacity: 0;
      font-size: 8px;
      font-weight: 900;
      line-height: 1;
      transition: opacity 120ms ease;
    }
  }

  &:hover button::before,
  button:focus-visible::before {
    opacity: 1;
  }

  button:nth-child(1) {
    background: var(--os-danger);

    &::before {
      content: 'x';
    }
  }

  button:nth-child(2) {
    background: var(--os-warning);

    &::before {
      content: '-';
    }
  }

  button:nth-child(3) {
    background: var(--os-success);

    &::before {
      content: '+';
    }
  }
`;

const WindowBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  padding: 0;

  > * {
    width: 100%;
  }
`;

const ResizeHandle = styled.button<{ $edge: ResizeEdge }>`
  position: absolute;
  z-index: 2;
  border: 0;
  background: transparent;
  padding: 0;
  pointer-events: auto;

  ${({ $edge }) => {
    if ($edge === 'right') return 'top: 14px; right: -3px; width: 8px; bottom: 14px; cursor: ew-resize;';
    if ($edge === 'left') return 'top: 14px; left: -3px; width: 8px; bottom: 14px; cursor: ew-resize;';
    if ($edge === 'bottom') return 'left: 14px; right: 14px; bottom: 0; height: 3px; cursor: ns-resize;';
    if ($edge === 'top') return 'left: 14px; right: 14px; top: 0; height: 3px; cursor: ns-resize;';
    if ($edge === 'topRight') return 'top: -4px; right: -4px; width: 16px; height: 16px; cursor: nesw-resize;';
    if ($edge === 'bottomRight') return 'right: -4px; bottom: -4px; width: 16px; height: 16px; cursor: nwse-resize;';
    if ($edge === 'bottomLeft') return 'left: -4px; bottom: -4px; width: 16px; height: 16px; cursor: nesw-resize;';
    return 'left: -4px; top: -4px; width: 16px; height: 16px; cursor: nwse-resize;';
  }}

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const DockShell = styled.nav`
  position: fixed;
  left: 50%;
  bottom: 16px;
  z-index: 5000;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.45rem;
  max-width: calc(100vw - 24px);
  padding: 0.55rem;
  border: 1px solid var(--os-border);
  border-radius: 18px;
  background: color-mix(in srgb, var(--os-panel-solid) 72%, transparent);
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.22);
`;

const DockButton = styled(motion.button)<{ $active: boolean; $minimized: boolean }>`
  position: relative;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--os-accent)' : 'var(--os-border)')};
  border-radius: 12px;
  background: ${({ $active }) => ($active ? 'linear-gradient(145deg, var(--os-accent), var(--os-accent-2))' : 'var(--os-panel)')};
  color: ${({ $active }) => ($active ? 'var(--os-accent-text)' : 'var(--os-text)')};
  cursor: pointer;
  opacity: ${({ $minimized }) => ($minimized ? 0.66 : 1)};

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -8px;
    width: ${({ $active, $minimized }) => ($active || $minimized ? '6px' : '0')};
    height: 6px;
    border-radius: 999px;
    transform: translateX(-50%);
    background: ${({ $minimized }) => ($minimized ? 'var(--os-warning)' : 'var(--os-accent)')};
    transition: width 180ms ease;
  }
`;

const ContextMenuShell = styled(motion.div)`
  position: fixed;
  z-index: 7200;
  width: 220px;
  border: 1px solid var(--os-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--os-panel-solid) 88%, transparent);
  color: var(--os-text);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
  padding: 0.35rem;
`;

const ContextMenuButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  min-height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--os-text);
  padding: 0 0.65rem;
  text-align: left;
  cursor: pointer;
  font-weight: 750;

  &:hover,
  &:focus-visible {
    background: var(--os-panel-soft);
  }

  span:last-child {
    color: var(--os-muted);
    font-size: 0.72rem;
  }
`;

const ContextDivider = styled.div`
  height: 1px;
  background: var(--os-border);
  margin: 0.3rem 0;
`;

const PaletteBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 7000;
  display: grid;
  place-items: start center;
  padding-top: 12vh;
  background: rgba(0, 0, 0, 0.32);
`;

const PalettePanel = styled(motion.div)`
  width: min(92vw, 560px);
  border: 1px solid var(--os-border);
  border-radius: 12px;
  background: var(--os-panel-solid);
  color: var(--os-text);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.36);
  overflow: hidden;
`;

const PaletteInput = styled.input`
  width: 100%;
  min-height: 56px;
  border: 0;
  border-bottom: 1px solid var(--os-border);
  outline: 0;
  background: transparent;
  color: var(--os-text);
  padding: 0 1rem;
  font: inherit;
  font-weight: 800;
`;

const PaletteList = styled.div`
  padding: 0.45rem;
`;

const PaletteItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 46px;
  border: 0;
  border-radius: 8px;
  background: ${({ $selected }) => ($selected ? 'var(--os-panel-soft)' : 'transparent')};
  color: var(--os-text);
  padding: 0 0.75rem;
  text-align: left;
  cursor: pointer;
`;

const PaletteCopy = styled.div`
  display: grid;
  gap: 0.12rem;
  min-width: 0;
`;

const PaletteLabel = styled.span`
  font-weight: 900;
`;

const PaletteSummary = styled.span`
  color: var(--os-muted);
  font-size: 0.78rem;
  font-weight: 700;
`;

const PaletteShortcut = styled.span`
  margin-left: auto;
  border: 1px solid var(--os-border);
  border-radius: 7px;
  color: var(--os-muted);
  padding: 0.15rem 0.42rem;
  font-size: 0.72rem;
  font-weight: 900;
`;

const PaletteEmpty = styled.div`
  padding: 1rem;
  color: var(--os-muted);
  font-weight: 700;
`;

const MissionBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 6900;
  display: grid;
  place-items: center;
  padding: 1rem;
  background:
    radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--os-accent) 16%, transparent), transparent 30rem),
    rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(10px);
`;

const MissionPanel = styled(motion.div)`
  width: min(94vw, 920px);
  max-height: min(82vh, 720px);
  overflow: auto;
  border: 1px solid var(--os-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--os-panel-solid) 88%, transparent);
  color: var(--os-text);
  box-shadow: 0 34px 110px rgba(0, 0, 0, 0.42);
`;

const MissionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--os-border);

  h2 {
    margin: 0;
    font-size: clamp(1.4rem, 3vw, 2rem);
    line-height: 1;
  }

  p {
    margin: 0.35rem 0 0;
    color: var(--os-muted);
    font-weight: 700;
  }
`;

const MissionActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const MissionButton = styled.button`
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
  font-weight: 900;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: color-mix(in srgb, var(--os-accent) 52%, var(--os-border));
  }
`;

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.85rem;
  padding: 1rem;
`;

const MissionCard = styled.button<{ $open: boolean; $active: boolean }>`
  min-height: 154px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--os-accent)' : 'var(--os-border)')};
  border-radius: 10px;
  background:
    linear-gradient(135deg, ${({ $open }) => ($open ? 'color-mix(in srgb, var(--os-accent) 14%, transparent)' : 'transparent')}, transparent 56%),
    var(--os-panel-soft);
  color: var(--os-text);
  padding: 0;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  box-shadow: ${({ $active }) => ($active ? '0 0 34px color-mix(in srgb, var(--os-accent) 18%, transparent)' : 'none')};
`;

const MissionMiniBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 28px;
  padding: 0 0.65rem;
  border-bottom: 1px solid var(--os-border);
  background: var(--os-titlebar);

  span {
    width: 8px;
    height: 8px;
    border-radius: 999px;
  }

  span:nth-child(1) {
    background: var(--os-danger);
  }

  span:nth-child(2) {
    background: var(--os-warning);
  }

  span:nth-child(3) {
    background: var(--os-success);
  }
`;

const MissionCardBody = styled.div`
  display: grid;
  gap: 0.55rem;
  padding: 0.8rem;
`;

const MissionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1rem;
  font-weight: 950;
`;

const MissionSummary = styled.div`
  color: var(--os-muted);
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.45;
`;

const MissionStatus = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const MissionChip = styled.span`
  border: 1px solid var(--os-border);
  border-radius: 999px;
  color: var(--os-muted);
  padding: 0.2rem 0.45rem;
  font-size: 0.68rem;
  font-weight: 900;
`;

const BootWrap = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 8000;
  display: grid;
  place-items: center;
  background: #050a10;
  color: #dff7ff;
`;

const BootPanel = styled.div`
  width: min(86vw, 520px);
  border: 1px solid rgba(118, 228, 247, 0.2);
  border-radius: 12px;
  background:
    linear-gradient(135deg, rgba(118, 228, 247, 0.08), transparent),
    rgba(255, 255, 255, 0.04);
  padding: 1.5rem;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5);
`;

const BootLine = styled.div`
  margin: 0.55rem 0;
`;

const BootBrand = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #ffffff;
  font-weight: 800;
`;

const BootProgress = styled.div`
  height: 8px;
  margin-top: 1.1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

const BootProgressFill = styled(motion.div)`
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #76e4f7, #9cffbd);
`;

const AppContent: React.FC<{
  id: OSAppId;
  mode: OSTheme;
  onOpenApp: (id: OSAppId) => void;
  onSetTheme: (mode: OSTheme) => void;
  onSystemAction: (action: OSSystemAction) => void;
}> = ({ id, mode, onOpenApp, onSetTheme, onSystemAction }) => {
  switch (id) {
    case 'about':
      return <AboutApp />;
    case 'projects':
      return <ProjectsApp />;
    case 'skills':
      return <SkillsTerminalApp mode={mode} onOpenApp={onOpenApp} onSetTheme={onSetTheme} onSystemAction={onSystemAction} />;
    case 'contact':
      return <ContactMailApp />;
    case 'now':
      return <NowPlayingApp />;
    case 'resume':
      return <ResumeApp />;
    default:
      return null;
  }
};

const getInitialWindows = (): Record<OSAppId, WindowState> =>
  osApps.reduce((acc, app, index) => {
    acc[app.id] = {
      id: app.id,
      isOpen: app.id === 'about' || app.id === 'projects',
      isMinimized: false,
      isMaximized: false,
      zIndex: 10 + index,
      x: app.defaultPosition.x,
      y: app.defaultPosition.y,
      width: app.defaultSize.width,
      height: app.defaultSize.height,
    };
    return acc;
  }, {} as Record<OSAppId, WindowState>);

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target.isContentEditable;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

const DesktopWidgets: React.FC<{ openCount: number; reducedMotion: boolean }> = ({ openCount, reducedMotion }) => (
  <DesktopWidgetRail aria-label="Mini OS desktop widgets">
    <DesktopWidget
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.18 }}
    >
      <WidgetKicker>Session</WidgetKicker>
      <WidgetTitle>Interactive portfolio workspace</WidgetTitle>
      <WidgetMeta>
        <TinyChip>
          <IconWrapper icon={FaKeyboard} />
          Cmd/Ctrl K
        </TinyChip>
        <TinyChip>{openCount} windows open</TinyChip>
      </WidgetMeta>
    </DesktopWidget>
    <DesktopWidget
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.25 }}
    >
      <WidgetKicker>Focus</WidgetKicker>
      <FocusList>
        <FocusItem>
          <span>Primary stack</span>
          <span>React + TS</span>
        </FocusItem>
        <FocusItem>
          <span>Interaction layer</span>
          <span>Motion + 3D</span>
        </FocusItem>
        <FocusItem>
          <span>Mode</span>
          <span>Portfolio OS</span>
        </FocusItem>
      </FocusList>
    </DesktopWidget>
  </DesktopWidgetRail>
);

const AmbientSignals: React.FC<{ openCount: number; reducedMotion: boolean }> = ({ openCount, reducedMotion }) => (
  <SignalStrip aria-hidden="true">
    {['taste engine online', `${openCount} windows live`, 'terminal drives UI'].map((label, index) => (
      <SignalToken
        key={label}
        initial={reducedMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.2 + index * 0.08 }}
      >
        {label}
      </SignalToken>
    ))}
  </SignalStrip>
);

const TopBar: React.FC<{
  mode: OSTheme;
  time: string;
  openCount: number;
  onToggleTheme: () => void;
  onOpenPalette: () => void;
  onOpenMission: () => void;
}> = ({ mode, time, openCount, onToggleTheme, onOpenPalette, onOpenMission }) => (
  <TopBarShell>
    <TopCluster>
      <OSTitle href={portfolioPath()}>Portfolio OS</OSTitle>
      <StatusText>{time}</StatusText>
    </TopCluster>
    <TopCluster>
      <StatusPill>
        <IconWrapper icon={FaWifi} />
        Online
      </StatusPill>
      <StatusPill>
        <IconWrapper icon={FaCodeBranch} />
        {openCount} open
      </StatusPill>
      <StatusText>Cmd/Ctrl K</StatusText>
      <IconButton type="button" onClick={onOpenMission} aria-label="Open Mission Control">
        <IconWrapper icon={FaThLarge} />
      </IconButton>
      <IconButton type="button" onClick={onOpenPalette} aria-label="Open command palette">
        <IconWrapper icon={FaSearch} />
      </IconButton>
      <IconButton type="button" onClick={onToggleTheme} aria-label="Toggle OS theme">
        <IconWrapper icon={mode === 'dark' ? FaSun : FaMoon} />
      </IconButton>
      <IconButton as="a" href={portfolioPath('impressum')} aria-label="Open legal information">
        §
      </IconButton>
      <IconButton as="a" href={portfolioPath()} aria-label="Exit Mini OS">
        <IconWrapper icon={FaPowerOff} />
      </IconButton>
    </TopCluster>
  </TopBarShell>
);

const BootScreen: React.FC<{ reducedMotion: boolean; onDone: () => void }> = ({ reducedMotion, onDone }) => {
  const [step, setStep] = useState(0);
  const lines = ['Booting Portfolio OS...', 'Loading projects...', 'Mounting creativity...', 'Welcome'];

  useEffect(() => {
    if (reducedMotion) {
      const doneTimer = window.setTimeout(onDone, 250);
      return () => window.clearTimeout(doneTimer);
    }
    if (step >= lines.length - 1) {
      const doneTimer = window.setTimeout(onDone, 650);
      return () => window.clearTimeout(doneTimer);
    }
    const timer = window.setTimeout(() => setStep((value) => value + 1), 620);
    return () => window.clearTimeout(timer);
  }, [lines.length, onDone, reducedMotion, step]);

  return (
    <BootWrap exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      <BootPanel>
        <BootBrand>
          <span>Portfolio OS</span>
          <span>{Math.round(((step + 1) / lines.length) * 100)}%</span>
        </BootBrand>
        {lines.slice(0, step + 1).map((line) => (
          <BootLine key={line}>{line}</BootLine>
        ))}
        <BootProgress aria-hidden="true">
          <BootProgressFill
            initial={{ width: '12%' }}
            animate={{ width: `${((step + 1) / lines.length) * 100}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </BootProgress>
      </BootPanel>
    </BootWrap>
  );
};

const OSWindow: React.FC<{
  app: OSAppConfig;
  state: WindowState;
  mode: OSTheme;
  onFocus: (id: OSAppId) => void;
  onClose: (id: OSAppId) => void;
  onMinimize: (id: OSAppId) => void;
  onMaximize: (id: OSAppId) => void;
  onBeginMove: (id: OSAppId, event: React.PointerEvent<HTMLElement>) => void;
  onBeginResize: (id: OSAppId, edge: ResizeEdge, event: React.PointerEvent<HTMLElement>) => void;
  onOpenApp: (id: OSAppId) => void;
  onSetTheme: (mode: OSTheme) => void;
  onSystemAction: (action: OSSystemAction) => void;
  isActive: boolean;
  reducedMotion: boolean;
}> = ({
  app,
  state,
  mode,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onBeginMove,
  onBeginResize,
  onOpenApp,
  onSetTheme,
  onSystemAction,
  isActive,
  reducedMotion,
}) => {
  if (!state.isOpen || state.isMinimized) return null;

  return (
    <WindowShell
      $zIndex={state.zIndex}
      $maximized={state.isMaximized}
      $active={isActive}
      onMouseDown={() => onFocus(app.id)}
      style={{
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
      }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 14 }}
      transition={{ duration: 0.18 }}
    >
      <TitleBar
        onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
          if (!state.isMaximized) onBeginMove(app.id, event);
        }}
        onDoubleClick={() => onMaximize(app.id)}
      >
        <TrafficLights onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => event.stopPropagation()}>
          <button type="button" aria-label={`Close ${app.title}`} onClick={() => onClose(app.id)} />
          <button type="button" aria-label={`Minimize ${app.title}`} onClick={() => onMinimize(app.id)} />
          <button type="button" aria-label={`${state.isMaximized ? 'Restore' : 'Fullscreen'} ${app.title}`} onClick={() => onMaximize(app.id)} />
        </TrafficLights>
        <WindowTitle>
          <IconWrapper icon={app.icon} />
          {app.title}
        </WindowTitle>
      </TitleBar>
      <WindowBody>
        <AppContent id={app.id} mode={mode} onOpenApp={onOpenApp} onSetTheme={onSetTheme} onSystemAction={onSystemAction} />
      </WindowBody>
      {!state.isMaximized &&
        (['top', 'right', 'bottom', 'left', 'topRight', 'bottomRight', 'bottomLeft', 'topLeft'] as ResizeEdge[]).map((edge) => (
          <ResizeHandle
            key={edge}
            type="button"
            $edge={edge}
            aria-label={`Resize ${app.title} from ${edge}`}
            onPointerDown={(event: React.PointerEvent<HTMLButtonElement>) => onBeginResize(app.id, edge, event)}
          />
        ))}
    </WindowShell>
  );
};

const Dock: React.FC<{
  windows: Record<OSAppId, WindowState>;
  onOpen: (id: OSAppId) => void;
}> = ({ windows, onOpen }) => (
  <DockShell aria-label="Mini OS dock">
    {osApps.map((app) => (
      <DockButton
        key={app.id}
        type="button"
        $active={windows[app.id].isOpen && !windows[app.id].isMinimized}
        $minimized={windows[app.id].isOpen && windows[app.id].isMinimized}
        onClick={() => onOpen(app.id)}
        whileHover={{ y: -5, scale: 1.06 }}
        aria-label={`Open ${app.label}`}
        title={app.label}
      >
        <IconWrapper icon={app.icon} />
      </DockButton>
    ))}
  </DockShell>
);

const DesktopContextMenu: React.FC<{
  menu: ContextMenuState | null;
  onClose: () => void;
  onOpenPalette: () => void;
  onOpenMission: () => void;
  onOpenAll: () => void;
  onArrange: () => void;
  onToggleTheme: () => void;
  onCloseAll: () => void;
}> = ({ menu, onClose, onOpenPalette, onOpenMission, onOpenAll, onArrange, onToggleTheme, onCloseAll }) => (
  <AnimatePresence>
    {menu && (
      <ContextMenuShell
        style={{ left: menu.x, top: menu.y }}
        initial={{ opacity: 0, scale: 0.96, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -4 }}
        transition={{ duration: 0.12 }}
        role="menu"
        onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}
      >
        <ContextMenuButton
          type="button"
          role="menuitem"
          onClick={() => {
            onOpenPalette();
            onClose();
          }}
        >
          <span>Command Palette</span>
          <span>Ctrl K</span>
        </ContextMenuButton>
        <ContextMenuButton
          type="button"
          role="menuitem"
          onClick={() => {
            onOpenMission();
            onClose();
          }}
        >
          <span>Mission Control</span>
          <span>view</span>
        </ContextMenuButton>
        <ContextMenuButton
          type="button"
          role="menuitem"
          onClick={() => {
            onOpenAll();
            onClose();
          }}
        >
          <span>Open All Apps</span>
          <span>system</span>
        </ContextMenuButton>
        <ContextMenuButton
          type="button"
          role="menuitem"
          onClick={() => {
            onArrange();
            onClose();
          }}
        >
          <span>Arrange Windows</span>
          <span>grid</span>
        </ContextMenuButton>
        <ContextDivider />
        <ContextMenuButton
          type="button"
          role="menuitem"
          onClick={() => {
            onToggleTheme();
            onClose();
          }}
        >
          <span>Toggle Theme</span>
          <span>display</span>
        </ContextMenuButton>
        <ContextMenuButton
          type="button"
          role="menuitem"
          onClick={() => {
            onCloseAll();
            onClose();
          }}
        >
          <span>Close All Windows</span>
          <span>clean</span>
        </ContextMenuButton>
      </ContextMenuShell>
    )}
  </AnimatePresence>
);

const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: OSAppId) => void;
}> = ({ isOpen, onClose, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(
    () => osApps.filter((app) => `${app.label} ${app.title}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const openSelected = () => {
    const app = results[selectedIndex];
    if (!app) return;
    onOpenApp(app.id);
    onClose();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((index) => Math.min(index + 1, results.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      openSelected();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <PaletteBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <PalettePanel
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mini OS command palette"
          >
            <PaletteInput
              ref={inputRef}
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Open an app..."
              aria-label="Search apps"
            />
            <PaletteList>
              {results.map((app, index) => (
                <PaletteItem
                  key={app.id}
                  type="button"
                  $selected={index === selectedIndex}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    onOpenApp(app.id);
                    onClose();
                  }}
                >
                  <IconWrapper icon={app.icon} />
                  <PaletteCopy>
                    <PaletteLabel>{app.label}</PaletteLabel>
                    <PaletteSummary>{app.summary}</PaletteSummary>
                  </PaletteCopy>
                  <PaletteShortcut>{app.shortcut}</PaletteShortcut>
                </PaletteItem>
              ))}
              {results.length === 0 && <PaletteEmpty>No apps found.</PaletteEmpty>}
            </PaletteList>
          </PalettePanel>
        </PaletteBackdrop>
      )}
    </AnimatePresence>
  );
};

const MissionControl: React.FC<{
  isOpen: boolean;
  windows: Record<OSAppId, WindowState>;
  activeZIndex: number;
  onClose: () => void;
  onOpenApp: (id: OSAppId) => void;
  onArrange: () => void;
  onOpenAll: () => void;
  onCloseAll: () => void;
}> = ({ isOpen, windows, activeZIndex, onClose, onOpenApp, onArrange, onOpenAll, onCloseAll }) => (
  <AnimatePresence>
    {isOpen && (
      <MissionBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
        <MissionPanel
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mini OS Mission Control"
          onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}
        >
          <MissionHeader>
            <div>
              <h2>Mission Control</h2>
              <p>Launch, focus, and compose the portfolio workspace from one tactical view.</p>
            </div>
            <MissionActions>
              <MissionButton type="button" onClick={onArrange}>
                <IconWrapper icon={FaThLarge} />
                Tile
              </MissionButton>
              <MissionButton type="button" onClick={onOpenAll}>
                <IconWrapper icon={FaMagic} />
                Ignite
              </MissionButton>
              <MissionButton type="button" onClick={onCloseAll}>Clear</MissionButton>
            </MissionActions>
          </MissionHeader>
          <MissionGrid>
            {osApps.map((app) => {
              const state = windows[app.id];
              const isActive = state.isOpen && !state.isMinimized && state.zIndex === activeZIndex;
              return (
                <MissionCard
                  key={app.id}
                  type="button"
                  $open={state.isOpen}
                  $active={isActive}
                  onClick={() => {
                    onOpenApp(app.id);
                    onClose();
                  }}
                >
                  <MissionMiniBar aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </MissionMiniBar>
                  <MissionCardBody>
                    <MissionTitle>
                      <IconWrapper icon={app.icon} />
                      {app.label}
                    </MissionTitle>
                    <MissionSummary>{app.summary}</MissionSummary>
                    <MissionStatus>
                      <MissionChip>{state.isOpen ? (state.isMinimized ? 'minimized' : 'open') : 'closed'}</MissionChip>
                      {isActive && <MissionChip>active</MissionChip>}
                      <MissionChip>{app.shortcut}</MissionChip>
                    </MissionStatus>
                  </MissionCardBody>
                </MissionCard>
              );
            })}
          </MissionGrid>
        </MissionPanel>
      </MissionBackdrop>
    )}
  </AnimatePresence>
);

const MiniOSPage: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [booting, setBooting] = useState(true);
  const [mode, setMode] = useState<OSTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('portfolio-os-theme') === 'light' ? 'light' : 'dark';
  });
  const [time, setTime] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [missionOpen, setMissionOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [windows, setWindows] = useState<Record<OSAppId, WindowState>>(getInitialWindows);
  const zIndexRef = useRef(40);
  const gestureRef = useRef<{
    type: 'move' | 'resize';
    id: OSAppId;
    edge?: ResizeEdge;
    startX: number;
    startY: number;
    original: Pick<WindowState, 'x' | 'y' | 'width' | 'height'>;
  } | null>(null);
  const visibleWindows = osApps.filter((app) => windows[app.id].isOpen && !windows[app.id].isMinimized);
  const openCount = visibleWindows.length;
  const activeZIndex = visibleWindows.length > 0 ? Math.max(...visibleWindows.map((app) => windows[app.id].zIndex)) : 0;

  useEffect(() => {
    window.localStorage.setItem('portfolio-os-theme', mode);
  }, [mode]);

  useEffect(() => {
    const update = () =>
      setTime(new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.key === 'Escape') setContextMenu(null);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        setMissionOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('mousedown', closeMenu);
    window.addEventListener('resize', closeMenu);
    return () => {
      window.removeEventListener('mousedown', closeMenu);
      window.removeEventListener('resize', closeMenu);
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const gesture = gestureRef.current;
      if (!gesture) return;

      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      const minWidth = 320;
      const minHeight = 190;

      setWindows((items) => {
        const current = items[gesture.id];
        if (!current || current.isMaximized) return items;
        const next = { ...current };

        if (gesture.type === 'move') {
          next.x = clamp(gesture.original.x + dx, 6, window.innerWidth - Math.min(220, gesture.original.width));
          next.y = clamp(gesture.original.y + dy, 0, window.innerHeight - 92);
        } else {
          const edge = gesture.edge || 'bottomRight';
          const edgeName = edge.toLowerCase();
          let x = gesture.original.x;
          let y = gesture.original.y;
          let width = gesture.original.width;
          let height = gesture.original.height;

          if (edgeName.includes('right')) {
            width = clamp(gesture.original.width + dx, minWidth, window.innerWidth - gesture.original.x - 12);
          }

          if (edgeName.includes('left')) {
            const proposedWidth = clamp(gesture.original.width - dx, minWidth, gesture.original.x + gesture.original.width - 6);
            x = gesture.original.x + (gesture.original.width - proposedWidth);
            width = proposedWidth;
          }

          if (edgeName.includes('bottom')) {
            height = clamp(gesture.original.height + dy, minHeight, window.innerHeight - gesture.original.y - 44);
          }

          if (edgeName.includes('top')) {
            const proposedHeight = clamp(gesture.original.height - dy, minHeight, gesture.original.y + gesture.original.height - 4);
            y = gesture.original.y + (gesture.original.height - proposedHeight);
            height = proposedHeight;
          }

          next.x = x;
          next.y = y;
          next.width = width;
          next.height = height;
        }

        return {
          ...items,
          [gesture.id]: next,
        };
      });
    };

    const onPointerUp = () => {
      gestureRef.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  const focusApp = (id: OSAppId) => {
    zIndexRef.current += 1;
    setWindows((items) => ({
      ...items,
      [id]: { ...items[id], zIndex: zIndexRef.current },
    }));
  };

  const openApp = (id: OSAppId) => {
    zIndexRef.current += 1;
    setWindows((items) => ({
      ...items,
      [id]: { ...items[id], isOpen: true, isMinimized: false, zIndex: zIndexRef.current },
    }));
  };

  const closeApp = (id: OSAppId) => {
    setWindows((items) => ({
      ...items,
      [id]: { ...items[id], isOpen: false, isMinimized: false, isMaximized: false },
    }));
  };

  const minimizeApp = (id: OSAppId) => {
    setWindows((items) => ({
      ...items,
      [id]: { ...items[id], isMinimized: true },
    }));
  };

  const maximizeApp = (id: OSAppId) => {
    focusApp(id);
    setWindows((items) => ({
      ...items,
      [id]: { ...items[id], isMaximized: !items[id].isMaximized },
    }));
  };

  const toggleTheme = () => setMode((value) => (value === 'dark' ? 'light' : 'dark'));

  const openAllApps = () => {
    setWindows((items) => {
      const next = { ...items };
      osApps.forEach((app, index) => {
        next[app.id] = {
          ...next[app.id],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x: 130 + index * 34,
          y: index * 16,
          zIndex: zIndexRef.current + index + 1,
        };
      });
      zIndexRef.current += osApps.length;
      return next;
    });
  };

  const demoWorkspace = () => {
    setWindows((items) => {
      const next = { ...items };
      const demoLayout: Array<{ id: OSAppId; x: number; y: number; width: number; height: number }> = [
        { id: 'projects', x: 118, y: 0, width: 680, height: 380 },
        { id: 'skills', x: 460, y: 96, width: 660, height: 420 },
        { id: 'contact', x: 250, y: 144, width: 540, height: 340 },
      ];

      demoLayout.forEach((layout, index) => {
        next[layout.id] = {
          ...next[layout.id],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x: layout.x,
          y: layout.y,
          width: layout.width,
          height: layout.height,
          zIndex: zIndexRef.current + index + 1,
        };
      });

      zIndexRef.current += demoLayout.length;
      return next;
    });
  };

  const closeAllApps = () => {
    setWindows((items) => {
      const next = { ...items };
      osApps.forEach((app) => {
        next[app.id] = { ...next[app.id], isOpen: false, isMinimized: false, isMaximized: false };
      });
      return next;
    });
  };

  const arrangeWindows = () => {
    const visible = osApps.filter((app) => windows[app.id].isOpen);
    if (visible.length === 0) return;
    const columns = window.innerWidth > 1180 ? 3 : 2;
    const gap = 12;
    const availableWidth = Math.max(360, window.innerWidth - 48);
    const tileWidth = Math.floor((availableWidth - gap * (columns - 1)) / columns);
    const tileHeight = Math.max(220, Math.floor((window.innerHeight - 68) / Math.ceil(visible.length / columns)) - gap);

    setWindows((items) => {
      const next = { ...items };
      visible.forEach((app, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        next[app.id] = {
          ...next[app.id],
          isMinimized: false,
          isMaximized: false,
          x: 12 + column * (tileWidth + gap),
          y: row * (tileHeight + gap),
          width: tileWidth,
          height: tileHeight,
        };
      });
      return next;
    });
  };

  const runSystemAction = (action: OSSystemAction) => {
    if (action === 'mission') {
      setMissionOpen(true);
      return;
    }
    if (action === 'arrange') {
      arrangeWindows();
      return;
    }
    if (action === 'open-all') {
      openAllApps();
      return;
    }
    if (action === 'close-all') {
      closeAllApps();
      return;
    }
    demoWorkspace();
  };

  const beginMove = (id: OSAppId, event: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    event.preventDefault();
    focusApp(id);
    const current = windows[id];
    gestureRef.current = {
      type: 'move',
      id,
      startX: event.clientX,
      startY: event.clientY,
      original: {
        x: current.x,
        y: current.y,
        width: current.width,
        height: current.height,
      },
    };
  };

  const beginResize = (id: OSAppId, edge: ResizeEdge, event: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    event.preventDefault();
    event.stopPropagation();
    focusApp(id);
    const current = windows[id];
    gestureRef.current = {
      type: 'resize',
      id,
      edge,
      startX: event.clientX,
      startY: event.clientY,
      original: {
        x: current.x,
        y: current.y,
        width: current.width,
        height: current.height,
      },
    };
  };

  return (
    <OSRoot
      $mode={mode}
      onPointerMove={(event: React.PointerEvent<HTMLDivElement>) => {
        event.currentTarget.style.setProperty('--pointer-x', `${event.clientX}px`);
        event.currentTarget.style.setProperty('--pointer-y', `${event.clientY}px`);
      }}
    >
      <TopBar
        mode={mode}
        time={time}
        openCount={openCount}
        onToggleTheme={toggleTheme}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenMission={() => setMissionOpen(true)}
      />
      <Desktop
        onContextMenu={(event: React.MouseEvent<HTMLDivElement>) => {
          event.preventDefault();
          setContextMenu({
            x: clamp(event.clientX, 8, window.innerWidth - 232),
            y: clamp(event.clientY, 48, window.innerHeight - 238),
          });
        }}
      >
        <AmbientSignals openCount={openCount} reducedMotion={reducedMotion} />
        <DesktopIcons aria-label="Mini OS desktop apps">
          {osApps.map((app) => (
            <DesktopIconButton key={app.id} type="button" onClick={() => openApp(app.id)}>
              <span>
                <IconWrapper icon={app.icon} />
              </span>
              <span>{app.label}</span>
            </DesktopIconButton>
          ))}
        </DesktopIcons>
        <DesktopWidgets openCount={openCount} reducedMotion={reducedMotion} />
        <WindowLayer>
          <AnimatePresence>
            {osApps.map((app) => (
              <OSWindow
                key={app.id}
                app={app}
                state={windows[app.id]}
                mode={mode}
                onFocus={focusApp}
                onClose={closeApp}
                onMinimize={minimizeApp}
                onMaximize={maximizeApp}
                onBeginMove={beginMove}
                onBeginResize={beginResize}
                onOpenApp={openApp}
                onSetTheme={setMode}
                onSystemAction={runSystemAction}
                isActive={windows[app.id].zIndex === activeZIndex}
                reducedMotion={reducedMotion}
              />
            ))}
          </AnimatePresence>
        </WindowLayer>
      </Desktop>
      <Dock windows={windows} onOpen={openApp} />
      <DesktopContextMenu
        menu={contextMenu}
        onClose={() => setContextMenu(null)}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenMission={() => setMissionOpen(true)}
        onOpenAll={openAllApps}
        onArrange={arrangeWindows}
        onToggleTheme={toggleTheme}
        onCloseAll={closeAllApps}
      />
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} onOpenApp={openApp} />
      <MissionControl
        isOpen={missionOpen}
        windows={windows}
        activeZIndex={activeZIndex}
        onClose={() => setMissionOpen(false)}
        onOpenApp={openApp}
        onArrange={arrangeWindows}
        onOpenAll={openAllApps}
        onCloseAll={closeAllApps}
      />
      <AnimatePresence>
        {booting && <BootScreen reducedMotion={reducedMotion} onDone={() => setBooting(false)} />}
      </AnimatePresence>
    </OSRoot>
  );
};

export default MiniOSPage;
