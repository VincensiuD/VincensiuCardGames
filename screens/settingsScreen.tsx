/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Toggle} from '../component';
import {SettingsContext} from '../global/context/Settings';

export function SettingsScreen() {

  const settingsParam = useContext(SettingsContext);

  return (
    <ScrollView>
      <View>
        <Text>Settings</Text>
      </View>
      <View>
        <View>
          <Text > 3 Card Poker</Text>
        </View>
        <View>
          <Toggle defaultText="Play 6 cards"
          boolValue={settingsParam.play6Cards}
          setter={settingsParam.setPlay6Cards} />
        </View>
        <View>
          <Toggle defaultText="Play Jackpot"
          boolValue={settingsParam.tcpJackpot}
          setter={settingsParam.setTcpJackpot} />
        </View>
        {settingsParam.tcpJackpot && <View>
          <Toggle defaultText="Separate jackpot card"
          boolValue={settingsParam.tcpSeparateJackpot}
          setter={settingsParam.setTcpSeparateJackpot} />
        </View>}
      </View>
    </ScrollView>
  );
}

// const style = StyleSheet.create({

// }),
