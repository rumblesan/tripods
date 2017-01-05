/* global describe, it */

import Victor from 'victor';
import _ from 'underscore';

import * as World from '../src/app/World';
import * as Tripod from '../src/app/Tripod';
import * as Food from '../src/app/Food';

import assert from 'assert';

describe('Tripod Body', () => {

  it('can be created', () => {
    const world = World.create();
    assert.equal(_.size(world.tripods), 0,
                 'World should have no tripods when created');
    assert.equal(_.size(world.food), 0,
                 'World should have no food when created');
  });

  it('can have a tripod added', () => {
    const world = World.create();
    const tripod = Tripod.create(
      Victor(0, 0),
      Victor(0, 3),
      Victor(3, 0)
    );
    World.addTripod(world, tripod);
    assert.equal(_.size(world.tripods), 1, 'World should have one tripod');
  });

  it('can have food added', () => {
    const world = World.create();

    const food1 = Food.create(Victor(0, 0));
    World.addFood(world, food1);
    assert.equal(_.size(world.food), 1, 'World should have one food');

    const food2 = Food.create(Victor(1, 1));
    World.addFood(world, food2);
    assert.equal(_.size(world.food), 2, 'World should have two food');
  });

  it('can have food eaten', () => {
    const world = World.create();

    const food1 = Food.create(Victor(0, 0));
    World.addFood(world, food1);
    assert.equal(_.size(world.food), 1, 'World should have one food');

    const food2 = Food.create(Victor(1, 1));
    World.addFood(world, food2);
    assert.equal(_.size(world.food), 2, 'World should have two food');

    World.eatFood(world, food1);
    assert.equal(_.size(world.food), 1, 'World should have one food');

    World.eatFood(world, food2);
    assert.equal(_.size(world.food), 0, 'World should have no food');
  });

  it('can return the closest piece of food', () => {
    const world = World.create();

    const food1 = Food.create(Victor(0, 0));
    const food2 = Food.create(Victor(3, 3));
    World.addFood(world, food1);
    World.addFood(world, food2);

    const pos = Victor(1, 1);
    const cf = World.closestFood(world, pos);
    assert.equal(cf.position.x, food1.position.x,
                 `Food X position should be ${food1.position.x} not ${cf.position.x}`);
    assert.equal(cf.position.y, food1.position.y,
                 `Food Y position should be ${food1.position.y} not ${cf.position.y}`);
  });

  it('returns null if theres no food', () => {
    const world = World.create();
    assert.equal(World.closestFood(world, Victor(0, 0)), null,
                 'Should return null if theres no food');
  });


});
