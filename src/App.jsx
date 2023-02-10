import { useEffect } from 'react';
import { AppShell, Center, Loader } from '@mantine/core';

import { AppHeader, Dice, Roller, Tips } from "./components";
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
    <AppShell
      padding="xs"
      header={<AppHeader />}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <div style={{ maxWidth: "470px", margin: "0 auto" }}>
        <Roller />
        { diceAreRolling ? (
          <Center m="sm"><Loader variant="bars" /></Center>
        ) : (
          <>
            <Dice colour="white" />
            <Dice colour="black" />
          </>
        )}
      </div>
      <Tips />
    </AppShell>
  );
}
