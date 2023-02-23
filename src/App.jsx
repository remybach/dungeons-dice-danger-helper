import { useEffect } from 'react';
import { AppShell, Skeleton } from '@mantine/core';

import { AppFooter, AppHeader, Dice, Roller, Tips } from "./components";
import { useDiceRoller, usePeer } from "./providers";

import "./App.scss";

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
      className="app"
      padding="xs"
      footer={<AppFooter />}
      header={<AppHeader />}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <div style={{ maxWidth: "470px", margin: "0 auto" }}>
        <Roller />
        { diceAreRolling ? (
          <>
            <Skeleton height={192} my={16} p="lg" radius="md" />
            <Skeleton height={192} my={16} p="lg" radius="md" />
          </>
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
