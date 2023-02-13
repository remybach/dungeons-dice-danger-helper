// https://stackoverflow.com/a/7228322
export const randomIntBetween = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const comboMatrix = {
  white: [
    [[0,1], [2,3]],
    [[0,2], [1,3]],
    [[0,3], [1,2]],
  ],
  black: [
    [[0,4], [1,2]],
    [[0,4], [1,3]],
    [[1,4], [0,2]],
    [[1,4], [0,3]],
    [[2,4], [0,1]],
    [[2,4], [0,3]],
    [[3,4], [0,1]],
    [[3,4], [0,2]],
  ]
};

export const findCombinations = (dieColour, numbers) => {
  let combinations = comboMatrix[dieColour].map(combo => {
      const firstPair = combo[0].map(i => numbers[i]);
      const secondPair = combo[1].map(i => numbers[i]);

      const totals = [
        firstPair[0] + firstPair[1],
        secondPair[0] + secondPair[1]
      ];
      return {
        indices: [[combo[0][0], combo[0][1]], [combo[1][0], combo[1][1]]],
        totals,
      };
  })
  // Get the totals in numerical order to help with finding duplicate results.
  .sort((a, b) => a.totals.join(',').localeCompare(b.totals.join(',')));
  
  combinations = combinations.reduce((prev, current, i) => {
    // Don't add this one if the previous one had the same totals
    if (prev.length && prev[prev.length -1].totals.sort().join(",") === current.totals.sort().join(","))
      return prev;

    return [
      ...prev,
      current
    ]
  }, [])
  // Re-calc the totals in the correct order.
  .map(combo => ({
    ...combo,
    totals: combo.indices.map(indexes => numbers[indexes[0]] + numbers[indexes[1]])
  }));

  return combinations;
}