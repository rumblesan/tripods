
import _ from 'underscore';
import Victor from 'victor';

import './index.html';
import './images/favicon.ico';
import './style/style.css';

import * as World from './app/World';
import * as Food from './app/Food';
import * as Canvas from './app/Canvas';
import * as Tripod from './app/Tripod';

const drawTripod = (canvas, {body: {leg1, leg2, leg3}}) => {
  Canvas.drawSquare(canvas, leg1, 10, 'white');
  Canvas.drawSquare(canvas, leg2, 10, 'white');
  Canvas.drawSquare(canvas, leg3, 10, 'white');

  Canvas.drawLine(canvas, leg1, leg2, 'white');
  Canvas.drawLine(canvas, leg2, leg3, 'white');
  Canvas.drawLine(canvas, leg3, leg1, 'white');
};

const drawFood = (canvas, food) => {
  Canvas.drawSquare(canvas, food.position, 10, 'red');
};

const randomTripod = (canvas, size) => {
  const position = Victor(
    Math.round(Math.random() * canvas.element.width),
    Math.round(Math.random() * canvas.element.height)
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

const randomFood = (canvas) => {
  const position = Victor(
    Math.round(Math.random() * canvas.element.width),
    Math.round(Math.random() * canvas.element.height)
  );
  return Food.create(position);
};

const init = () => {
  const canvasEl = document.getElementById('canvas');
  const canvas = Canvas.create(window, canvasEl);

  const world = World.create();
  World.addTripod(world, randomTripod(canvas, 25));
  World.addTripod(world, randomTripod(canvas, 25));
  World.addTripod(world, randomTripod(canvas, 25));
  World.addTripod(world, randomTripod(canvas, 25));
  World.addTripod(world, randomTripod(canvas, 25));
  canvasEl.onclick = (e) => {
    onClick(e, world);
  };

  requestAnimationFrame(() => draw(canvas, world));
};

const draw = (canvas, world) => {
  Canvas.drawBackground(canvas, 'black');
  _.each(world.tripods, (t) => Tripod.live(t, world));
  _.each(world.tripods, (t) => drawTripod(canvas, t));
  _.each(world.food, (f) => drawFood(canvas, f));
  if (world.food.length < 20) {
    const diff = 25 - world.food.length;
    for (let i = 0; i < diff; i += 1) {
      World.addFood(world, randomFood(canvas));
    }
  }

  requestAnimationFrame(() => draw(canvas, world));
};

const onClick = (e, world) => {
  const position = Victor(e.clientX, e.clientY);
  World.addFood(world, Food.create(position));
};

init();
