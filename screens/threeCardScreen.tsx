/* eslint-disable prettier/prettier */
import React, {useState, useReducer} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {GlobalStyle, screenWidth} from '../global/StyleLibrary';
import {Card, pokerDictionary} from '../global/interfaces';
import {imageMap} from '../assets/images/imageMapping';
import {generateDeck, shuffleDeck} from '../global/cardsLogic';
import {
  AnteBonusPayout,
  checkPokerTier,
  PairPlusPayout,
  ThreeCardWinLose,
} from '../global/pokerLogic';

export function ThreeCardScreen() {
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [jackpotHand, setJackpotHand] = useState<Card[]>([]);
  const [jackpotCards, setJackpotCards] = useState<Card[]>([]);

  const [cardDealt, setcardDealt] = useState<boolean>(false);

  const [showCard1, setShowCard1] = useState<boolean>(false);
  const [showCard2, setShowCard2] = useState<boolean>(false);
  const [showCard3, setShowCard3] = useState<boolean>(false);
  const [showCard4, setShowCard4] = useState<boolean>(false);
  const [showCard5, setShowCard5] = useState<boolean>(false);
  const [showCard6, setShowCard6] = useState<boolean>(false);
  const [showCard7, setShowCard7] = useState<boolean>(false);
  const [showCard0, setShowCard0] = useState<boolean>(false);
  const [showTierResult, setShowTierResult] = useState<boolean>(false);

  const setShowCards = [
    setShowCard0,
    setShowCard1,
    setShowCard2,
    setShowCard3,
    setShowCard4,
    setShowCard5,
    setShowCard6,
    setShowCard7,
  ];

  const [anteBet, setAnteBet] = useState<string>('0');
  const [playBet, setPlayBet] = useState<string>('0');
  const [pairPlusBet, setPairPlusBet] = useState<string>('0');
  const [playJackpot, setPlayJackpot] = useState<number>(0);

  const [bonusResult, setBonusResult] = useState<number>(0);
  const [playerBonusSortedHand, setPlayerBonusSortedHand] = useState<
    Record<string, number>
  >({});
  const [roundResult, setRoundResult] = useState<number>(2);
  const [anteWin, setAnteWin] = useState<string>('');
  const [playBetWin, setPlayBetWin] = useState<string>('0');
  const [anteBonusWin, setAnteBonusWin] = useState<string>('0');
  const [pairPlusWin, setPairPlusWin] = useState<string>('0');
  const [bonusWin, setBonusWin] = useState<string>('0');

  const setWinningPayouts = [
    setAnteWin,
    setPlayBetWin,
    setAnteBonusWin,
    setPairPlusWin,
  ];

  const [playerResult, setPlayerResult] = useState<number>(0);
  const [dealerResult, setDealerResult] = useState<number>(0);

  const [disableStart, setDisableStart] = useState<boolean>(false);

  function flipCard(index: number) {
    switch (index) {
      case 0:
        setShowCard0(!showCard0);
        break;
      case 1:
        setShowCard1(!showCard1);
        break;
      case 2:
        setShowCard2(!showCard2);
        break;
      case 3:
        setShowCard3(!showCard3);
        break;
      case 4:
        setShowCard4(!showCard4);
        break;
      case 5:
        setShowCard5(!showCard5);
        break;
      case 6:
        setShowCard6(!showCard6);
        break;
      case 7:
        setShowCard7(!showCard7);
        break;
      default:
        setShowCard0(false);
        setShowCard1(false);
        setShowCard2(false);
        setShowCard3(false);
        setShowCard4(false);
        setShowCard5(false);
        setShowCard6(false);
        setShowCard7(false);
        break;
    }
  }

  function playerFold() {}

  function playerPlays() {
    setPlayBet(anteBet);
    setDisableStart(true);
    const dealerPokerTier = checkPokerTier(dealerHand);

    const delays = [200, 500, 800, 1100, 1400];

    for (let index = 0; index < setShowCards.length; index++) {
      setTimeout(() => {
        setShowCards[index](true);
      }, delays[index - 3]);
    }

    setDealerResult(dealerPokerTier.tier);
    const playerPokerTier = checkPokerTier(playerHand);
    setPlayerResult(playerPokerTier.tier);

    const finalResult = ThreeCardWinLose(dealerPokerTier, playerPokerTier);

    setTimeout(() => {
      setShowTierResult(true);
      setRoundResult(finalResult);

      setPairPlusWin(
        PairPlusPayout(
          parseInt(pairPlusBet, 10),
          playerPokerTier.tier,
        ).toString(),
      );

      if (finalResult === 1) {
        setAnteWin(anteBet);
        if (dealerPokerTier.tier > 0 || dealerPokerTier.tieBreaker[0] > 11) {
          setPlayBetWin(anteBet);
          setAnteBonusWin(
            AnteBonusPayout(
              parseInt(anteBet, 10),
              playerPokerTier.tier,
            ).toString(),
          );
        }
      }
    }, 1500);
  }

  function clearTable() {
    // inputRef.current = 0;
    //setPairPlusBet('0');
    //setAnteBet('0');
    setDisableStart(false);
    setcardDealt(false);
    setShowTierResult(false);
    setRoundResult(3);

    for (let index = 0; index < setShowCards.length; index++) {
      setShowCards[index](false);
    }

    for (let index = 0; index < setWinningPayouts.length; index++) {
      setWinningPayouts[index]('0');
    }
  }

  function startGame(): boolean {
    try {
      const anteBetInt = parseInt(anteBet, 10);
      if (anteBetInt < 1 || isNaN(anteBetInt)) {
        Alert.alert('Warning!', 'Please put ante bet', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        return false;
      }
      setcardDealt(true);
      const deck: Card[] = generateDeck();
      const shuffledDeck: Card[] = shuffleDeck(deck);
      //  const shuffledDeck: Card[] = [{"image": "Spade2", "suit": "Spade", "value": 2},
      //     {"image": "Club2", "suit": "Club", "value": 2},
      //     {"image": "Diamond2", "suit": "Diamond", "value": 2},
      //     {"image": "Heart3", "suit": "Heart", "value": 3},
      //     {"image": "Diamond8", "suit": "Diamond", "value": 8},
      //     {"image": "Spade12", "suit": "Spade", "value": 12},
      //     {"image": "Heart12", "suit": "Heart", "value": 12},
      //     {"image": "Spade3", "suit": "Spade", "value": 3},
      //  ];

      const playerHandAfterShuffle = shuffledDeck.slice(0, 3);
      const dealerHandAfterShuffle = shuffledDeck.slice(3, 6);
      const jackpotAdditionCards = shuffledDeck.slice(6, 8);

      setPlayerHand(playerHandAfterShuffle);
      setDealerHand(dealerHandAfterShuffle);
      setJackpotCards(jackpotAdditionCards);
      setJackpotHand([...playerHandAfterShuffle, ...jackpotAdditionCards]);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {dealerHand.length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Dealer Hand:</Text>
            {showTierResult && <Text>{pokerDictionary(dealerResult)}</Text>}
            <View style={styles.cardView}>
              <View
                style={[
                  styles.dealerCardsView,
                  roundResult === 0 ? styles.winnerHiglight : null,
                ]}>
                <View style={styles.cardFrame}>
                  <Image
                    style={GlobalStyle.Card}
                    source={
                      showCard3
                        ? imageMap[dealerHand[0].image]
                        : imageMap['Back']
                    }
                  />
                </View>
                <View style={styles.cardFrame}>
                  <Image
                    style={GlobalStyle.Card}
                    source={
                      showCard4
                        ? imageMap[dealerHand[1].image]
                        : imageMap['Back']
                    }
                  />
                </View>
                <View style={styles.cardFrame}>
                  <Image
                    style={GlobalStyle.Card}
                    source={
                      showCard5
                        ? imageMap[dealerHand[2].image]
                        : imageMap['Back']
                    }
                  />
                </View>
              </View>
              <View style={styles.centrify}>
                <Text> - </Text>
              </View>
              <View style={styles.cardFrame}>
                <Image
                  style={GlobalStyle.Card}
                  source={
                    showCard6
                      ? imageMap[jackpotCards[0].image]
                      : imageMap['Back']
                  }
                />
              </View>
              <View style={styles.cardFrame}>
                <Image
                  style={GlobalStyle.Card}
                  source={
                    showCard7
                      ? imageMap[jackpotCards[1].image]
                      : imageMap['Back']
                  }
                />
              </View>
            </View>
            {/* <Text style={styles.resultText}>
              {showResult
                ? camelCaseToWords(pokerCombination[dealerResult])
                : null}
            </Text> */}
          </View>
        )}
        {playerHand.length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Player Hand:</Text>
            {showTierResult && <Text>{pokerDictionary(playerResult)}</Text>}

            <View style={styles.cardView}>
              <View
                style={[
                  styles.dealerCardsView,
                  roundResult === 1 ? styles.winnerHiglight : null,
                ]}>
                <View>
                  <TouchableOpacity
                    style={styles.cardFrame}
                    onPress={() => flipCard(0)}>
                    <Image
                      style={GlobalStyle.Card}
                      source={
                        showCard0
                          ? imageMap[playerHand[0].image]
                          : imageMap['Back']
                      }
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.cardFrame}
                    onPress={() => flipCard(1)}>
                    <Image
                      style={GlobalStyle.Card}
                      source={
                        showCard1
                          ? imageMap[playerHand[1].image]
                          : imageMap['Back']
                      }
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.cardFrame}
                    onPress={() => flipCard(2)}>
                    <Image
                      style={GlobalStyle.Card}
                      source={
                        showCard2
                          ? imageMap[playerHand[2].image]
                          : imageMap['Back']
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* <Text style={styles.resultText}>
              {showResult
                ? camelCaseToWords(pokerCombination[playerResult])
                : null}
            </Text> */}
          </View>
        )}
      </View>
      <View style={styles.end}>
        <View style={styles.bettingArea}>
          <View style={styles.jackpotBet}>
            {/* <TouchableOpacity>
                <Text>{playJackpot}</Text>
            </TouchableOpacity>
            <Text style={{color: 'purple'}}>Click to play jackpot</Text> */}
          </View>
        </View>
        <View style={styles.bettingArea}>
          <View>
            <Text style={styles.blankInput}>
              {anteBonusWin === '0' ? null : anteBonusWin}
            </Text>
          </View>
          <View>
            <Text style={styles.blankInput}>
              {anteWin === '0' ? null : anteWin}
            </Text>
          </View>
          <TextInput
            editable={!cardDealt}
            style={styles.antePlayInput}
            keyboardType="numeric"
            placeholder="Ante"
            onChangeText={e => setAnteBet(e)}
            value={anteBet}
          />
          <TextInput
            style={styles.antePlayInput}
            editable={!cardDealt}
            keyboardType="numeric"
            placeholder={'Pair Plus'}
            onChangeText={e => setPairPlusBet(e)}
            value={pairPlusBet}
          />
          <View>
            <Text style={styles.blankInput}>
              {pairPlusWin === '0' ? null : pairPlusWin}
            </Text>
          </View>
          <View>
            <Text style={styles.blankInput}> </Text>
          </View>
        </View>
        <View style={styles.bettingArea}>
          <View>
            <Text style={styles.blankInput}>
              {playBetWin === '0' ? null : anteBet}
            </Text>
          </View>
          <View>
            <Text style={styles.antePlayInput}>
              {playBet === '0' ? 'Play' : anteBet}
            </Text>
          </View>
          <View>
            <Text style={styles.blankInput}> </Text>
          </View>
          <View>
            <Text style={styles.blankInput}> </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            disabled={disableStart}
            style={styles.button}
            onPress={() => startGame()}>
            <Text>Start</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => playerPlays()}>
            <Text>Bet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={() => playerFold()}>
            <Text>Fold</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={() => clearTable()}>
            <Text>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#012140',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
  },
  button2: {
    backgroundColor: 'teal',
    padding: 10,
    borderRadius: 10,
    minWidth: 30,
    minHeight: 20,
    margin: 2,
  },
  body: {
    flex: 3,
    //backgroundColor: 'yellow',
    //justifyContent: 'center',
  },
  end: {
    flex: 3,
    justifyContent: 'center',
    width: screenWidth,
  },
  bettingArea: {
    flexDirection: 'row',
    backgroundColor: 'papayawhip',
    justifyContent: 'center',
  },
  cardView: {
    flexDirection: 'row',
  },
  dealerCardsView: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  winnerHiglight: {
    borderWidth: 1,
    borderColor: '#612d4b',
    backgroundColor: '#612d2d',
  },
  cardFrame: {
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 4,
    width: 70,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFont: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
  },
  centrify: {
    justifyContent: 'center',
  },
  antePlayInput: {
    borderColor: 'purple',
    borderWidth: 1,
    borderRadius: 10,
    width: 64,
    height: 50,
    margin: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
  },
  blankInput: {
    borderRadius: 10,
    width: 64,
    margin: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 50,
    color: 'red',
  },
  jackpotBet: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
    margin: 2,
  },
});
