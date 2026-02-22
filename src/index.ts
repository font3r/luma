import { addObject, connectObjects, } from "./canvas";
import { BOTTOM, Circle, LEFT, Rectangle, RIGHT, Square, TOP } from "./shapes/shapes";

function init(): void {
  const blue = addObject({ 
    id: "blue", 
    position: { x: 200, y: 50 },
    shape: new Rectangle(100, 50, "#0400ff") 
  })
  
  const red = addObject({ 
    id: "red", 
    position: { x: 50, y: 175 },
    shape: new Square(50, "#ff0000") 
  })
};

init()