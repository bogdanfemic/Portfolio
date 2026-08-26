import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { portfolioPath } from '../../config/siteConfig';

type Command = {
  id: string;
  label: string;
  keywords?: string;
  run: () => void;
};

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  padding: 12vh 16px 16px;
  z-index: 2000;
`;

const Palette = styled.div`
  width: min(680px, 100%);
  border-radius: 14px;
  background: var(--background-color);
  color: var(--text-color);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
  border: 1px solid var(--medium-gray);
  overflow: hidden;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 14px;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 1rem;

  &:focus {
    outline: none;
  }
`;

const List = styled.div`
  border-top: 1px solid var(--medium-gray);
  max-height: 320px;
  overflow: auto;
`;

const Item = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  background: ${({ $active }) => ($active ? 'var(--light-gray)' : 'transparent')};
  color: inherit;
  border: 0;

  &:hover {
    background: var(--light-gray);
  }
`;

const Hint = styled.span`
  color: var(--dark-gray);
  font-size: 0.85rem;
  white-space: nowrap;
`;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      { id: 'home', label: 'Go to Home', keywords: 'top', run: () => scrollToId('home') },
      { id: 'about', label: 'Go to About', run: () => scrollToId('about') },
      { id: 'projects', label: 'Go to Projects', run: () => scrollToId('projects') },
      { id: 'skills', label: 'Go to Skills', run: () => scrollToId('skills') },
      { id: 'future-goals', label: 'Go to Future Goals', keywords: 'roadmap ambitions next', run: () => scrollToId('future-goals') },
      { id: 'threejs-game', label: 'Go to 3D Game', keywords: 'three webgl', run: () => scrollToId('threejs-game') },
      { id: 'contact', label: 'Go to Contact', run: () => scrollToId('contact') },
      { id: 'mini-os', label: 'Open Mini OS', keywords: 'desktop terminal', run: () => window.location.assign(portfolioPath('os')) },
      { id: 'impressum', label: 'Open Impressum', keywords: 'legal ddg', run: () => window.location.assign(portfolioPath('impressum')) },
      { id: 'privacy', label: 'Open Privacy Notice', keywords: 'datenschutz gdpr', run: () => window.location.assign(portfolioPath('datenschutz')) },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(c => `${c.label} ${c.keywords ?? ''}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k';
      const isSlash = e.key === '/';
      const wantsOpen = (isK && (e.metaKey || e.ctrlKey)) || (isSlash && !e.metaKey && !e.ctrlKey && !e.altKey);
      if (wantsOpen) {
        // Avoid hijacking typing in inputs
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || (target as any)?.isContentEditable) return;
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, []);

  useEffect(() => {
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('command-palette:open', onOpenEvent as EventListener);
    return () => window.removeEventListener('command-palette:open', onOpenEvent as EventListener);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    setQuery('');
    setActiveIndex(0);
    inputRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runActive = () => {
    const cmd = filtered[activeIndex];
    if (!cmd) return;
    cmd.run();
    setOpen(false);
  };

  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !paletteRef.current) return;
    const focusable = Array.from(
      paletteRef.current.querySelectorAll<HTMLElement>('input, button:not([disabled])')
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <Backdrop
      $open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={() => setOpen(false)}
    >
      <Palette ref={paletteRef} onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} onKeyDown={trapFocus}>
        <Input
          ref={inputRef}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Type a command… (Esc to close)"
          aria-label="Search portfolio commands"
          aria-controls="command-results"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              runActive();
            }
          }}
        />
        <List id="command-results" role="listbox" aria-label="Portfolio commands">
          {filtered.map((c, idx) => (
            <Item
              key={c.id}
              $active={idx === activeIndex}
              role="option"
              aria-selected={idx === activeIndex}
              onClick={() => { c.run(); setOpen(false); }}
            >
              <span>{c.label}</span>
              <Hint>{idx === 0 ? 'Enter' : ''}</Hint>
            </Item>
          ))}
          {filtered.length === 0 && (
            <Item as="div" $active={false}>
              <span>No matches</span>
              <Hint>Esc</Hint>
            </Item>
          )}
        </List>
      </Palette>
    </Backdrop>
  );
}
