/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {GlobalStyle} from '../global/StyleLibrary';
import {imageMap} from '../assets/images/imageMapping';

export function CardFrame({
  status,
  showCard,
  imageUrl,
  flipCard,
  winning,
}: {
  status: string;
  showCard: boolean;
  imageUrl: string;
  flipCard?: () => void;
  winning?: boolean;
}) {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={flipCard ? 0.2 : 1}
        style={[styles.cardFrame, winning ? styles.winning : null]}
        onPress={() => (flipCard ? flipCard() : null)}>
        {status !== 'clear' && (
          <Image
            style={GlobalStyle.Card}
            source={showCard ? imageMap[imageUrl] : imageMap['Back']}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardFrame: {
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 2,
    width: 64,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winning:{
    backgroundColor: '#009900',
  }
});
