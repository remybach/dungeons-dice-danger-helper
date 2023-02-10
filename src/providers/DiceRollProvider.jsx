import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useSetState, useTimeout } from "@mantine/hooks";
import { usePeer } from '.';

import { randomIntBetween } from "../helpers";

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

function findCombinations(comboMatrix, numbers) {
  let combinations = comboMatrix.map(combo => {
      const firstPair = combo[0].map(i => numbers[i]);
      const secondPair = combo[1].map(i => numbers[i]);

      // Get the totals in numerical order to help with finding duplicate results.
      const totals = [
        firstPair[0] + firstPair[1],
        secondPair[0] + secondPair[1]
      ];
      return {
        indices: [[combo[0][0], combo[0][1]], [combo[1][0], combo[1][1]]],
        totals,
      };
  })
  .sort((a, b) => a.totals.join(',').localeCompare(b.totals.join(',')))
  
  combinations = combinations.reduce((prev, current, i) => {
    // Don't add this one if the previous one had the same totals
    if (prev.length && prev[prev.length -1].totals.sort().join(",") === current.totals.sort().join(","))
      return prev;

    return [
      ...prev,
      current
    ]
  }, []);

  return combinations;
}

export function DiceRollProvider({children}) {
  const { onUpdate, sendUpdate } = usePeer();
  const [state, setState] = useSetState({
    combinations: {
      black: [],
      white: [],
    },
    currentRoll: [1,2,3,4,5],
    diceAreRolling: false,
    selectedNumber: null
  });

  const getRandomDieNumber = () => randomIntBetween(1, 6);
  
  const { start: startRolling, clear } = useTimeout(() => {
    const newState = {
      currentRoll: state.currentRoll.map(() => getRandomDieNumber()),
      diceAreRolling: false
    }
    
    setState(newState);
    sendUpdate(newState);
  }, 1000);

  const rollDice = useCallback(() => {
    const rollingState = { diceAreRolling: true, selectedNumber: null };

    setState(rollingState);
    sendUpdate(rollingState);

    startRolling();
  }, [startRolling]);

  const setSelectedNumber = useCallback((num) => 
    setState({ selectedNumber: state.selectedNumber !== num ? num : null })
  , [state.selectedNumber]);

  const updateDie = (index) => {
    const newRoll = [...state.currentRoll];
    newRoll[index] = (state.currentRoll[index] + 1) % 6 || 6;
    const newState = { currentRoll: newRoll };
    setState(newState);
    sendUpdate(newState);
  };

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

  useEffect(() => {
    // Bind setState to the PeerContextProvider so that incoming state updates get applied here.
    onUpdate(setState);
  }, []);

  const value = useMemo(() => ({
    combinations: state.combinations,
    currentRoll: state.currentRoll,
    diceAreRolling: state.diceAreRolling,
    selectedNumber: state.selectedNumber,
    getRandomDieNumber,
    rollDice,
    setSelectedNumber,
    updateDie
  }), [rollDice, setSelectedNumber, state]);

  return <DiceRollContext.Provider value={value}>{children}</DiceRollContext.Provider>;
}

export function useDiceRoller() {
  const context = useContext(DiceRollContext);
  if (context === undefined) {
    throw new Error('useDiceRoller must be used within a DiceRollProvider');
  }
  return context;
}
