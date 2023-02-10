import { Box, Modal } from '@mantine/core';
import { usePeer } from '../providers';
import QRCode from "react-qr-code";

export const ConnectionModal = ({ opened = false, onClose = () => {} }) => {
  const { peer } = usePeer();
  const link = `${location.origin}${location.pathname}?hostId=${peer?.id}`;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Connect Devices"
    >
      <p>Scan the QR code or share the link below</p>
      <Box style={{ textAlign: "center" }}>
        <QRCode size={128} value={link} /><br />
        <a href={link} title="Link to connect to this page">{link}</a>
      </Box>
    </Modal>
  );
};
