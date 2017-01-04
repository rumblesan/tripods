/**
  Canvas Drawing
 */

export const create = (canvasElement) => {
  return {
    element: canvasElement,
    context: canvasElement.getContext('2d')
  };
};

export const drawSquare = (canvas, position, size, colour) => {
  canvas.context.fillStyle = colour;
  canvas.context.fillRect(position.x, position.y, size, size);
  return canvas;
};

export const drawLine = (canvas, start, end, colour) => {
  canvas.context.strokeStyle = colour;
  canvas.context.beginPath();
  canvas.context.moveTo(start.x, start.y);
  canvas.context.lineTo(end.x, end.y);
  canvas.context.stroke();
  return canvas;
};

export const drawBackground = (canvas, colour) => {
  console.log(canvas);
  canvas.context.fillStyle = colour;
  canvas.context.fillRect(0, 0, canvas.element.width, canvas.element.height);
  return canvas;
};

