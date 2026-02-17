import { Arrow, CanvasObject, Circle, Rectangle, Square } from "./shapes/shapes";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

export const state: CanvasObject[] = [
  {
    id: "blue",
    position: { x: 50, y: 50 },
    shape: new Rectangle(50, 50, "#0400ff")
  },
  {
    id: "blue->red",
    position: null!,
    shape: new Arrow({ x: 75, y: 100 }, { x: 75, y: 150 }, "#ffffff")
  },
  {
    id: "red",
    position: { x: 50, y: 150 },
    shape: new Rectangle(50, 50, "#ff0000")
  },
  {
    id: "test",
    position: { x: 150, y: 150 },
    shape: new Circle(50, "#ff0000")
  }
]

export function resizeCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = WIDTH
  canvas.height = HEIGHT
}

export function animate(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  state.forEach(obj => {
    obj.shape.draw(ctx, obj.position)
    obj.shape.drawSnappingPoints(ctx, obj.position)
  })
  
  requestAnimationFrame(() => animate(ctx));
}