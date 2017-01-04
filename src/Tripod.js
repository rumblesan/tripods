
import _ from 'underscore';
import Victor from 'Victor';

import * as StateMachine from './StateMachine';

const States = {
  THINKING: 'THINKING',
  MOVING: 'MOVING',
  GROWING: 'GROWING',
  SHRINKING: 'SHRINKING'
};

export const create = (leg1, leg2, leg3) => {

  const stateMachine = StateMachine.create(_.values(States));
  StateMachine.registerStateFunction(stateMachine, States.THINKING, think);
  StateMachine.registerStateFunction(stateMachine, States.MOVING, move);
  StateMachine.registerStateFunction(stateMachine, States.GROWING, grow);
  StateMachine.registerStateFunction(stateMachine, States.SHRINKING, shrink);
  StateMachine.registerTransitionFunction(stateMachine, States.THINKING, startThinking);
  StateMachine.registerTransitionFunction(stateMachine, States.MOVING, startMoving);
  StateMachine.registerTransitionFunction(stateMachine, States.GROWING, startGrowing);

  const startArea = area({leg1, leg2, leg3});
  return {
    leg1, leg2, leg3,
    initialSize: startArea,
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

export const getLeg = (tripod, name) => {
  return tripod[name];
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
  if (area(tripod) < (tripod.initialSize / 2)) {
    return States.GROWING;
  } else if (area(tripod) > (tripod.initialSize * 2)) {
    return States.SHRINKING;
  } else if (centre(tripod).distance(tripod.target) > 10) {
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

export const grow = (tripod) => {
  const tC = centre(tripod);
  const growLeg = _.min(
    legs(tripod),
    (leg) => leg.position.distance(tC)
  ).name;
  const growth = getLeg(growLeg, tripod).clone().subtract(tC).normalize().multiply(Victor(5, 5));
  getLeg(growLeg, tripod).add(growth);
  return States.THINKING;
};

/**
   Shrinking state functions
 */

export const startShrinking = (tripod) => {
  tripod.stateData = {};
};

export const shrink = (tripod) => {
  console.log('shrink');
  const tC = centre(tripod);
  const growLegName = _.max(
    legs(tripod),
    (leg) => leg.position.distance(tC)
  ).name;
  console.log('growLegName', growLegName);
  const growLeg = getLeg(tripod, growLegName);
  console.log('growLeg', growLeg);
  const shrinkage = tC.clone().subtract(growLeg).normalize().multiply(Victor(5, 5));
  console.log('shrinkage', shrinkage);
  growLeg.add(shrinkage);
  return States.THINKING;
};

/**
   Interaction functions
 */

export const live = (tripod) => {
  StateMachine.run(tripod.stateMachine, tripod);
};

export const newTarget = (tripod, target) => {
  tripod.target = target;
  StateMachine.change(tripod.stateMachine, States.MOVING, tripod);
};
