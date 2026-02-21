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
  const yellow = addObject({ 
    id: "yellow", 
    position: { x: 250, y: 300 },
    shape: new Square(50, "#ffee00")
  })
  const green = addObject({
    id: "green",
    position: { x: 150, y: 150 },
    shape: new Circle(20, "#1eff00")
  })

  connectObjects(blue, LEFT, red, TOP)
  connectObjects(blue, BOTTOM, green, TOP)
  connectObjects(blue, RIGHT, yellow, TOP)

  connectObjects(red, RIGHT, yellow, BOTTOM)
  connectObjects(red, RIGHT, green, LEFT)

  connectObjects(yellow, LEFT, green, RIGHT)
};

init()