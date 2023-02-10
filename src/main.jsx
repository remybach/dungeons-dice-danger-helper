import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import { DiceRollProvider, PeerContextProvider } from './providers';

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <PeerContextProvider>
        <DiceRollProvider>
          <App />
        </DiceRollProvider>
      </PeerContextProvider>
    </MantineProvider>
  </React.StrictMode>,
)
