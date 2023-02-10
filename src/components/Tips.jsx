import { Alert } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { InfoCircle } from 'tabler-icons-react';
import { util } from 'peerjs';

import { randomIntBetween } from "../helpers";

const TIPS = [{
  title: "Highlighting",
  description: "Click/tap on a number to highlight combinations to pair it with. Hit the same number again to deselect."
}, {
  title: "Spotted a missing combination?",
  description: "Some combinations aren't shown when their totals are the same on both sides. For example if you had a pair of 2+3 (5) and 4+2 (6) and another that was 1+4 (5) and 3+3 (6), then only one of those number pairings would be presented since they both give you the same options."
}];

if (!util.supports.data) {
  TIPS.push({
    title: "Hogging",
    description: `If someone is hogging the highlighting feature, you can open the url (${location.href}) on your own device and tap on each die until you match the values (instead of rolling as usual).`
  });
} else {
  TIPS.push({
    title: "Hogging",
    description: `If someone is hogging the highlighting feature, click/tap the icon next to the roll button to share a link that will synchronise your rolls (both ways)!`
  });
}

export const Tips = () => {
  const [selectedTip, setSelectedTip] = useState(randomIntBetween(0, TIPS.length - 1));

  const interval = useInterval(() => {
    let nextTip = selectedTip;

    while (nextTip === selectedTip) {
      nextTip = randomIntBetween(0, TIPS.length - 1);
    }

    setSelectedTip(nextTip);
  }, 10000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);
  
  return (
    <Alert icon={<InfoCircle size={16} />} title={`Tip: ${TIPS[selectedTip].title}`}>
      {TIPS[selectedTip].description}
    </Alert>
  );
};
