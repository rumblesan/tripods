/* global describe, it */

import * as Body from '../../src/app/Tripod/Body';
import Victor from 'victor';

import assert from 'assert';

describe('Tripod Body', () => {

  it('can be created', () => {
    const leg1 = Victor(0, 0);
    const leg2 = Victor(0, 3);
    const leg3 = Victor(3, 0);
    const body = Body.create(leg1, leg2, leg3);

    assert.equal(body.leg1.x, leg1.x, `Leg 1 X value should be ${leg1.x}, not ${body.leg1.x}`);
    assert.equal(body.leg1.y, leg1.y, `Leg 1 Y value should be ${leg1.y}, not ${body.leg1.y}`);

    assert.equal(body.leg2.x, leg2.x, `Leg 2 X value should be ${leg2.x}, not ${body.leg2.x}`);
    assert.equal(body.leg2.y, leg2.y, `Leg 2 Y value should be ${leg2.y}, not ${body.leg2.y}`);

    assert.equal(body.leg3.x, leg3.x, `Leg 3 X value should be ${leg3.x}, not ${body.leg3.x}`);
    assert.equal(body.leg3.y, leg3.y, `Leg 3 Y value should be ${leg3.y}, not ${body.leg3.y}`);
  });

  it('calculates the farthest leg from a point', () => {
    const body = Body.create(
      Victor(0, 0),
      Victor(0, 3),
      Victor(3, 0)
    );
    const target = Victor(3, 3);
    const expected = body.leg1;
    const result = Body.farthestLeg(body, target);

    assert.equal(result.x, expected.x, `Farthest leg X value should be ${expected.x}, not ${result.x}`);
    assert.equal(result.y, expected.y, `Farthest leg Y value should be ${expected.y}, not ${result.y}`);
  });

  it('finds the centre', () => {
    const body = Body.create(
      Victor(1, 1),
      Victor(1, 4),
      Victor(4, 1)
    );
    const expected = Victor(2, 2);
    const result = Body.centre(body);

    assert.equal(result.x, expected.x, `X value should be ${expected.x}, not ${result.x}`);
    assert.equal(result.y, expected.y, `Y value should be ${expected.y}, not ${result.y}`);
  });

  it('calculates the area', () => {
    const body = Body.create(
      Victor(1, 1),
      Victor(1, 4),
      Victor(4, 1)
    );
    const expected = 4.5;
    const result = Body.area(body);

    assert.equal(result, expected, `Area should be ${expected}, not ${result}`);
  });

  it('correctly finds if a point is inside the tripod base', () => {
    const body = Body.create(
      Victor(0, 0),
      Victor(0, 3),
      Victor(3, 0)
    );
    const point1 = Victor(1, 1);
    const point2 = Victor(0, -1);

    assert(Body.contains(body, point1), 'Body should contain point1');
    assert(!Body.contains(body, point2), 'Body should not contain point1');
  });
});
