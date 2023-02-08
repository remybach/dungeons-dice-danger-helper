import { Center, Loader } from '@mantine/core';

import { AppHeader, Dice, Tips } from "./components";
import { useDiceRoller } from "./providers";

export default function App() {
  const { diceAreRolling } = useDiceRoller();
  
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
