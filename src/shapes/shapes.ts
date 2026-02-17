export type HexColor = `#${string}`

export type Point = { x: number; y: number }

export type CanvasObject = {
  id: string;
  position: Point;
  shape: Shape;
  snappingPoints: Shape[]
}

export function isPointInObject(point: Point, obj: CanvasObject): boolean {
  const { position, shape } = obj;
  
  return point.x >= position.x && point.x <= position.x + shape.width 
    && point.y >= position.y && point.y <= position.y + shape.height;
}

export abstract class Shape {
  width: number;
  height: number;
  backgroundColor: HexColor;

  constructor(width: number, height: number, backgroundColor: HexColor) {
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
  }
}

export class Rectangle extends Shape {
  constructor(width: number, height: number, backgroundColor: HexColor) {
    super(width, height, backgroundColor)
  }
}

export class Square extends Shape {
  constructor(size: number, backgroundColor: HexColor) {
    super(size, size, backgroundColor)
  }
}

export class Arrow extends Shape {
  constructor(from: Point, to: Point, backgroundColor: HexColor) {
    super(0, 0, backgroundColor)
  }
}

export class Circle extends Shape {
  
}