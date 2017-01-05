/**
  Tripod Brain

  Tripod behaviour using State Machine
 */

import _ from 'underscore';
import Victor from 'victor';

import * as Body from './Body';
import * as StateMachine from '../StateMachine';

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

  const movingLegName = Body.farthestLeg(tripod.body, tripod.target);
  const movingLeg = Body.getLeg(tripod.body, movingLegName);
  const tC = Body.centre(tripod.body);

  const direction = tC.clone().subtract(movingLeg).normalize();
  const moveDistance = movingLeg.distance(tC) * 4;

  const stepDistance = moveDistance / tripod.config.moveSteps;
  const stepDelta = direction.multiply(Victor(stepDistance, stepDistance));

  tripod.steppingState = {
    movingLegName: movingLegName,
    stepDelta,
    stepsTaken: tripod.config.moveSteps
  };
};

export const move = (tripod) => {
  tripod.steppingState.stepsTaken -= 1;
  if (tripod.steppingState.stepsTaken <= 0) {
    tripod.steppingState = {};
    return States.THINKING;
  }
  const movingLeg = Body.getLeg(tripod.body, tripod.steppingState.movingLegName);
  movingLeg.add(tripod.steppingState.stepDelta);
  return States.MOVING;
};

/**
   Thinking state functions
 */

export const think = (tripod) => {
  if (tripod.target === null) {
    return States.THINKING;
  }
  if (Body.area(tripod.body) < (tripod.body.initialSize / 2)) {
    return States.GROWING;
  } else if (Body.area(tripod.body) > (tripod.body.initialSize * 2)) {
    return States.SHRINKING;
  } else if (!Body.contains(tripod.body, tripod.target)) {
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

export const grow = (tripod) => {
  const tC = Body.centre(tripod.body);
  const growLeg = _.min(
    Body.legs(tripod.body),
    (leg) => leg.position.distance(tC)
  ).name;
  const growth = Body.getLeg(tripod.body, growLeg).clone().subtract(tC).normalize().multiply(Victor(5, 5));
  Body.getLeg(tripod.body, growLeg).add(growth);
  return States.THINKING;
};

/**
   Shrinking state functions
 */

export const shrink = (tripod) => {
  const tC = Body.centre(tripod.body);
  const growLegName = _.max(
    Body.legs(tripod.body),
    (leg) => leg.position.distance(tC)
  ).name;
  const growLeg = Body.getLeg(tripod.body, growLegName);
  const shrinkage = tC.clone().subtract(growLeg).normalize().multiply(Victor(5, 5));
  growLeg.add(shrinkage);
  return States.THINKING;
};

/**
   Brain functions
 */

export const create = () => {
  const brain = StateMachine.create(_.values(States));
  StateMachine.registerStateFunction(brain, States.THINKING, think);
  StateMachine.registerStateFunction(brain, States.MOVING, move);
  StateMachine.registerStateFunction(brain, States.GROWING, grow);
  StateMachine.registerStateFunction(brain, States.SHRINKING, shrink);
  StateMachine.registerTransitionFunction(brain, States.MOVING, startMoving);
  return brain;
};

export const cogitate = (tripod) => {
  StateMachine.run(tripod.brain, tripod);
};
