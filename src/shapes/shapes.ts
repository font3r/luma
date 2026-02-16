export type Shape = {
  width: number;
  height: number;
  backgroundColor: HexColor;
};

export type HexColor = `#${string}`

export type Point = {
  x: number
  y: number
}