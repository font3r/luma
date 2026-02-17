import { animate, draw, resizeCanvas, state } from "./canvas";
import { CanvasObject, isPointInObject, Point } from "./shapes/shapes";

function init(): void {
  const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  if (!ctx) {
    throw new Error("ctx not found")
  }

  resizeCanvas(canvas)

  let selectedObject: CanvasObject | null = null;
  let dragOffset: Point | null = null;

  canvas.addEventListener("mousedown", (e: MouseEvent) => {
    const clickPos: Point = { x: e.clientX, y: e.clientY };

    for (let i = 0; i < state.length; i++) {
      if (isPointInObject(clickPos, state[i])) {
        selectedObject = state[i];

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

  animate(ctx);
};

init()