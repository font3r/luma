import { CanvasObject, Point, Shape } from "./shapes/shapes";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const SNAP_POINT_WIDTH = 10;
const SNAP_POINT_HEIGHT = 10;

export const state: CanvasObject[] = [
  {
    id: "blue",
    position: { x: 50, y: 200 },
    shape: { width: 100, height: 100, backgroundColor: "#0400ff" },
    snappingPoints: [
      { width: SNAP_POINT_WIDTH, height: SNAP_POINT_HEIGHT, backgroundColor: "#ffffff57" },
      { width: SNAP_POINT_WIDTH, height: SNAP_POINT_HEIGHT, backgroundColor: "#ffffff57" },
      { width: SNAP_POINT_WIDTH, height: SNAP_POINT_HEIGHT, backgroundColor: "#ffffff57" },
      { width: SNAP_POINT_WIDTH, height: SNAP_POINT_HEIGHT, backgroundColor: "#ffffff57" },
    ]
  },
  {
    id: "red",
    position: { x: 50, y: 50 },
    shape: { width: 100, height: 100, backgroundColor: "#ff0000" },
    snappingPoints: []
  }
]

export function drawShape(canvas: CanvasRenderingContext2D, shape: Shape, position: Point): void {
  canvas.fillStyle = shape.backgroundColor;
  canvas.fillRect(
    position.x, position.y, 
    shape.width, shape.height);
}

export function drawCanvasObject(canvas: CanvasRenderingContext2D, canvasObject: CanvasObject): void {
  const shape = canvasObject.shape
  const position = canvasObject.position
  
  canvas.fillStyle = shape.backgroundColor;
  canvas.fillRect(
    position.x, position.y, 
    shape.width, shape.height);

  // TODO: for now assume set numbers of snapping points
  if (canvasObject.snappingPoints && canvasObject.snappingPoints.length == 4) {
    drawSnappingPoints(canvas, canvasObject)
  }
}

function drawSnappingPoints(canvas:CanvasRenderingContext2D, canvasObject: CanvasObject) {
  const sp = canvasObject.snappingPoints

  canvas.fillStyle = sp[0].backgroundColor;
  canvas.fillRect(
    canvasObject.position.x - (sp[0].height / 2),
    canvasObject.position.y - (sp[0].width / 2),
    sp[0].width, 
    sp[0].height);

  canvas.fillStyle = sp[1].backgroundColor;
  canvas.fillRect(
    canvasObject.position.x - (sp[0].height / 2),
    canvasObject.position.y + canvasObject.shape.height - (sp[0].width / 2),
    sp[1].width, 
    sp[1].height);

  canvas.fillStyle = sp[2].backgroundColor;
  canvas.fillRect(
    canvasObject.position.x + canvasObject.shape.width - (sp[0].height / 2),
    canvasObject.position.y + canvasObject.shape.height - (sp[0].width / 2),
    sp[2].width, 
    sp[2].height);

  canvas.fillStyle = sp[3].backgroundColor;
  canvas.fillRect(
    canvasObject.position.x + canvasObject.shape.width - (sp[0].height / 2),
    canvasObject.position.y - (sp[0].height / 2),
    sp[3].width, 
    sp[3].height);
}

export function resizeCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = HEIGHT
  canvas.height = WIDTH
}

export function animate(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  state.forEach(obj => {
    drawCanvasObject(ctx, obj);
  });
  
  requestAnimationFrame(() => animate(ctx));
}