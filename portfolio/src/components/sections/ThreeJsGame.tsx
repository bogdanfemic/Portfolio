import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Game } from '../../game/Game';
import { GameSnapshot } from '../../game/types';
import { isWebGLAvailable } from '../../utils/webGLUtils';
import '../../styles.css';

const GameSection = styled.section`
  min-height: 100vh;
  background:
    radial-gradient(circle at 18% 20%, rgba(52, 246, 255, 0.14), transparent 30%),
    radial-gradient(circle at 82% 28%, rgba(255, 43, 214, 0.13), transparent 28%),
    #050611;
  padding: 100px 0;
  position: relative;
`;

const GameContainer = styled.div`
  width: min(92%, 1180px);
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  color: #f7fbff;
  font-size: clamp(2.2rem, 5vw, 4.8rem);
  line-height: 0.95;
  margin: 0 0 0.75rem;
  text-align: center;
  text-shadow: 0 0 24px rgba(52, 246, 255, 0.35);
`;

const SectionSubtitle = styled.p`
  color: rgba(225, 239, 255, 0.78);
  font-size: clamp(1rem, 2vw, 1.2rem);
  margin: 0 auto 2rem;
  max-width: 720px;
  text-align: center;
`;

const WebGLError = styled.div`
  border: 1px solid rgba(255, 53, 93, 0.55);
  border-radius: 8px;
  color: #fff;
  padding: 2rem;
  text-align: center;
  background: rgba(255, 53, 93, 0.12);
`;

const initialSnapshot: GameSnapshot = {
  state: 'idle',
  score: 0,
  speed: 0,
  bestScore: 0,
};

const ThreeJsGame: React.FC = () => {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [snapshot, setSnapshot] = useState<GameSnapshot>(initialSnapshot);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    setWebGLAvailable(isWebGLAvailable());
  }, []);

  useEffect(() => {
    if (!webGLAvailable || !canvasRef.current) return undefined;

    try {
      const game = new Game(canvasRef.current, {
        reducedMotion,
        onSnapshot: setSnapshot,
      });
      gameRef.current = game;

      return () => {
        game.dispose();
        gameRef.current = null;
      };
    } catch {
      setWebGLAvailable(false);
      return undefined;
    }
  }, [reducedMotion, webGLAvailable]);

  useEffect(() => {
    gameRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  const handleStart = () => {
    gameRef.current?.start();
  };

  const handleRestart = () => {
    gameRef.current?.restart();
  };

  const toggleFullscreen = async () => {
    if (!shellRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await shellRef.current.requestFullscreen();
  };

  return (
    <GameSection id="threejs-game">
      <GameContainer>
        <SectionTitle>Neon Drift</SectionTitle>
        <SectionSubtitle>Dodge walls. Collect boosts. Drift forever.</SectionSubtitle>

        {!webGLAvailable ? (
          <WebGLError>
            <h3>WebGL Not Available</h3>
            <p>Your browser or device does not support WebGL, which is required to run Neon Drift.</p>
          </WebGLError>
        ) : (
          <div className="neon-drift-shell" ref={shellRef}>
            <div className="neon-drift-canvas" ref={canvasRef} aria-label="Neon Drift Three.js game canvas" />

            <div className="neon-drift-hud" aria-live="polite">
              <span>Score {snapshot.score}</span>
              <span>Speed {snapshot.speed}</span>
              <span>Best {snapshot.bestScore}</span>
            </div>

            <div className="neon-drift-badge">Built with Three.js</div>

            <div className="neon-drift-actions">
              <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
                Fullscreen
              </button>
              <label className="neon-drift-toggle">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(event) => setReducedMotion(event.target.checked)}
                />
                Reduced motion
              </label>
            </div>

            {snapshot.state === 'idle' && (
              <div className="neon-drift-overlay">
                <div className="neon-drift-panel">
                  <p className="neon-drift-kicker">Portfolio Mode</p>
                  <h3>Neon Drift</h3>
                  <p>Dodge walls. Collect boosts. Drift forever.</p>
                  <button type="button" onClick={handleStart}>Start Run</button>
                  <span>A/D or arrows to drift. W/S to rise and dive. Drag on touch screens.</span>
                </div>
              </div>
            )}

            {snapshot.state === 'gameover' && (
              <div className="neon-drift-overlay">
                <div className="neon-drift-panel">
                  <p className="neon-drift-kicker">Run Ended</p>
                  <h3>{snapshot.score}</h3>
                  <p>Best score: {snapshot.bestScore}</p>
                  <button type="button" onClick={handleRestart}>Restart</button>
                </div>
              </div>
            )}
          </div>
        )}
      </GameContainer>
    </GameSection>
  );
};

export default ThreeJsGame;
