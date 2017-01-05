/**
   World functions
 */

import _ from 'underscore';

export const create = () => {
  return {
    tripods: [],
    food: {}
  };
};

export const addTripod = (world, tripod) => {
  world.tripods.push(tripod);
};

export const addFood = (world, food) => {
  const uID = _.uniqueId('food');
  food.uID = uID;
  console.log('adding food', food);
  world.food[uID] = food;
};

export const eatFood = (world, food) => {
  console.log('eating food', food);
  if (world.food[food.uID]) {
    delete(world.food[food.uID]);
  }
};

export const closestFood = (world, position) => {
  if (_.isEmpty(world.food)) return null;
  return _.min(world.food, (f) => position.distance(f.position));
};
