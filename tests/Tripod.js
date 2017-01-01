/* global describe, it */

import * as Tripod from '../src/Tripod';
import Victor from 'Victor';

import assert from 'assert';

describe('Tripod', () => {

  it('finds the centre', () => {
    const t = Tripod.create(
      new Victor(1, 1),
      new Victor(1, 4),
      new Victor(4, 1)
    );
    const expected = new Victor(2, 2);
    const result = Tripod.centre(t);

    assert.equal(result.x, expected.x, 'X values should match');
    assert.equal(result.y, expected.y, 'Y values should match');
  });

});
