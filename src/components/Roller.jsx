import { useCallback, useEffect, useState } from 'react';

import { Alert, Button, Checkbox, Paper } from '@mantine/core';
import { useInterval } from '@mantine/hooks';

import { Die } from '.';
import { useDiceRoller, usePeer } from '../providers';

import "./Roller.scss";

export const Roller = () => {
  const { peer, isConnected } = usePeer();
  const { currentRoll, diceAreRolling, getRandomDieNumber, myTurn, readyStates, rollDice, toggleReady } = useDiceRoller();
  const [ rollingValues, setRollingValues ] = useState();
  const [ everyoneReady, setEveryoneReady ] = useState(true);

  const interval = useInterval(() => {
    setRollingValues(currentRoll.map(() => getRandomDieNumber()));
  }, 150);

  useEffect(() => {
    if (diceAreRolling) {
      if (isConnected) {
        setEveryoneReady(false);
      }
      interval.start();
    } else {
      interval.stop();
      setRollingValues(null);
    }
  }, [diceAreRolling]);

  const diceRollHandler = useCallback(() => {
    if (isConnected) {
      setEveryoneReady(false);
    }
    rollDice();
  }, [rollDice]);

  useEffect(() => {
    if (!peer) return;

    let everyoneIsReady = true;

    for (let peerId of [peer.id, ...Object.keys(peer.connections)]) {
      if (!readyStates[peerId]) {
        everyoneIsReady = false;
      }
    }

    // Avoid needless state updates
    if (everyoneIsReady) {
      setEveryoneReady(true);
    }
  }, [peer, readyStates]);
  
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
        { everyoneReady ? (
          <Button disabled={diceAreRolling} variant="filled" onClick={diceRollHandler}>
            Roll!
          </Button>
        ) : (
          <Checkbox
            label="Ready"
            onChange={toggleReady}
            value={!!readyStates[peer.id]}
          />
        )}
      </Paper>
    </>
  );
};
