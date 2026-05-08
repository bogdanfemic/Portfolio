import { GameSnapshot } from './types';

const BEST_SCORE_KEY = 'neon-drift-best-score';

export function readBestScore() {
  const saved = window.localStorage.getItem(BEST_SCORE_KEY);
  return saved ? Number.parseInt(saved, 10) || 0 : 0;
}

export function saveBestScore(score: number) {
  const best = Math.max(score, readBestScore());
  window.localStorage.setItem(BEST_SCORE_KEY, String(best));
  return best;
}

export function createSnapshot(state: GameSnapshot['state'], score: number, speed: number, bestScore: number): GameSnapshot {
  return {
    state,
    score: Math.round(score),
    speed: Math.round(speed * 10) / 10,
    bestScore,
  };
}
