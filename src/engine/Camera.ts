/**
 * Camera Controller
 * Supports 2.5D view panning, zooming, and keyboard shortcuts (WASD/Arrow keys) with boundaries.
 */

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 1.0;

  public minZoom: number = 0.6;
  public maxZoom: number = 2.0;

  public targetX: number = 0;
  public targetY: number = 0;
  public targetZoom: number = 1.0;

  public pan(dx: number, dy: number): void {
    this.targetX += dx / this.zoom;
    this.targetY += dy / this.zoom;
  }

  public zoomBy(factor: number): void {
    const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.targetZoom * factor));
    this.targetZoom = newZoom;
  }

  public update(): void {
    // Smooth lerp movement
    this.x += (this.targetX - this.x) * 0.15;
    this.y += (this.targetY - this.y) * 0.15;
    this.zoom += (this.targetZoom - this.zoom) * 0.15;
  }
}
