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

    assert.equal(result.x, expected.x, `X value should be ${expected.x}, not ${result.x}`);
    assert.equal(result.y, expected.y, `Y value should be ${expected.y}, not ${result.y}`);
  });

  it('calculates the area', () => {
    const t = Tripod.create(
      Victor(1, 1),
      Victor(1, 4),
      Victor(4, 1)
    );
    const expected = 4.5;
    const result = Tripod.area(t);

    assert.equal(result, expected, `Area should be ${expected}, not ${result}`);
  });

  it('calculates the point to move', () => {
    const t = Tripod.create(
      Victor(0, 0),
      Victor(0, 3),
      Victor(3, 0)
    );
    const target = Victor(3, 3);
    const expected = 'p1';
    const result = Tripod.movePoint(t, target);

    assert.equal(result, expected, `Move point should be ${expected}, not ${result}`);
  });
});
