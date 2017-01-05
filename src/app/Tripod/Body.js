/**
  Tripod Body
 */

import _ from 'underscore';
import Victor from 'victor';

export const create = (leg1, leg2, leg3) => {
  return {
    leg1, leg2, leg3,
    initialSize: area({leg1, leg2, leg3})
  };
};

export const farthestLeg = ({leg1, leg2, leg3}, target) => {
  return _.max(
    [leg1, leg2, leg3],
    (leg) => leg.distance(target)
  );
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

export const contains = ({leg1, leg2, leg3}, point) => {

  const v0 = leg3.clone().subtract(leg1);
  const v1 = leg2.clone().subtract(leg1);
  const v2 = point.clone().subtract(leg1);

  const dot00 = v0.dot(v0);
  const dot01 = v0.dot(v1);
  const dot02 = v0.dot(v2);
  const dot11 = v1.dot(v1);
  const dot12 = v1.dot(v2);

  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return (u >= 0) && (v >= 0) && (u + v < 1);
};
