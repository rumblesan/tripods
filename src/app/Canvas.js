/**
  Canvas Drawing
 */

export const create = (window, canvasElement) => {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  return {
    element: canvasElement,
    context: canvasElement.getContext('2d')
  };
};

export const drawSquare = (canvas, position, size, colour) => {
  const offset = size / 2;
  canvas.context.fillStyle = colour;
  canvas.context.fillRect(position.x - offset, position.y - offset, size, size);
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
  canvas.context.fillStyle = colour;
  canvas.context.fillRect(0, 0, canvas.element.width, canvas.element.height);
  return canvas;
};

