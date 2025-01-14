/* eslint-disable prettier/prettier */
import * as React from 'react';
import {SettingsProvider} from './global/context/Settings';
import {WalletProvider} from './global/context/Wallet';
import {RootStack} from './navigation/navigation';
import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  return (
    <SettingsProvider>
      <WalletProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </WalletProvider>
    </SettingsProvider>
  );
}
