import { useEffect, useState } from 'react';

import { Box, Button, Paper, Tooltip } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { ArrowsTransferDown, ArrowsTransferUp } from 'tabler-icons-react';
import { util } from 'peerjs';

import { ConnectionModal, Die } from '../components';
import { usePeer, useDiceRoller } from '../providers';

import "./AppHeader.scss";

export const AppHeader = () => {
  const { currentRoll, diceAreRolling, getRandomDieNumber, rollDice, updateDie } = useDiceRoller();
  const { hostId, isConnected, isClient } = usePeer();
  const [ rollingValues, setRollingValues ] = useState();
  const [modalOpened, setModalOpened] = useState(false);

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
    <Paper radius={0} p="xs" shadow="xs" className="app-header">
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
      {util.supports.data ? (
        <Button variant="subtle" onClick={() => setModalOpened(true)}>
          {!isClient ? (
            <ArrowsTransferUp color={!isConnected ? "#228be6" : "#51CF66"} />
          ) : (
            <Tooltip label={!isConnected ? `Unable to connect to: ${hostId}` : `Connected to: ${hostId}`}>
              {/* Using Box here because the icon doesn't have a ref which is required for children of Tooltip */}
              <Box>
                <ArrowsTransferDown color={!isConnected ? "#FF922B" : "#51CF66"}/>
              </Box>
            </Tooltip>
          )}
        </Button>
      ) : null}
      <ConnectionModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </Paper>
  );
};
