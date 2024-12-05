import * as React from 'react';
import {SettingsProvider} from './global/context/Settings';
import {RootStack} from './navigation/navigation';
import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SettingsProvider>
  );
}
