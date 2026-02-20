import { addObject, } from "./canvas";
import { Arrow, Rectangle } from "./shapes/shapes";

function init(): void {
  addObject({ 
    id: "blue", 
    position: { x: 50, y: 50 },
    shape: new Rectangle(50, 50, "#0400ff") 
  })
  addObject({ 
    id: "red", 
    position: { x: 50, y: 150 }, 
    shape: new Rectangle(50, 50, "#ff0000") 
  })
  addObject({ 
    id: "blue->red", 
    position: null!, 
    shape: new Arrow({ x: 75, y: 100 }, { x: 75, y: 150 }, "#ffffff") 
  })
};

init()