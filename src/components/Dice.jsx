import { Card, Text } from '@mantine/core';
import { Plus, Equal } from 'tabler-icons-react';

import { useDiceRoller } from '../providers';

import "./Dice.scss";
import { Die } from './Die';

const DiceCombo = ({ indices, totals }) => {
  const { currentRoll, setSelectedNumber, selectedNumber } = useDiceRoller();
  
  return (
    <div className="dice-combinations">
      {(indices || []).map((numberIndices, i) => {
        const classNames = ["dice-combination"];
        
        if (selectedNumber === totals[i]) {
          classNames.push("is-selected");
        }
        if (selectedNumber && selectedNumber !== totals[0] && selectedNumber !== totals[1]) {
          classNames.push("is-semi-transparent");
        }
        
        return (
          <div key={`combos-${i}`} className={classNames.join(" ")} onClick={() => setSelectedNumber(totals[i])}>
            <Die colour={numberIndices[0] === currentRoll.length - 1 ? "black" : "white"} value={currentRoll[numberIndices[0]]} />
            <Plus className="dice-combination-symbol" />
            <Die colour={numberIndices[1] === currentRoll.length - 1 ? "black" : "white"} value={currentRoll[numberIndices[1]]} />
            <Equal className="dice-combination-symbol" />
            <Text className="dice-combination-result">{totals[i]}</Text>
          </div>
        );
      }
      )}
    </div>
  );
};

export const Dice = ({ colour = "white" }) => {
  const { combinations } = useDiceRoller();
  const combos = combinations[colour];

  return (
    <Card shadow="sm" p="lg" radius="sm" withBorder className={`dice dice-${colour}`}>
      {combos?.length > 0 ? combos.map((combo, i) => 
        <DiceCombo key={`combo-${i}`} indices={combo.indices} totals={combo.totals} />
      ) : (
        <Text fz="md">No combinations</Text>
      )}
    </Card>
  );
};
