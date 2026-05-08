import { NEON_DRIFT_CONFIG } from './config';

export class Input {
  readonly direction = { x: 0, y: 0 };

  private keys = new Set<string>();
  private targetFromPointer: { x: number; y: number } | null = null;
  private element: HTMLElement;
  private active = false;

  constructor(element: HTMLElement) {
    this.element = element;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    element.addEventListener('pointermove', this.handlePointerMove);
    element.addEventListener('pointerleave', this.handlePointerLeave);
    element.addEventListener('touchmove', this.preventTouchScroll, { passive: false });
  }

  update(playerX: number, playerY: number) {
    if (!this.active) {
      this.direction.x = 0;
      this.direction.y = 0;
      return;
    }

    let x = 0;
    let y = 0;

    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y -= 1;

    if (this.targetFromPointer) {
      x += Math.max(-1, Math.min(1, this.targetFromPointer.x - playerX));
      y += Math.max(-1, Math.min(1, this.targetFromPointer.y - playerY));
    }

    const length = Math.hypot(x, y) || 1;
    this.direction.x = x / length;
    this.direction.y = y / length;
  }

  dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.element.removeEventListener('pointermove', this.handlePointerMove);
    this.element.removeEventListener('pointerleave', this.handlePointerLeave);
    this.element.removeEventListener('touchmove', this.preventTouchScroll);
  }

  setActive(active: boolean) {
    this.active = active;
    if (!active) {
      this.keys.clear();
      this.targetFromPointer = null;
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.isControlKey(event.code)) {
      if (this.active) event.preventDefault();
      this.keys.add(event.code);
    }
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (this.isControlKey(event.code)) {
      if (this.active) event.preventDefault();
      this.keys.delete(event.code);
    }
  };

  private handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.buttons === 0) return;

    const rect = this.element.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

    this.targetFromPointer = {
      x: normalizedX * NEON_DRIFT_CONFIG.bounds.x,
      y: normalizedY * NEON_DRIFT_CONFIG.bounds.y,
    };
  };

  private handlePointerLeave = () => {
    this.targetFromPointer = null;
  };

  private preventTouchScroll = (event: TouchEvent) => {
    if (this.active) event.preventDefault();
  };

  private isControlKey(code: string) {
    return ['KeyA', 'KeyD', 'KeyW', 'KeyS', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(code);
  }
}
