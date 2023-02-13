import { test, expect } from "vitest";
import { findCombinations } from "./helpers";

test("Get the correct combinations given 5 rolled dice using just the white dice", () => {
  const dice = [1,2,3,4,5];
  const combos = findCombinations("white", dice);
  
  expect(JSON.stringify(combos[0])).to.equal(JSON.stringify(
    { indices: [[0,1], [2,3]], totals: [3,7] }
  ));
  expect(JSON.stringify(combos[1])).to.equal(JSON.stringify(
    { indices: [[0,2], [1,3]], totals: [4,6] }
  ));
  expect(JSON.stringify(combos[2])).to.equal(JSON.stringify(
    { indices: [[0,3], [1,2]], totals: [5,5] }
  ));
});

test("Get the correct combinations given 5 rolled dice using the black die as well", () => {
  const dice = [1,2,3,4,5];
  const combos = findCombinations("black", dice);
  
  expect(JSON.stringify(combos[0])).to.equal(JSON.stringify(
    { indices: [[0,4], [1,2]], totals: [6,5] }
  ));
  expect(JSON.stringify(combos[1])).to.equal(JSON.stringify(
    { indices: [[0,4], [1,3]], totals: [6,6] }
  ));
  expect(JSON.stringify(combos[2])).to.equal(JSON.stringify(
    { indices: [[1,4], [0,2]], totals: [7,4] }
  ));
  expect(JSON.stringify(combos[3])).to.equal(JSON.stringify(
    { indices: [[1,4], [0,3]], totals: [7,5] }
  ));
  expect(JSON.stringify(combos[4])).to.equal(JSON.stringify(
    { indices: [[2,4], [0,1]], totals: [8,3] }
  ));
  expect(JSON.stringify(combos[5])).to.equal(JSON.stringify(
    { indices: [[2,4], [0,3]], totals: [8,5] }
  ));
  expect(JSON.stringify(combos[6])).to.equal(JSON.stringify(
    { indices: [[3,4], [0,1]], totals: [9,3] }
  ));
  expect(JSON.stringify(combos[7])).to.equal(JSON.stringify(
    { indices: [[3,4], [0,2]], totals: [9,4] }
  ));
});

test("Don't show duplicate results", () => {
  const dice = [5,3,5,2,4];
  const combos = findCombinations("white", dice);
  
  // Because this is effectively the same as the last one
  expect(JSON.stringify(combos[0])).not.to.equal(JSON.stringify(
    { indices: [[0,1], [2,3]], totals: [8,7] }
  ));
  expect(JSON.stringify(combos[0])).to.equal(JSON.stringify(
    { indices: [[0,2], [1,3]], totals: [10,5] }
  ));
  expect(JSON.stringify(combos[1])).to.equal(JSON.stringify(
    { indices: [[0,3], [1,2]], totals: [7,8] }
  ));
});
