
import _ from 'underscore';
import Victor from 'Victor';

import * as StateMachine from './StateMachine';
import * as Brain from './TripodBrain';

export const create = (leg1, leg2, leg3) => {

  const stateMachine = StateMachine.create(_.values(Brain.States));
  StateMachine.registerStateFunction(stateMachine, Brain.States.THINKING, Brain.think);
  StateMachine.registerStateFunction(stateMachine, Brain.States.MOVING, Brain.move);
  StateMachine.registerStateFunction(stateMachine, Brain.States.GROWING, Brain.grow);
  StateMachine.registerStateFunction(stateMachine, Brain.States.SHRINKING, Brain.shrink);
  StateMachine.registerTransitionFunction(stateMachine, Brain.States.THINKING, Brain.startThinking);
  StateMachine.registerTransitionFunction(stateMachine, Brain.States.MOVING, Brain.startMoving);

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

/**
   Interaction functions
 */

export const live = (tripod) => {
  StateMachine.run(tripod.stateMachine, tripod);
};

export const newTarget = (tripod, target) => {
  tripod.target = target;
  StateMachine.change(tripod.stateMachine, Brain.States.MOVING, tripod);
};
