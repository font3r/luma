import { CanvasObject, isPointInObject, Point } from "./shapes/shapes";

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

export function addObject(object: CanvasObject): void {
  state.push(object)
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
      if (isPointInObject(clickPos, state[i])) {
        selectedObject = state[i];
        console.log("selected object: ", selectedObject)

        // Difference between obj top-left corner and cursor pos
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
    if (selectedObject) {
      const cursonPos: Point = { x: e.clientX, y: e.clientY };

      if (dragOffset) {
        selectedObject.position = {
          x: cursonPos.x - dragOffset.x,
          y: cursonPos.y - dragOffset.y
        };
      }
    }
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