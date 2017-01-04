
import _ from 'underscore';
import Victor from 'Victor';

import * as StateMachine from './StateMachine';

const States = {
  THINKING: 'THINKING',
  MOVING: 'MOVING',
  GROWING: 'GROWING'
};

export const create = (leg1, leg2, leg3) => {

  const stateMachine = StateMachine.create(_.values(States));
  StateMachine.registerStateFunction(stateMachine, States.THINKING, think);
  StateMachine.registerStateFunction(stateMachine, States.MOVING, move);
  StateMachine.registerStateFunction(stateMachine, States.GROWING, grow);
  StateMachine.registerTransitionFunction(stateMachine, States.THINKING, startThinking);
  StateMachine.registerTransitionFunction(stateMachine, States.MOVING, startMoving);
  StateMachine.registerTransitionFunction(stateMachine, States.GROWING, startGrowing);

  return {
    leg1, leg2, leg3,
    stateData: {},
    target: null,
    stateMachine
  };
};

export const legs = ({leg1, leg2, leg3}) => {
  return [
    {name: 'leg1', position: leg1},
    {name: 'leg2', position: leg2},
    {name: 'leg3', position: leg3},
  ];
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


/**
   Moving state functions
 */

export const farthestLeg = (tripod, target) => {
  return _.max(
    legs(tripod),
    (leg) => leg.position.distance(target)
  ).name;
};

export const startMoving = (tripod) => {
  if (tripod.target === null) {
    return StateMachine.ERROR;
  }
  const movingLegName = farthestLeg(tripod, tripod.target);
  const movingLeg = tripod[movingLegName];
  const tC = centre(tripod);

  const direction = tC.clone().subtract(movingLeg).normalize();
  const moveDistance = movingLeg.distance(tC) * 4;
  const legTarget = direction.clone().multiply(moveDistance).add(movingLeg);

  tripod.stateData = {
    movingLeg: movingLegName,
    target: legTarget,
    stepsTaken: 0,
    stepsInMovement: 10
  };
};

export const move = (tripod) => {
  tripod.stateData.stepsTaken += 1;
  if (tripod.stateData.stepsTaken >= tripod.stateData.stepsInMovement) {
    movingLeg.copy(target);
    return States.THINKING;
  }
  // Steps still to take
  const movingLeg = tripod[tripod.stateData.movingLeg];
  const target = tripod.stateData.target;
  const distance = target.distance(movingLeg);
  const step = (distance / tripod.stateData.stepsInMovement);
  const dirVector = target.clone().subtract(movingLeg).normalize().multiply(step);
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
  if (centre(tripod).distance(tripod.target) > 10) {
    return States.MOVING;
  } else {
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

export const grow = () => {
  return States.THINKING;
};

/**
   Interaction functions
 */

export const live = (tripod) => {
  StateMachine.run(tripod.sm, tripod);
};

export const newTarget = (tripod, target) => {
  tripod.target = target;
  StateMachine.change(tripod.sm, States.MOVING, tripod);
};
