import { Point, Shape } from "./shapes/shapes";

export function draw(canvas: CanvasRenderingContext2D, shape: Shape, position: Point | null = null): void {
  canvas.fillStyle = shape.backgroundColor;
  canvas.fillRect(
    position?.x ?? 0, 
    position?.y ??  0, 
    shape.width, 
    shape.height);
}

export function resizeCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}