import { CanvasObject, isPointInObject, Point, Arrow, SnapPoint, Connection } from "./shapes/shapes";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const state: CanvasObject[] = [];
const SNAP_POINT_HITBOX = 12;

let selectedObject: CanvasObject | null = null;
let dragOffset: Point | null = null;
let drawedConnection: Connection | null = null;

(function createCanvas() {
  if (!ctx) {
    throw new Error("ctx not found")
  }

  resizeCanvas(canvas)
  registerMovingCapabilities()
  animateLoop(ctx)
})()

export function addObject(object: CanvasObject): CanvasObject {
  state.push(object)

  return object;
}

export function connectObjects(source: CanvasObject, sourceSp: SnapPoint, 
  destination: CanvasObject, destinationSp: SnapPoint): void {
  
    let x = addObject({ 
    id: `${source.id}->${destination.id}`, 
    position: null!,
    shape: new Arrow(
      source.shape.getSnapPoints(source.position)[sourceSp], 
      destination.shape.getSnapPoints(destination.position)[destinationSp]) 
  })

  console.log(x)
}

export function resizeCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = WIDTH
  canvas.height = HEIGHT
}

function registerMovingCapabilities() {
  canvas.addEventListener("mousedown", (e: MouseEvent) => {
    const clickPos: Point = { x: e.clientX, y: e.clientY };

    for (let i = 0; i < state.length; i++) {
      const obj = state[i];
      if (obj.shape instanceof Arrow) continue;

      const snapPoints = obj.shape.getSnapPoints(obj.position);
      for (let sp = 0; sp < snapPoints.length; sp++) {
        const spPos = snapPoints[sp];
        if (Math.hypot(clickPos.x - spPos.x, clickPos.y - spPos.y) < SNAP_POINT_HITBOX) {
          drawedConnection = { 
            sourceObject: obj, 
            sourceSnapPoint: sp as SnapPoint, 
            cursorPosition: clickPos 
          };
          return;
        }
      }

      if (isPointInObject(clickPos, obj)) {
        selectedObject = obj;
        dragOffset = { x: clickPos.x - obj.position.x, y: clickPos.y - obj.position.y };
        break;
      }
    }
  });

  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    const cursorPos: Point = { x: e.clientX, y: e.clientY };

    if (drawedConnection) {
      drawedConnection.cursorPosition = cursorPos;
      return;
    }

    if (!selectedObject || !dragOffset) return

    const newPos: Point = {
      x: cursorPos.x - dragOffset.x,
      y: cursorPos.y - dragOffset.y
    };

    const dx = newPos.x - selectedObject.position.x;
    const dy = newPos.y - selectedObject.position.y;
    const oldPos = { ...selectedObject.position };

    selectedObject.position = newPos;

    const eq = (p1: Point, p2: Point) => Math.hypot(p1.x - p2.x, p1.y - p2.y) < 0.5;

    state.filter(obj => obj.shape instanceof Arrow).forEach(obj => {
      const arrow = obj.shape as Arrow;

      for (const sp of selectedObject!.shape.getSnapPoints(oldPos)) {
        if (eq(arrow.from, sp)) {
          arrow.from = { x: arrow.from.x + dx, y: arrow.from.y + dy };
        }
        if (eq(arrow.to, sp)) {
          arrow.to = { x: arrow.to.x + dx, y: arrow.to.y + dy };
        }
      }
    });
  });

  canvas.addEventListener("mouseup", (e: MouseEvent) => {
    const cursorPos: Point = { x: e.clientX, y: e.clientY };

    if (drawedConnection) {
      for (const obj of state) {
        if (obj.shape instanceof Arrow) continue;
        
        const snapPoints = obj.shape.getSnapPoints(obj.position);
        for (let sp = 0; sp < snapPoints.length; sp++) {
          const spPos = snapPoints[sp];
          if (Math.hypot(cursorPos.x - spPos.x, cursorPos.y - spPos.y) < SNAP_POINT_HITBOX) {
            if (obj !== drawedConnection.sourceObject) {
              connectObjects(drawedConnection.sourceObject, drawedConnection.sourceSnapPoint, obj, sp as SnapPoint);
            }
            drawedConnection = null;
            return;
          }
        }
      }
      drawedConnection = null;
      return;
    }

    if (selectedObject) {
      selectedObject = null;
      dragOffset = null;
    }
  });
}

function drawConnection(ctx: CanvasRenderingContext2D, connection: Connection): void {
  const snapPoint = connection.sourceObject.shape.getSnapPoints(connection.sourceObject.position)[connection.sourceSnapPoint];
  
  ctx.beginPath();
  ctx.moveTo(snapPoint.x, snapPoint.y);
  ctx.lineTo(connection.cursorPosition.x, connection.cursorPosition.y);
  ctx.strokeStyle = "#ffffff";
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function animateLoop(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  state.forEach(obj => {
    obj.shape.draw(ctx, obj.position)
    obj.shape.drawSnappingPoints(ctx, obj.position)
  })
  
  if (drawedConnection) {
    drawConnection(ctx, drawedConnection)
  }
  
  requestAnimationFrame(() => animateLoop(ctx));
}