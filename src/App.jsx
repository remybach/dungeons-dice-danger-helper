import { Center, Loader } from '@mantine/core';

import { AppHeader, Dice } from "./components";
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
          {/* TODO: */}
          {/* <Alert icon={<IconAlertCircle size={16} />} title="Tip">
            Some tips here: duplicates have been removed, click to highlight
          </Alert> */}
        </>
      )}
    </>
  );
}