
import * as Brain from './Brain';
import * as Body from './Body';

export const create = (leg1, leg2, leg3) => {
  return {
    body: Body.create(leg1, leg2, leg3),
    config: {
      moveSteps: 10
    },
    steppingState: {},
    brain: Brain.create()
  };
};

/**
   Interaction functions
 */

export const live = (tripod, world) => {
  Brain.cogitate(tripod, world);
};

export const newTarget = (tripod, target, callback) => {
  tripod.target = target;
  tripod.targetReached = callback;
};
