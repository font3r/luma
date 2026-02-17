export type HexColor = `#${string}`

export type Point = { x: number; y: number }

export type CanvasObject = {
  id: string;
  position: Point;
  shape: Shape;
  snappingPoints?: Point[];
}

export function isPointInObject(point: Point, obj: CanvasObject): boolean {
  return obj.shape.contains(point, obj.position);
}

const SNAP_POINT_SIZE = 10;
const SNAP_POINT_COLOR: HexColor = "#adadad63";

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
  abstract contains(pt: Point, pos: Point): boolean;

  getBoundingBox(pos: Point) {
    return { x: pos.x, y: pos.y, width: this.width, height: this.height };
  }

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

  contains(pt: Point, pos: Point): boolean {
    return pt.x >= pos.x && pt.x <= pos.x + this.width
      && pt.y >= pos.y && pt.y <= pos.y + this.height;
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

  constructor(from: Point, to: Point, backgroundColor: HexColor) {
    const w = Math.abs(to.x - from.x);
    const h = Math.abs(to.y - from.y);
    super(w, h, backgroundColor)
    this.from = from;
    this.to = to;
  }

  draw(ctx: CanvasRenderingContext2D, pos: Point): void {
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.strokeStyle = this.backgroundColor;
    ctx.stroke();
  }

  drawSnappingPoints(ctx: CanvasRenderingContext2D): void {
    
  }

  contains(pt: Point, pos: Point): boolean {
    const padding = 6;

    const ax = pos.x + this.from.x;
    const ay = pos.y + this.from.y;
    const bx = pos.x + this.to.x;
    const by = pos.y + this.to.y;

    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;

    if (len2 === 0) {
      const ddx = pt.x - ax;
      const ddy = pt.y - ay;
      return ddx * ddx + ddy * ddy <= padding * padding;
    }

    const t = Math.max(0, Math.min(1, ((pt.x - ax) * dx + (pt.y - ay) * dy) / len2));
    const cx = ax + t * dx;
    const cy = ay + t * dy;
    const ddx = pt.x - cx;
    const ddy = pt.y - cy;
    return ddx * ddx + ddy * ddy <= padding * padding;
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

  drawSnappingPoints(ctx: CanvasRenderingContext2D): void {
    
  }

  contains(pt: Point, pos: Point): boolean {
    const cx = pos.x + this.radius;
    const cy = pos.y + this.radius;
    const dx = pt.x - cx;
    const dy = pt.y - cy;

    return dx * dx + dy * dy <= this.radius * this.radius;
  }
}