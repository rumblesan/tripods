/* global describe, it */

import * as Tripod from '../src/Tripod';
import Victor from 'Victor';

import assert from 'assert';

describe('Tripod', () => {

  it('finds the centre', () => {
    const t = Tripod.create(
      Victor(1, 1),
      Victor(1, 4),
      Victor(4, 1)
    );
    const expected = Victor(2, 2);
    const result = Tripod.centre(t);

    assert.equal(result.x, expected.x, `X value should be ${expected.x}`);
    assert.equal(result.y, expected.y, `Y value should be ${expected.y}`);
  });

  it('calculates the area', () => {
    const t = Tripod.create(
      Victor(1, 1),
      Victor(1, 4),
      Victor(4, 1)
    );
    const expected = 4.5;
    const result = Tripod.area(t);

    assert.equal(result, expected, `Area should be ${expected}`);
  });
});
