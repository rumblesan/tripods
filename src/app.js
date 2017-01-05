
import _ from 'underscore';
import Victor from 'victor';

import './index.html';
import './images/favicon.ico';
import './style/style.css';

import * as Canvas from './Canvas';
import * as Tripod from './Tripod';

const drawTripod = (canvas, {body: {leg1, leg2, leg3}}) => {
  Canvas.drawSquare(canvas, leg1, 10, 'white');
  Canvas.drawSquare(canvas, leg2, 10, 'white');
  Canvas.drawSquare(canvas, leg3, 10, 'white');

  Canvas.drawLine(canvas, leg1, leg2, 'white');
  Canvas.drawLine(canvas, leg2, leg3, 'white');
  Canvas.drawLine(canvas, leg3, leg1, 'white');
};

const drawTarget = (canvas, target) => {
  Canvas.drawSquare(canvas, target, 10, 'red');
};

const randomTripod = (canvasWidth, canvasHeight, size) => {
  const position = Victor(
    Math.round(Math.random() * canvasWidth),
    Math.round(Math.random() * canvasHeight)
  );
  const angle1 = Math.random() * 2 * Math.PI;
  const angle2 = (angle1 + (2 * Math.PI / 3));
  const angle3 = (angle2 + (2 * Math.PI / 3));

  const p1 = Victor(
    position.x + (Math.sin(angle1) * size),
    position.y + (Math.cos(angle1) * size)
  );
  const p2 = Victor(
    position.x + (Math.sin(angle2) * size),
    position.y + (Math.cos(angle2) * size)
  );
  const p3 = Victor(
    position.x + (Math.sin(angle3) * size),
    position.y + (Math.cos(angle3) * size)
  );
  return Tripod.create(
    p1, p2, p3
  );
};

const init = () => {
  console.log('init');


  const canvasEl = document.getElementById('canvas');
  const canvas = Canvas.create(window, canvasEl);

  const tripod = randomTripod(canvasEl.width, canvasEl.height, 25);

  const world = {
    canvas,
    tripod,
    target: null
  };

  canvasEl.onclick = (e) => {
    onClick(e, world);
  };

  requestAnimationFrame(() => draw(world));
};

const draw = (world) => {
  Tripod.live(world.tripod);
  Canvas.drawBackground(world.canvas, 'black');
  if (world.target) {
    drawTarget(world.canvas, world.target);
  }
  drawTripod(world.canvas, world.tripod);

  requestAnimationFrame(() => draw(world));
};

const onClick = (e, world) => {
  world.target = Victor(e.clientX, e.clientY);
  Tripod.newTarget(world.tripod, world.target, () => {
    world.target = null;
  });
};

init();
