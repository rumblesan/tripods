
import * as Brain from './Brain';
import * as Body from './Body';

export const create = (leg1, leg2, leg3) => {

  const brain = Brain.create();
  const body = Body.create(leg1, leg2, leg3);

  return {
    body,
    config: {
      moveSteps: 10
    },
    steppingState: {},
    target: null,
    targetReached: null,
    brain
  };
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
