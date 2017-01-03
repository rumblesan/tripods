
import _ from 'underscore';
import Victor from 'Victor';

const State = {
  MOVING: 'MOVING',
  GROWING: 'GROWING',
  THINKING: 'THINKING'
};
const ERROR = 'ERROR';

export const create = (leg1, leg2, leg3) => {
  return {
    leg1, leg2, leg3,
    state: State.THINKING,
    stateData: {}
  };
};

export const legs = ({leg1, leg2, leg3}) => {
  return {
    leg1, leg2, leg3
  };
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
export const movingLeg = (tripod, target) => {
  return _.chain(legs(tripod)).map(
    (p, name) => {
      return {name, distance: p.distance(target)};
    }
  ).max(
    ({distance}) => distance
  ).value().name;
};

export const startMoving = (tripod, target) => {
  const movingLegName = movingLeg(tripod, target);
  const movingLeg = tripod[movingLegName];
  const tC = centre(tripod);

  const direction = tC.clone().subtract(movingLeg).normalize();
  const moveDistance = movingLeg.distance(tC) * 4;
  const legTarget = direction.clone().multiply(moveDistance).add(movingLeg);

  tripod.state = State.MOVING;
  tripod.stateData = {
    movingLeg: movingLegName,
    target: legTarget,
    stepsTaken: 0,
    stepsInMovement: 10
  };
};

export const move = (tripod) => {
  if (tripod.state !== State.MOVING) {
    console.log(`Shouldn't be moving in ${tripod.state} state`);
    return ERROR;
  }

  tripod.stateData.stepsTaken += 1;
  if (tripod.stateData.stepsTaken >= tripod.stateData.stepsInMovement) {
    movingLeg.copy(target);
    return State.THINKING;
  }
  // Steps still to take
  const movingLeg = tripod[tripod.stateData.movingLeg];
  const target = tripod.stateData.target;
  const distance = target.distance(movingLeg);
  const step = (distance / tripod.stateData.stepsInMovement);
  const dirVector = target.clone().subtract(movingLeg).normalize().multiply(step);
  movingLeg.add(dirVector);
  return State.MOVING;
};

/**
   Thinking state functions
 */

export const startThinking = (tripod) => {
  tripod.state = State.THINKING;
  tripod.stateData = {};
};

export const think = (tripod) => {
  return tripod.state;
};

/**
   Growing state functions
 */

export const startGrowing = (tripod) => {
  tripod.state = State.GROWING;
  tripod.stateData = {};
};

export const grow = () => {
  return State.THINKING;
};

/**
   State Machine functions
 */
export const live = (tripod) => {
  switch (tripod.state) {
  case State.MOVING:
    handleState(move(tripod));
    break;
  case State.GROWING:
    handleState(grow(tripod));
    break;
  case State.THINKING:
    handleState(think(tripod));
    break;
  default:
    handleState(think(tripod));
    break;
  }
};

export const handleState = (tripod, newState) => {
  if (newState === tripod.state) {
    // no state change
    return;
  }
  switch (tripod.state) {
  case State.MOVING:
    startMoving(tripod);
    break;
  case State.GROWING:
    startGrowing(tripod);
    break;
  case State.THINKING:
    startThinking(tripod);
    break;
  default:
    if (newState === ERROR) {
      // Handle error
    }
    startThinking(tripod);
    break;
  }
};
