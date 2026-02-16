import { draw, resizeCanvas } from "./canvas";

function init(): void {
  const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("ctx not found")
  }

  resizeCanvas(canvas)

  draw(ctx, { height: 250, width: 250, backgroundColor: "#000" })
  draw(ctx, { height: 50, width: 50, backgroundColor: "#0400ff" }, { x: 25, y: 25})
};

init()