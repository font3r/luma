import { addObject, connectObjects, } from "./canvas";
import { Rectangle } from "./shapes/shapes";

function init(): void {
  const blue = addObject({ 
    id: "blue", 
    position: { x: 200, y: 50 },
    shape: new Rectangle(50, 50, "#0400ff") 
  })
  const red = addObject({ 
    id: "red", 
    position: { x: 50, y: 175 },
    shape: new Rectangle(50, 50, "#ff0000") 
  })
  const yellow = addObject({ 
    id: "yellow", 
    position: { x: 250, y: 300 },
    shape: new Rectangle(50, 50, "#ffee00")
  })

  connectObjects(blue, red)
  connectObjects(blue, yellow)
  connectObjects(red, yellow)
};

init()