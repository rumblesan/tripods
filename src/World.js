/**
   World functions
 */

import _ from 'underscore';

export const create = () => {
  return {
    tripods: [],
    food: []
  };
};

export const addTripod = (world, tripod) => {
  world.tripods.push(tripod);
};

export const addFood = (world, food) => {
  world.food.push(food);
};

export const eatFood = (world, food) => {
  const idx = _.indexOf(world.food, food);
  if (idx > -1) {
    world.food.splice(idx, 1);
  }
};
