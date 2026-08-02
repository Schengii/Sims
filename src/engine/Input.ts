/**
 * Input & Accessibility Controller
 * Manages canvas clicks, mouse drag panning, wheel zooming, and accessible keyboard shortcuts.
 */

import { Camera } from './Camera';
import { IsometricRenderer } from './IsometricRenderer';
import { SoundManager } from '../audio/SoundManager';

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private renderer: IsometricRenderer;
  private soundManager: SoundManager;

  private isDragging: boolean = false;
  private lastMousePos: { x: number; y: number } = { x: 0, y: 0 };

  public onTileClick?: (gridX: number, gridY: number) => void;
  public onKeyboardSpeedToggle?: (speed: number) => void;
  public onKeyboardPauseToggle?: () => void;
  public onEscapePressed?: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    camera: Camera,
    renderer: IsometricRenderer,
    soundManager: SoundManager
  ) {
    this.canvas = canvas;
    this.camera = camera;
    this.renderer = renderer;
    this.soundManager = soundManager;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    // Mouse Move & Hover
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        const dx = mouseX - this.lastMousePos.x;
        const dy = mouseY - this.lastMousePos.y;
        this.camera.pan(dx, dy);
        this.lastMousePos = { x: mouseX, y: mouseY };
      } else {
        const grid = this.renderer.screenToGrid(mouseX, mouseY, this.camera);
        this.renderer.hoverGrid = grid;
      }
    });

    // Mouse Down (Drag start)
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0 || e.button === 1) { // Left or Middle click
        this.isDragging = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastMousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
    });

    // Mouse Up (Click trigger)
    this.canvas.addEventListener('mouseup', (e) => {
      if (this.isDragging) {
        this.isDragging = false;
      }

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const grid = this.renderer.screenToGrid(mouseX, mouseY, this.camera);
      if (grid && this.onTileClick) {
        this.soundManager.playUIClick();
        this.onTileClick(grid.x, grid.y);
      }
    });

    // Wheel Zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.camera.zoomBy(zoomFactor);
    }, { passive: false });

    // Keyboard Shortcuts (WCAG Accessibility & Power Users)
    window.addEventListener('keydown', (e) => {
      // Don't capture inputs if user is typing in form input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.camera.pan(0, 30);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.camera.pan(0, -30);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.camera.pan(30, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.camera.pan(-30, 0);
          break;
        case ' ':
          e.preventDefault();
          if (this.onKeyboardPauseToggle) this.onKeyboardPauseToggle();
          break;
        case '1':
          if (this.onKeyboardSpeedToggle) this.onKeyboardSpeedToggle(1);
          break;
        case '2':
          if (this.onKeyboardSpeedToggle) this.onKeyboardSpeedToggle(2);
          break;
        case '3':
          if (this.onKeyboardSpeedToggle) this.onKeyboardSpeedToggle(3);
          break;
        case 'Escape':
          if (this.onEscapePressed) this.onEscapePressed();
          break;
      }
    });
  }
}
