/* global describe, it */

import * as Tripod from '../src/Tripod';
import Victor from 'Victor';

import assert from 'assert';

describe('Tripod', () => {

  it('retrieves the legs', () => {
    const l1 = Victor(1, 1);
    const l2 = Victor(1, 4);
    const l3 = Victor(4, 1);
    const t = Tripod.create(l1, l2, l3);
    const result = Tripod.legs(t);

    assert.equal(result.leg1.x, l1.x, `Leg1 X value should be ${l1.x}, not ${result.leg1.x}`);
    assert.equal(result.leg1.y, l1.y, `Leg1 Y value should be ${l1.y}, not ${result.leg1.y}`);

    assert.equal(result.leg2.x, l2.x, `Leg2 X value should be ${l2.x}, not ${result.leg2.x}`);
    assert.equal(result.leg2.y, l2.y, `leg2 Y value should be ${l2.y}, not ${result.leg2.y}`);

    assert.equal(result.leg3.x, l3.x, `Leg3 X value should be ${l3.x}, not ${result.leg3.x}`);
    assert.equal(result.leg3.y, l3.y, `Leg3 Y value should be ${l3.y}, not ${result.leg3.y}`);

  });

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
    const expected = 'leg1';
    const result = Tripod.movePoint(t, target);

    assert.equal(result, expected, `Move point should be ${expected}, not ${result}`);
  });
});
