/* global describe, it */

import * as Food from '../src/app/Food';
import Victor from 'victor';

import assert from 'assert';

describe('Food', () => {

  it('can be created', () => {
    const pos = Victor(100, 100);
    const food = Food.create(pos);

    assert.equal(food.position.x, pos.x, `Food X position should be ${pos.x}, not ${food.position.x}`);
    assert.equal(food.position.y, pos.y, `Food Y position should be ${pos.y}, not ${food.position.y}`);
  });

});

