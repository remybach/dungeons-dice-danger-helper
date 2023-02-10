import { useEffect, useState } from 'react';

import { Button, Paper } from '@mantine/core';
import { useInterval } from '@mantine/hooks';

import { Die } from '.';
import { useDiceRoller } from '../providers';

import "./Roller.scss";

export const Roller = () => {
  const { currentRoll, diceAreRolling, getRandomDieNumber, rollDice, updateDie } = useDiceRoller();
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
  
  return (
    <Paper radius={0} p="xs" shadow="xs" className="roller">
      {(rollingValues ?? currentRoll).map((die, i) => {
        return (
          <Die
            colour={i === currentRoll.length -1 ? "black" : "white"}
            key={`die-${i}`}
            onClick={() => updateDie(i)}
            value={die}
          />
        );
      })}
      <Button disabled={diceAreRolling} variant="filled" onClick={rollDice}>
        Roll!
      </Button>
    </Paper>
  );
};