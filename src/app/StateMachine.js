/**
  State Machine
  
  A simple Finite State Machine
  
  Create states, run registered callback based on current state, and trigger a callback when moving to a new state.
  All current state callbacks must return the next state to transition to. This cane be the same as the current state.
  
  Callbacks will have state machine user data passed in.
 */

import _ from 'underscore';

export const ERROR = 'STATEMACHINEERROR';

export const create = (states, debug) => {
  return {
    defaultState: states[0],
    currentState: states[0],
    states,
    stateFunction: {},
    transitionFunction: {},
    debug: debug || false
  };
};

const log = (sm, message) => {
  if (!sm.debug) return;
  if (message) {
    console.log(`State Machine - ${sm.currentState}: ${message}`);
  } else {
    console.log(`State Machine - ${sm.currentState}`);
  }
};

export const registerStateFunction = (sm, state, func) => {
  if (!_.contains(sm.states, state)) {
    return false;
  }
  sm.stateFunction[state] = func;
  return true;
};

export const registerTransitionFunction = (sm, state, func) => {
  if (!_.contains(sm.states, state)) {
    return false;
  }
  sm.transitionFunction[state] = func;
  return true;
};

export const run = (sm, userData) => {
  if (!_.contains(sm.states, sm.currentState)) {
    return false;
  }
  log(sm);
  if (sm.stateFunction[sm.currentState]) {
    const newState = sm.stateFunction[sm.currentState](userData);
    change(sm, newState, userData);
  }
};

export const change = (sm, newState, userData) => {
  if (newState === ERROR) {
    log(sm, 'ERROR');
    sm.currentState = sm.defaultState;
  } else if (newState !== sm.currentState) {
    log(sm, `-> ${newState}`);
    sm.currentState = newState;
    if (sm.transitionFunction[sm.currentState]) {
      sm.transitionFunction[sm.currentState](userData);
    }
  }
};
