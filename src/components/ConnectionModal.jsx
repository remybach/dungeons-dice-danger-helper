import QRCode from "react-qr-code";
import { Box, Button, Modal } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { ClipboardCheck, ClipboardCopy } from 'tabler-icons-react';

import { usePeer } from '../providers';

export const ConnectionModal = ({ opened = false, onClose = () => {} }) => {
  const clipboard = useClipboard({ timeout: 2000 });
  const { peer } = usePeer();
  const link = `${location.origin}${location.pathname}?hostId=${peer?.id}`;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Connect Devices"
    >
      <p>Scan the QR code or click the button to copy the link.</p>
      <Box style={{ textAlign: "center" }}>
        <QRCode size={128} value={link} /><br />

        <Button
          color={clipboard.copied ? 'teal' : 'blue'}
          onClick={() => clipboard.copy(link)}
        >
          {clipboard.copied ? <ClipboardCheck /> : <ClipboardCopy />}
        </Button>
      </Box>
    </Modal>
  );
};
