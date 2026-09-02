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

  private isMouseDown: boolean = false;
  private isDragging: boolean = false;
  private mouseDownPos: { x: number; y: number } = { x: 0, y: 0 };
  private lastMousePos: { x: number; y: number } = { x: 0, y: 0 };
  private initialPinchDist: number | null = null;

  public onTileClick?: (gridX: number, gridY: number) => void;
  public onKeyboardSpeedToggle?: (speed: number) => void;
  public onKeyboardPauseToggle?: () => void;
  public onEscapePressed?: () => void;
  public onUndoPressed?: () => void;
  public onRedoPressed?: () => void;
  public onHelpPressed?: () => void;

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

      if (this.isMouseDown) {
        const totalDist = Math.hypot(mouseX - this.mouseDownPos.x, mouseY - this.mouseDownPos.y);
        if (totalDist > 6) {
          this.isDragging = true;
        }
      }

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
        this.isMouseDown = true;
        this.isDragging = false;
        const rect = this.canvas.getBoundingClientRect();
        const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        this.mouseDownPos = pos;
        this.lastMousePos = pos;
      }
    });

    // Mouse Up (Click trigger if not dragged)
    this.canvas.addEventListener('mouseup', (e) => {
      const wasDragging = this.isDragging;
      this.isMouseDown = false;
      this.isDragging = false;

      if (!wasDragging) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const grid = this.renderer.screenToGrid(mouseX, mouseY, this.camera);
        if (grid && this.onTileClick) {
          this.soundManager.playUIClick();
          this.onTileClick(grid.x, grid.y);
        }
      }
    });

    // Wheel Zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.camera.zoomBy(zoomFactor);
    }, { passive: false });

    // Touch Support for Tablets & Mobile (1 finger pan, 2 finger pinch-to-zoom)
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const pos = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        this.isMouseDown = true;
        this.isDragging = false;
        this.mouseDownPos = pos;
        this.lastMousePos = pos;
      } else if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        this.initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (e.touches.length === 1 && this.isMouseDown) {
        const touch = e.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        const totalDist = Math.hypot(touchX - this.mouseDownPos.x, touchY - this.mouseDownPos.y);
        if (totalDist > 8) {
          this.isDragging = true;
        }

        if (this.isDragging) {
          const dx = touchX - this.lastMousePos.x;
          const dy = touchY - this.lastMousePos.y;
          this.camera.pan(dx, dy);
          this.lastMousePos = { x: touchX, y: touchY };
        }
      } else if (e.touches.length === 2 && this.initialPinchDist !== null) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const factor = currentDist / this.initialPinchDist;
        if (Math.abs(factor - 1) > 0.05) {
          this.camera.zoomBy(factor > 1 ? 1.05 : 0.95);
          this.initialPinchDist = currentDist;
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        const wasDragging = this.isDragging;
        this.isMouseDown = false;
        this.isDragging = false;
        this.initialPinchDist = null;

        if (!wasDragging && this.onTileClick) {
          const grid = this.renderer.screenToGrid(this.lastMousePos.x, this.lastMousePos.y, this.camera);
          if (grid) {
            this.soundManager.playUIClick();
            this.onTileClick(grid.x, grid.y);
          }
        }
      }
    }, { passive: true });

    // Keyboard Shortcuts (WCAG Accessibility & Power Users)
    window.addEventListener('keydown', (e) => {
      // Don't capture inputs if user is typing in form input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Undo / Redo
      if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (this.onUndoPressed) this.onUndoPressed();
        return;
      }
      if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        if (this.onRedoPressed) this.onRedoPressed();
        return;
      }

      switch (e.key) {
        case '?':
        case 'F1':
          e.preventDefault();
          if (this.onHelpPressed) this.onHelpPressed();
          break;
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

