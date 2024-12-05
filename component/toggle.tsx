/* eslint-disable prettier/prettier */
import React, {SetStateAction, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {SettingsContext} from '../global/context/Settings';
import { screenWidth } from '../global/StyleLibrary';

export function Toggle({
  boolValue,
  defaultText,
  setter,
}: {
  boolValue: boolean;
  defaultText: string;
  setter: React.Dispatch<React.SetStateAction<boolean>>;
}) {

  const [trueValue, setTrueValue] = useState<boolean>(boolValue);

  function handleSetter(){
    setTrueValue(!trueValue);
    setter(!boolValue);

  }

  return (
    <View style={styles.MainView}>
      <Text style={styles.Text}> {defaultText} </Text>
      <Pressable hitSlop={20} onPress={() => handleSetter()}>
        <View style={styles.ToggleBoxView}>
          <View
            style={[
              styles.BooleanView,
              trueValue ? styles.True : styles.False,
            ]}>
            <Text>Y</Text>
          </View>
          <View
            style={[
              styles.BooleanView,
              trueValue ? styles.False : styles.True,
            ]}>
            <Text>N</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  MainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 2,
  },
  Text: {
    color: 'purple',
  },
  ToggleBoxView: {
    width: 84,
    height: 45,
    backgroundColor: 'blue',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  BooleanView: {
    width: 36,
    height: 36,
    backgroundColor: 'teal',
    borderRadius: 15,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'blue',
    borderWidth: 1,
  },
  True: {
    backgroundColor: 'teal',
  },
  False: {
    backgroundColor: 'blue',
  },
});
