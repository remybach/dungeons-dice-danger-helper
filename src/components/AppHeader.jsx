import { useState } from 'react';

import { Avatar, Box, Button, Group, Header, Text, Tooltip } from '@mantine/core';
import { ArrowsTransferDown, ArrowsTransferUp } from 'tabler-icons-react';
import { util } from 'peerjs';

import "./AppHeader.scss";

import { ConnectionModal } from '.';
import { usePeer } from '../providers';

export const AppHeader = () => {
  const { hostId, isConnected, isClient } = usePeer();
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <Header height={60} p="xs" className="app-header">
      <Group noWrap={true}>
        <Avatar src="/ddnd-logo.png" alt="Dice, Dungeons & Danger Logo" />
        <Text>Dice, Dungeons & Danger Helper</Text>
      </Group>
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
    </Header>
  );
};
