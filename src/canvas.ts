import { CanvasObject, isPointInObject, Point, Arrow } from "./shapes/shapes";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const state: CanvasObject[] = [];

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

export function connectObjects(source: CanvasObject, destination: CanvasObject): void {
  let x = addObject({ 
    id: `${source.id}->${destination.id}`, 
    position: null!,
    shape: new Arrow(
      source.shape.getSnapPoints(source.position)[0], // specific sp should be taken from cursor placement
      destination.shape.getSnapPoints(destination.position)[2], 
      "#ffffff") 
  })

  console.log(x)
}

export function resizeCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = WIDTH
  canvas.height = HEIGHT
}

let selectedObject: CanvasObject | null = null;
let dragOffset: Point | null = null;

function registerMovingCapabilities() {
  canvas.addEventListener("mousedown", (e: MouseEvent) => {
    const clickPos: Point = { x: e.clientX, y: e.clientY };

    for (let i = 0; i < state.length; i++) {
      if (isPointInObject(clickPos, state[i]) && !(state[i].shape instanceof Arrow)) {
        selectedObject = state[i];
        console.log("selected object: ", selectedObject)

        // difference between obj top-left corner and cursor pos
        dragOffset = { 
          x: clickPos.x - selectedObject.position.x, 
          y: clickPos.y - selectedObject.position.y 
        };

        break;
      }
    }
  });

  canvas.addEventListener("mouseup", () => {
    if (selectedObject) {
      selectedObject = null;
      dragOffset = null;
    }
  });

  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    if (!selectedObject || !dragOffset) return
    
    const cursonPos: Point = { x: e.clientX, y: e.clientY };
    const newPos: Point = {
      x: cursonPos.x - dragOffset.x,
      y: cursonPos.y - dragOffset.y
    };

    const dx = newPos.x - selectedObject.position.x;
    const dy = newPos.y - selectedObject.position.y;
    const oldPos = { ...selectedObject.position };

    selectedObject.position = newPos;

    const eq = (p1: Point, p2: Point) => Math.hypot(p1.x - p2.x, p1.y - p2.y) < 0.5;

    state.filter(obj => obj.shape instanceof Arrow).forEach(obj => {
      const arrow = obj.shape as Arrow;

      for (const sp of selectedObject!.shape.getSnapPoints(oldPos)) {
        // this is kindof stupid because we're looking for closest sp instead of containing sp's in canvas obj
        if (eq(arrow.from, sp)) {
          arrow.from = { x: arrow.from.x + dx, y: arrow.from.y + dy };
        }

        if (eq(arrow.to, sp)) {
          arrow.to = { x: arrow.to.x + dx, y: arrow.to.y + dy };
        }
      }
    });
  });
}

export function animateLoop(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  state.forEach(obj => {
    obj.shape.draw(ctx, obj.position)
    obj.shape.drawSnappingPoints(ctx, obj.position)
  })
  
  requestAnimationFrame(() => animateLoop(ctx));
}