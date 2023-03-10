import { useCallback, useEffect, useState } from 'react';

import { Alert, Button, Paper } from '@mantine/core';
import { useInterval } from '@mantine/hooks';

import { Die } from '.';
import { useDiceRoller, usePeer } from '../providers';

import "./Roller.scss";

export const Roller = () => {
  const { isConnected } = usePeer();
  const { currentRoll, diceAreRolling, getRandomDieNumber, myTurn, rollDice } = useDiceRoller();
  const [ rollingValues, setRollingValues ] = useState();

  const interval = useInterval(() => {
    setRollingValues(currentRoll.map(() => getRandomDieNumber()));
  }, 150);

  useEffect(() => {
    if (diceAreRolling) {
      interval.start();
    } else {
      interval.stop();
      setRollingValues(null);
    }
  }, [diceAreRolling]);

  const diceRollHandler = useCallback(() => {
    rollDice();
  }, [rollDice]);
  
  return (
    <>
      { isConnected && myTurn ? <Alert color="green" sx={{ textAlign: "center" }}>Your turn</Alert> : null }
      <Paper p="xs" shadow="xs" radius="sm" className="roller">
        {(rollingValues ?? currentRoll).map((die, i) => {
          return (
            <Die
              colour={i === currentRoll.length -1 ? "black" : "white"}
              key={`die-${i}`}
              value={die}
            />
          );
        })}
        <Button disabled={diceAreRolling} variant="filled" onClick={diceRollHandler}>
          Roll!
        </Button>
      </Paper>
    </>
  );
};
