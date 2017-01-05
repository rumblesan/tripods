
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

const init = () => {
  console.log('init');

  const tripod = Tripod.create(
    Victor(100, 130),
    Victor(90, 80),
    Victor(80, 110),
  );

  const canvasEl = document.getElementById('canvas');
  const canvas = Canvas.create(window, canvasEl);

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
