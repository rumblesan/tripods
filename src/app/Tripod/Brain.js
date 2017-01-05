/**
  Tripod Brain

  Tripod behaviour using State Machine
 */

import _ from 'underscore';
import Victor from 'victor';

import * as Body from './Body';
import * as StateMachine from '../StateMachine';
import * as World from '../World';

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

export const startMoving = ({tripod, world}) => {
  if (tripod.target === null) {
    return StateMachine.ERROR;
  }

  const tC = Body.centre(tripod.body);
  const closestFood = World.closestFood(world, tC);

  const steppingLeg = Body.farthestLeg(tripod.body, closestFood.position);

  const direction = tC.clone().subtract(steppingLeg).normalize();
  const moveDistance = steppingLeg.distance(tC) * 4;

  const stepDistance = moveDistance / tripod.config.moveSteps;
  const stepDelta = direction.multiply(Victor(stepDistance, stepDistance));

  tripod.steppingState = {
    steppingLeg,
    stepDelta,
    stepsRemaining: tripod.config.moveSteps
  };
};

export const move = ({tripod}) => {
  tripod.steppingState.stepsRemaining -= 1;
  if (tripod.steppingState.stepsRemaining <= 0) {
    tripod.steppingState = {};
    return States.THINKING;
  }
  const steppingLeg = tripod.steppingState.steppingLeg;
  steppingLeg.add(tripod.steppingState.stepDelta);
  return States.MOVING;
};

/**
   Thinking state functions
 */

export const think = ({tripod, world}) => {
  if (Body.area(tripod.body) < (tripod.body.initialSize / 2)) {
    return States.GROWING;
  }
  if (Body.area(tripod.body) > (tripod.body.initialSize * 2)) {
    return States.SHRINKING;
  }
  const tC = Body.centre(tripod.body);
  const closestFood = World.closestFood(world, tC);
  if (closestFood === null) {
    return States.THINKING;
  }
  if (!Body.contains(tripod.body, closestFood.position)) {
    return States.MOVING;
  } else {
    World.eatFood(world, closestFood);
    return States.THINKING;
  }
};

/**
   Growing state functions
 */

export const grow = ({tripod}) => {
  const tC = Body.centre(tripod.body);
  const growLeg = Body.farthestLeg(tripod.body, tC);
  const growth = growLeg.clone().subtract(tC).normalize().multiply(Victor(5, 5));
  growLeg.add(growth);
  return States.THINKING;
};

/**
   Shrinking state functions
 */

export const shrink = ({tripod}) => {
  const tC = Body.centre(tripod.body);
  const shrinkLeg = Body.farthestLeg(tripod.body, tC);
  const shrinkage = tC.clone().subtract(shrinkLeg).normalize().multiply(Victor(5, 5));
  shrinkLeg.add(shrinkage);
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

export const cogitate = (tripod, world) => {
  StateMachine.run(tripod.brain, {tripod, world});
};
