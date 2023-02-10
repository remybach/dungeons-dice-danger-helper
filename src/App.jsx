import { useEffect } from 'react';
import { Center, Loader } from '@mantine/core';

import { AppHeader, Dice, Tips } from "./components";
import { useDiceRoller, usePeer } from "./providers";

export default function App() {
  const { diceAreRolling } = useDiceRoller();
  const { connect, createPeer, isOpened } = usePeer();

  useEffect(() => {
    if (isOpened) connect();
  }, [isOpened]);
  
  useEffect(() => {
    createPeer();
  }, []);
  
  return (
    <>
      <AppHeader />
      { diceAreRolling ? (
        <Center m="sm"><Loader variant="bars" /></Center>
      ) : (
        <>
          <Dice colour="white" />
          <Dice colour="black" />
          <Tips />
        </>
      )}
    </>
  );
}
