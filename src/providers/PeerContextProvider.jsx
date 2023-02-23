import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Peer from "peerjs";
import { useSetState } from "@mantine/hooks";

export const PeerContext = createContext(undefined);

export function PeerContextProvider({
  children,
  peerOptions
}) {
  const hostIdMatch = location.search.match(/hostId=([^&]+)/);
  const hostId = hostIdMatch && hostIdMatch.length > 1 ? hostIdMatch[1] : null;
  
  const [peer, setPeer] = useState(undefined);
  const [state, setState] = useSetState({
    isOpened: false,
    isConnected: false,
    isClient: false,
    onUpdate: undefined,
  });
  
  function createPeer(peerOptions) {
    setState({ isClient: !!hostId });
    setPeer(new Peer({ debug: 2 }));
  }

  const onUpdateCallback = useCallback((data) => {
    if (state.onUpdate) state.onUpdate(data);
  }, [state.onUpdate]);

  const connect = useCallback((peerConnectionOptions) => {
    if (peer === undefined || !hostId) return;

    const newConnection = peer.connect(hostId, peerConnectionOptions);

    // This is needed to send from the host -> client
    newConnection.on("data", onUpdateCallback);
    newConnection.on("open", () => {
      setState({ isConnected: true });
    });
  }, [peer, onUpdateCallback]);

  const disconnect = useCallback(() => {
    if (peer === undefined) return;

    peer.disconnect();
    peer.destroy();
    setPeer(undefined);
  }, [peer]);

  function setOnUpdate(onUpdate) {
    setState({ onUpdate });
  }

  const sendUpdate = useCallback((data, currentConnectionId) => {
    for (let connectionKey in peer.connections) {
      for (let connection of peer.connections[connectionKey]) {
        if (connection.connectionId !== currentConnectionId) {
          connection.send(data);
        }
      }
    }
  }, [peer]);

  useEffect(() => {
    if (peer === undefined) return;

    const connectedHandler = (conn) => {
      console.info("Connected!");
      
      // This is needed to send from the client -> host
      conn.on("data", (data) => {
        onUpdateCallback(data);
        sendUpdate(data, conn.connectionId);
      });
      
      setState({ isConnected: true });
    };
    
    const disconnectedHandler = () => {
      console.info("Disconnected!");
      setState({ isConnected: false });
    };
    
    const openHandler = () => {
      console.info("Opened!");
      setState({ isOpened: true });
    };

    const closeHandler = () => {
      console.info("Closed!");
      setState({ isOpened: false });
    };

    peer.on("open", openHandler);
    peer.on("close", closeHandler);
    peer.on("connection", connectedHandler);
    peer.on("disconnected", disconnectedHandler);

    return () => {
      peer.off("open", openHandler);
      peer.off("close", closeHandler);
      peer.off("connection", connectedHandler);
      peer.off("disconnected", disconnectedHandler);
    };
  }, [peer]);

  const value = useMemo(() => ({
    isClient: state.isClient,
    isConnected: state.isConnected,
    isOpened: state.isOpened,
    hostId,
    createPeer,
    connect,
    disconnect,
    sendUpdate,
    onUpdate: setOnUpdate,
    peer,
  }), [createPeer, connect, disconnect, hostId, setOnUpdate, sendUpdate, state, peer]);

  return (
    <PeerContext.Provider value={value}>
      {children}
    </PeerContext.Provider>
  );
}

export function usePeer() {
  const context = useContext(PeerContext);
  if (context === undefined) {
    throw new Error('usePeer must be used within a PeerContextProvider');
  }
  return context;
}
