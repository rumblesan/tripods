
import _ from 'underscore';
import Victor from 'victor';

import * as Brain from './TripodBrain';

export const create = (leg1, leg2, leg3) => {

  const brain = Brain.create();

  const startArea = area({leg1, leg2, leg3});
  return {
    leg1, leg2, leg3,
    initialSize: startArea,
    config: {
      moveSteps: 10
    },
    steppingState: {},
    target: null,
    targetReached: null,
    brain
  };
};

export const legs = ({leg1, leg2, leg3}) => {
  return [
    {name: 'leg1', position: leg1},
    {name: 'leg2', position: leg2},
    {name: 'leg3', position: leg3},
  ];
};

export const getLeg = (tripod, name) => {
  return tripod[name];
};

export const farthestLeg = (tripod, target) => {
  return _.max(
    legs(tripod),
    (leg) => leg.position.distance(target)
  ).name;
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

/**
   Interaction functions
 */

export const live = (tripod) => {
  Brain.cogitate(tripod);
};

export const newTarget = (tripod, target, callback) => {
  tripod.target = target;
  tripod.targetReached = callback;
};
