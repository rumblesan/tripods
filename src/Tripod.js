
import _ from 'underscore';
import Victor from 'Victor';

const State = {
  MOVING: 'MOVING',
  GROWING: 'GROWING',
  THINKING: 'THINKING'
};

export const create = (leg1, leg2, leg3) => {
  return {
    leg1, leg2, leg3,
    state: State.THINKING
  };
};

export const legs = ({leg1, leg2, leg3}) => {
  return {
    leg1, leg2, leg3
  };
};

export const centre = ({leg1, leg2, leg3}) => {
  return Victor(
    (leg1.x + leg2.x + leg3.x) / 3,
    (leg1.y + leg2.y + leg3.y) / 3
  );
};

export const area = ({leg1, leg2, leg3}) => {
  return Math.abs(
    (leg1.x * (leg2.y - leg3.y)) +
    (leg2.x * (leg3.y - leg1.y)) +
    (leg3.x * (leg1.y - leg2.y))
  ) / 2;
};

export const movePoint = (tripod, target) => {
  return _.chain(legs(tripod)).map(
    (p, name) => {
      return {name, distance: p.distance(target)};
    }
  ).max(
    ({distance}) => distance
  ).value().name;
};

export const newPoint = (tripod, target) => {
  const movePointName = movePoint(tripod, target);

  const pC = centre(tripod);

  const movePoint = tripod[movePointName];
  const moveDistance = movePoint.distance(pC) * 4;

  const newPoint = pC.subtract(movePoint).normalize().multiply(moveDistance).add(movePoint);

  return newPoint;
};
