/* global describe, it */

import * as Body from '../../src/app/Tripod/Body';
import Victor from 'victor';

import assert from 'assert';

describe('Tripod Body', () => {

  it('retrieves the legs', () => {
    const l1 = Victor(1, 1);
    const l2 = Victor(1, 4);
    const l3 = Victor(4, 1);
    const body = Body.create(l1, l2, l3);
    const result = Body.legs(body);

    assert.equal(result[0].position.x, l1.x, `Leg1 X value should be ${l1.x}, not ${result[0].position.x}`);
    assert.equal(result[0].position.y, l1.y, `Leg1 Y value should be ${l1.y}, not ${result[0].position.y}`);
    assert.equal(result[0].name, 'leg1', `Leg1 name should be 'leg1', not ${result[0].name}`);

    assert.equal(result[1].position.x, l2.x, `Leg2 X value should be ${l2.x}, not ${result[1].position.x}`);
    assert.equal(result[1].position.y, l2.y, `Leg2 Y value should be ${l2.y}, not ${result[1].position.y}`);
    assert.equal(result[1].name, 'leg2', `Leg2 name should be 'leg2', not ${result[1].name}`);

    assert.equal(result[2].position.x, l3.x, `Leg3 X value should be ${l3.x}, not ${result[2].position.x}`);
    assert.equal(result[2].position.y, l3.y, `Leg3 Y value should be ${l3.y}, not ${result[2].position.y}`);
    assert.equal(result[2].name, 'leg3', `Leg3 name should be 'leg3', not ${result[2].name}`);

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

  it('calculates the leg to move', () => {
    const body = Body.create(
      Victor(0, 0),
      Victor(0, 3),
      Victor(3, 0)
    );
    const target = Victor(3, 3);
    const expected = 'leg1';
    const result = Body.farthestLeg(body, target);

    assert.equal(result, expected, `Farthest leg should be ${expected}, not ${result}`);
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
