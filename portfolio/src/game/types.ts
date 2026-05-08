export type GameState = 'idle' | 'playing' | 'gameover';

export interface GameSnapshot {
  state: GameState;
  score: number;
  speed: number;
  bestScore: number;
}

export interface Collidable {
  active: boolean;
  x: number;
  y: number;
  z: number;
  radius: number;
}
