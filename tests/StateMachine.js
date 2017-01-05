/* global describe, it */

import _ from 'underscore';

import * as StateMachine from '../src/app/StateMachine';

import assert from 'assert';

describe('StateMachine', () => {

  it('should run basic state functions', () => {
    const data = {
      value: 0
    };
    const States = {
      ADD: 'ADD',
      SUB: 'SUB'
    };
    const sm = StateMachine.create(_.values(States));
    StateMachine.registerStateFunction(sm, States.ADD, (userData) => {
      userData.value += 1;
      return States.ADD;
    });
    StateMachine.registerStateFunction(sm, States.SUB, (userData) => {
      userData.value -= 1;
      return States.SUB;
    });
    StateMachine.run(sm, data); // Runs ADD
    assert.equal(data.value, 1, `Value should be 1, not ${data.value}`);
    StateMachine.run(sm, data); // Runs ADD
    assert.equal(data.value, 2, `Value should be 2, not ${data.value}`);
    StateMachine.run(sm, data); // Runs ADD
    assert.equal(data.value, 3, `Value should be 3, not ${data.value}`);
    StateMachine.change(sm, States.SUB, data); // Runs nothing
    StateMachine.run(sm, data); // Runs SUB
    assert.equal(data.value, 2, `Value should be 2, not ${data.value}`);
    StateMachine.run(sm, data); // Runs SUB
    assert.equal(data.value, 1, `Value should be 1, not ${data.value}`);
  });


  it('should run transition functions', () => {
    const data = {
      value: 0,
      transitions: {
        toAdd: 0,
        toSub: 0,
      }
    };
    const States = {
      ADD: 'ADD',
      SUB: 'SUB'
    };
    const sm = StateMachine.create(_.values(States));
    StateMachine.registerStateFunction(sm, States.ADD, (userData) => {
      userData.value += 1;
      return States.ADD;
    });
    StateMachine.registerTransitionFunction(sm, States.ADD, (userData) => {
      userData.transitions.toAdd += 1;
    });
    StateMachine.registerStateFunction(sm, States.SUB, (userData) => {
      userData.value -= 1;
      return States.SUB;
    });
    StateMachine.registerTransitionFunction(sm, States.SUB, (userData) => {
      userData.transitions.toSub += 1;
    });
    StateMachine.run(sm, data); // Runs ADD
    assert.equal(data.value, 1, `Value should be 1, not ${data.value}`);
    StateMachine.run(sm, data); // Runs ADD
    assert.equal(data.value, 2, `Value should be 2, not ${data.value}`);
    StateMachine.run(sm, data); // Runs ADD
    assert.equal(data.value, 3, `Value should be 3, not ${data.value}`);
    StateMachine.change(sm, States.SUB, data); // Runs nothing
    assert.equal(data.transitions.toSub, 1, `Transitions to SUB should be 1, not ${data.transitions.toSub}`);
    StateMachine.run(sm, data); // Runs SUB
    assert.equal(data.value, 2, `Value should be 2, not ${data.value}`);
    StateMachine.run(sm, data); // Runs SUB
    assert.equal(data.value, 1, `Value should be 1, not ${data.value}`);
    StateMachine.change(sm, States.ADD, data); // Runs nothing
    assert.equal(data.transitions.toAdd, 1, `Transitions to ADD should be 1, not ${data.transitions.toADD}`);
    StateMachine.change(sm, States.ADD, data); // Runs nothing
    assert.equal(data.transitions.toAdd, 1, `Transitions to ADD should still be 1, not ${data.transitions.toADD}`);
  });

});
