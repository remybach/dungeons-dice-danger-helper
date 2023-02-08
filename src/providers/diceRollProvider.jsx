import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useSetState, useTimeout } from '@mantine/hooks';

const DiceRollContext = createContext();

const WHITE_DIE_COMBINATIONS = [
  [[0,1], [2,3]],
  [[0,2], [1,3]],
  [[0,3], [1,2]],
];

const BLACK_DIE_COMBINATIONS = [
  [[0,4], [1,2]],
  [[0,4], [1,3]],
  [[1,4], [0,2]],
  [[1,4], [0,3]],
  [[2,4], [0,1]],
  [[2,4], [0,3]],
  [[3,4], [0,1]],
  [[3,4], [0,2]],
];

// https://stackoverflow.com/a/7228322
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function findCombinations(comboMatrix, numbers) {
  let combinations = comboMatrix.map(combo => {
      const firstPair = combo[0].map(i => numbers[i]);
      const secondPair = combo[1].map(i => numbers[i]);

      // TODO: Check totals calculation. Seems screwy.
      // Get the totals in numerical order to help with finding duplicate results.
      const totals = [Number(firstPair[0]) + Number(firstPair[1]), Number(secondPair[0]) + Number(secondPair[1])].sort();
      return {
        indices: [[combo[0][0], combo[0][1]], [combo[1][0], combo[1][1]]],
        totals,
      };
  })
  .sort((a, b) => a.totals.join(',').localeCompare(b.totals.join(',')))
  
  combinations = combinations.reduce((prev, current, i) => {
    // Don't add this one if the previous one had the same totals
    if (prev.length && prev[prev.length -1].totals.join(",") === current.totals.join(","))
      return prev;

    return [
      ...prev,
      current
    ]
  }, []);

  return combinations;
}

function DiceRollProvider({children}) {
  const [state, setState] = useSetState({
    combinations: {
      black: [],
      white: [],
    },
    // currentRoll: [1,2,3,4,5],
    currentRoll: [1,4,3,1,2],
    diceAreRolling: false
  });

  const getRandomDieNumber = () => randomIntFromInterval(1, 6);
  
  const { start: startRolling, clear } = useTimeout(() => {
    setState({
      currentRoll: state.currentRoll.map(() => getRandomDieNumber()),
      diceAreRolling: false
    });
  }, 1000);

  const rollDice = useCallback(() => {
    setState({ diceAreRolling: true });

    startRolling();
  }, [startRolling]);

  useEffect(() => {
    const whiteDice = state.currentRoll.slice(0, state.currentRoll.length - 1);
    
    // Work out all the different combinations
    const whiteCombos = findCombinations(WHITE_DIE_COMBINATIONS, whiteDice);
    const blackCombos = findCombinations(BLACK_DIE_COMBINATIONS, state.currentRoll);

    setState({
      combinations: {
        white: whiteCombos,
        black: blackCombos,
      }
    });
  }, [state.currentRoll]);

  const value = useMemo(() => ({
    combinations: state.combinations,
    currentRoll: state.currentRoll,
    diceAreRolling: state.diceAreRolling,
    getRandomDieNumber,
    rollDice
  }), [rollDice, state]);

  return <DiceRollContext.Provider value={value}>{children}</DiceRollContext.Provider>;
}

function useDiceRoller() {
  const context = useContext(DiceRollContext);
  if (context === undefined) {
    throw new Error('useDiceRoller must be used within a DiceRollProvider');
  }
  return context;
}

export { DiceRollProvider, useDiceRoller };