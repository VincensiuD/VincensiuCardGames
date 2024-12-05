/* eslint-disable prettier/prettier */
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {GlobalStyle} from '../global/StyleLibrary';
import {useNavigation} from '@react-navigation/native';

export function ThreeCardScreen() {

    const navigation = useNavigation();

  return (
    <View>
      <View>
        <Text>Three Card Poker</Text>
      </View>
      <View>
      </View>
    </View>
  );
}
