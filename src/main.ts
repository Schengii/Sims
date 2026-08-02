import { Game } from './engine/Game';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const uiContainer = document.getElementById('ui-container') as HTMLElement;

  if (canvas && uiContainer) {
    const game = new Game(canvas, uiContainer);
    game.start();
    console.log('[Sims 5 Engine] Game initialized and loop started successfully.');
  }
});
