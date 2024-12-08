import {Dimensions, StyleSheet} from 'react-native';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const GlobalStyle = StyleSheet.create({
  MainButton: {
    backgroundColor: 'green',
    width: screenWidth * 0.3,
    height: 40,
    padding: 4,
    margin: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  MainText: {
    color: 'black',
  },
  Card: {
    width: 48,
    height: 72,
  },
});
