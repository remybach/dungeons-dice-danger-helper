import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useSetState, useTimeout } from "@mantine/hooks";
import { usePeer } from '.';

import { findCombinations, randomIntBetween } from "../helpers";

const DiceRollContext = createContext();

export function DiceRollProvider({children}) {
  const { peer, onUpdate, sendUpdate } = usePeer();
  const [state, setState] = useSetState({
    combinations: {
      black: [],
      white: [],
    },
    currentRoll: [1,2,3,4,5],
    diceAreRolling: false,
    selectedNumber: null,
    myTurn: false,
    readyStates: {}
  });

  const getRandomDieNumber = () => randomIntBetween(1, 6);
  
  const { start: startRolling, clear } = useTimeout(() => {
    const newState = {
      currentRoll: state.currentRoll.map(() => getRandomDieNumber()),
      diceAreRolling: false,
      readyStates: {}
    }
    
    setState(newState);
    sendUpdate(newState);
  }, 1000);

  const rollDice = useCallback(() => {
    const rollingState = { diceAreRolling: true, selectedNumber: null, myTurn: false };

    setState({ ...rollingState, myTurn: true });
    sendUpdate(rollingState);

    startRolling();
  }, [startRolling]);

  const setSelectedNumber = useCallback((num) => 
    setState({ selectedNumber: state.selectedNumber !== num ? num : null })
  , [state.selectedNumber]);

  const toggleReady = useCallback(() => {
    const updatedReadyState = {
      readyStates: {
        ...state.readyStates,
        [peer.id]: !state.readyStates[peer.id]
      }
    };

    setState(updatedReadyState);
    sendUpdate(updatedReadyState);
  }, [state.readyStates, peer]);

  useEffect(() => {
    const whiteDice = state.currentRoll.slice(0, state.currentRoll.length - 1);
    
    // Work out all the different combinations
    const whiteCombos = findCombinations("white", whiteDice);
    const blackCombos = findCombinations("black", state.currentRoll);

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
    myTurn: state.myTurn,
    readyStates: state.readyStates,
    selectedNumber: state.selectedNumber,
    getRandomDieNumber,
    rollDice,
    setSelectedNumber,
    toggleReady
  }), [getRandomDieNumber, rollDice, setSelectedNumber, toggleReady, state]);

  return <DiceRollContext.Provider value={value}>{children}</DiceRollContext.Provider>;
}

export function useDiceRoller() {
  const context = useContext(DiceRollContext);
  if (context === undefined) {
    throw new Error('useDiceRoller must be used within a DiceRollProvider');
  }
  return context;
}
