/**
  Tripod Brain

  Tripod behaviour using State Machine
 */

import _ from 'underscore';
import Victor from 'victor';

import * as Tripod from './Tripod';
import * as StateMachine from './StateMachine';

/**
   States that a Tripod can be in
 */
export const States = {
  THINKING: 'THINKING',
  MOVING: 'MOVING',
  GROWING: 'GROWING',
  SHRINKING: 'SHRINKING'
};

/**
   Moving state functions
 */

export const startMoving = (tripod) => {
  if (tripod.target === null) {
    return StateMachine.ERROR;
  }
  const movingLegName = Tripod.farthestLeg(tripod, tripod.target);
  const movingLeg = tripod[movingLegName];
  const tC = Tripod.centre(tripod);

  const direction = tC.clone().subtract(movingLeg).normalize();
  const moveDistance = movingLeg.distance(tC) * 4;
  const legTarget = direction.clone().multiply(Victor(moveDistance, moveDistance)).add(movingLeg);

  tripod.stateData = {
    movingLegName: movingLegName,
    target: legTarget,
    stepsTaken: 0,
    stepsInMovement: 10
  };
};

export const move = (tripod) => {
  const target = tripod.stateData.target;
  const movingLeg = tripod[tripod.stateData.movingLegName];
  tripod.stateData.stepsTaken += 1;
  if (tripod.stateData.stepsTaken >= tripod.stateData.stepsInMovement) {
    movingLeg.copy(target);
    return States.THINKING;
  }
  // Steps still to take
  const distance = target.distance(movingLeg);
  const step = (distance / tripod.stateData.stepsInMovement);
  const dirVector = target.clone().subtract(movingLeg).normalize().multiply(Victor(step, step));
  movingLeg.add(dirVector);
  return States.MOVING;
};

/**
   Thinking state functions
 */

export const startThinking = (tripod) => {
  tripod.stateData = {};
};

export const think = (tripod) => {
  if (tripod.target === null) {
    return States.THINKING;
  }
  if (Tripod.area(tripod) < (tripod.initialSize / 2)) {
    return States.GROWING;
  } else if (Tripod.area(tripod) > (tripod.initialSize * 2)) {
    return States.SHRINKING;
  } else if (!Tripod.contains(tripod, tripod.target)) {
    return States.MOVING;
  } else {
    tripod.targetReached();
    tripod.targetReached = null;
    tripod.target = null;
    return States.THINKING;
  }
};

/**
   Growing state functions
 */

export const startGrowing = (tripod) => {
  tripod.stateData = {};
};

export const grow = (tripod) => {
  const tC = Tripod.centre(tripod);
  const growLeg = _.min(
    Tripod.legs(tripod),
    (leg) => leg.position.distance(tC)
  ).name;
  const growth = Tripod.getLeg(growLeg, tripod).clone().subtract(tC).normalize().multiply(Victor(5, 5));
  Tripod.getLeg(growLeg, tripod).add(growth);
  return States.THINKING;
};

/**
   Shrinking state functions
 */

export const startShrinking = (tripod) => {
  tripod.stateData = {};
};

export const shrink = (tripod) => {
  const tC = Tripod.centre(tripod);
  const growLegName = _.max(
    Tripod.legs(tripod),
    (leg) => leg.position.distance(tC)
  ).name;
  const growLeg = Tripod.getLeg(tripod, growLegName);
  const shrinkage = tC.clone().subtract(growLeg).normalize().multiply(Victor(5, 5));
  growLeg.add(shrinkage);
  return States.THINKING;
};
