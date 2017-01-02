
import _ from 'underscore';
import Victor from 'Victor';

export const create = (p1, p2, p3) => {
  return {
    p1, p2, p3
  };
};

export const centre = ({p1, p2, p3}) => {
  return Victor(
    (p1.x + p2.x + p3.x) / 3,
    (p1.y + p2.y + p3.y) / 3
  );
};

export const area = ({p1, p2, p3}) => {
  return Math.abs(
    (p1.x * (p2.y - p3.y)) + (p2.x * (p3.y - p1.y)) + (p3.x * (p1.y - p2.y))
  ) / 2;
};

export const movePoint = (tripod, target) => {
  return _.chain(tripod).map(
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
