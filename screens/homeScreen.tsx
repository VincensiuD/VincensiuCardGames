/* eslint-disable prettier/prettier */
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {GlobalStyle} from '../global/StyleLibrary';
import {useNavigation} from '@react-navigation/native';

export function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <View>
        <Text>Welcome To Vincensiu's game</Text>
      </View>
      <View>
        <TouchableOpacity
          style={GlobalStyle.MainButton}
          onPress={() => navigation.navigate('ThreeCard')}>
          <Text> 3 Cards Poker </Text>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyle.MainButton}>
          <Text> Blackjack </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyle.MainButton}
          onPress={() => navigation.navigate('Settings')}>
          <Text> Settings </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
