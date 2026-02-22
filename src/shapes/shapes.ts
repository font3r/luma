export type HexColor = `#${string}`

export type SnapPoint = 0 | 1 | 2 | 3;
export const BOTTOM: SnapPoint = 0, RIGHT: SnapPoint = 1, 
  TOP: SnapPoint = 2, LEFT: SnapPoint = 3;

export type Point = { x: number; y: number }

export type CanvasObject = {
  id: string;
  position: Point;
  shape: Shape;
}

export function isPointInObject(point: Point, obj: CanvasObject): boolean {
  return obj.shape.contains(point, obj.position);
}

const SNAP_POINT_SIZE = 8;
const SNAP_POINT_COLOR: HexColor = "#adadad63";
const ARROW_COLOR: HexColor = "#ffffff";

export abstract class Shape {
  width: number;
  height: number;
  backgroundColor: HexColor;

  constructor(width: number, height: number, backgroundColor: HexColor) {
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
  }

  abstract draw(ctx: CanvasRenderingContext2D, pos: Point): void;
  abstract drawSnappingPoints(ctx: CanvasRenderingContext2D, pos: Point): void;
  abstract contains(point: Point, shapeAnchor: Point): boolean;

  getSnapPoints(_pos: Point): Point[] {
    return [];
  }
}

export class Rectangle extends Shape {
  constructor(width: number, height: number, backgroundColor: HexColor) {
    super(width, height, backgroundColor)
  }

  draw(ctx: CanvasRenderingContext2D, pos: Point): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(pos.x, pos.y, this.width, this.height);
  }

  drawSnappingPoints(ctx: CanvasRenderingContext2D, pos: Point): void {
    const points = this.getSnapPoints(pos)

    ctx.fillStyle = SNAP_POINT_COLOR;
    ctx.lineWidth = 4
    ctx.fillRect(
      points[0].x - (SNAP_POINT_SIZE / 2),  
      points[0].y - (SNAP_POINT_SIZE / 2),  
      SNAP_POINT_SIZE, 
      SNAP_POINT_SIZE)
    ctx.fillRect(
      points[1].x - (SNAP_POINT_SIZE / 2), 
      points[1].y - (SNAP_POINT_SIZE / 2), 
      SNAP_POINT_SIZE, 
      SNAP_POINT_SIZE);
    ctx.fillRect(
      points[2].x - (SNAP_POINT_SIZE / 2), 
      points[2].y - (SNAP_POINT_SIZE / 2), 
      SNAP_POINT_SIZE, 
      SNAP_POINT_SIZE);
    ctx.fillRect(
      points[3].x - (SNAP_POINT_SIZE / 2), 
      points[3].y - (SNAP_POINT_SIZE / 2), 
      SNAP_POINT_SIZE, 
      SNAP_POINT_SIZE);
  }

  contains(point: Point, shapeAnchor: Point): boolean {
    return point.x >= shapeAnchor.x && point.x <= shapeAnchor.x + this.width
      && point.y >= shapeAnchor.y && point.y <= shapeAnchor.y + this.height;
  }

  getSnapPoints(pos: Point): Point[] {
    return [
      { x: pos.x + (this.width / 2), y: pos.y + this.height },
      { x: pos.x + this.width, y: pos.y + (this.height / 2) },
      { x: pos.x + (this.width / 2), y: pos.y },
      { x: pos.x, y: pos.y + (this.height / 2) },
    ];
  }
}

export class Square extends Rectangle {
  constructor(size: number, backgroundColor: HexColor) {
    super(size, size, backgroundColor)
  }
}

export class Arrow extends Shape {
  from: Point;
  to: Point;

  constructor(from: Point, to: Point) {
    const w = Math.abs(to.x - from.x);
    const h = Math.abs(to.y - from.y);
    super(w, h, ARROW_COLOR)
    this.from = from;
    this.to = to;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.strokeStyle = this.backgroundColor;
    ctx.stroke();
  }

  drawSnappingPoints(ctx: CanvasRenderingContext2D): void {
    
  }

  contains(point: Point, shapeAnchor: Point): boolean {
    const padding = 6;
    const { x: x1, y: y1 } = this.from;
    const { x: x2, y: y2 } = this.to;
    const { x, y } = point;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 
      ? 0 
      : Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / len2));
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    const distX = x - closestX;
    const distY = y - closestY;

    return distX * distX + distY * distY <= padding * padding;
  }
}

export class Circle extends Shape {
  radius: number;

  constructor(radius: number, backgroundColor: HexColor) {
    super(radius * 2, radius * 2, backgroundColor)
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D, pos: Point): void {
    ctx.beginPath();
    ctx.arc(pos.x + this.radius, pos.y + this.radius, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.backgroundColor;
    ctx.fill();
  }

  drawSnappingPoints(ctx: CanvasRenderingContext2D, pos: Point): void {
    const points = this.getSnapPoints(pos)

    ctx.fillStyle = SNAP_POINT_COLOR;
    ctx.lineWidth = 4
    ctx.fillRect(
      points[0].x - (SNAP_POINT_SIZE / 2),  
      points[0].y - (SNAP_POINT_SIZE / 2),  
      SNAP_POINT_SIZE, 
      SNAP_POINT_SIZE)
    ctx.fillRect(
      points[1].x - (SNAP_POINT_SIZE / 2), 
      points[1].y - (SNAP_POINT_SIZE / 2), 
      SNAP_POINT_SIZE, 
      SNAP_POINT_SIZE);
    ctx.fillRect(
      points[2].x - (SNAP_POINT_SIZE / 2), 
      points[2].y - (SNAP_POINT_SIZE / 2), 
      SNAP_POINT_SIZE, 
      SNAP_POINT_SIZE);
    ctx.fillRect(
      points[3].x - (SNAP_POINT_SIZE / 2), 
      points[3].y - (SNAP_POINT_SIZE / 2), 
      SNAP_POINT_SIZE, 
      SNAP_POINT_SIZE);
  }

  getSnapPoints(pos: Point): Point[] {
    return [
      { x: pos.x + (this.width / 2), y: pos.y + this.height },
      { x: pos.x + this.width, y: pos.y + (this.height / 2) },
      { x: pos.x + (this.width / 2), y: pos.y },
      { x: pos.x, y: pos.y + (this.height / 2) },
    ]
  }

  contains(point: Point, shapeAnchor: Point): boolean {
    const cx = shapeAnchor.x + this.radius;
    const cy = shapeAnchor.y + this.radius;
    const dx = point.x - cx;
    const dy = point.y - cy;

    return dx * dx + dy * dy <= this.radius * this.radius;
  }
}