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
import {CardFrame} from '../component';
import {GlobalStyle, screenWidth} from '../global/StyleLibrary';
import {Card, pokerDictionary} from '../global/interfaces';
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

  const [anteBet, setAnteBet] = useState<string>('');
  const [playBet, setPlayBet] = useState<string>('0');
  const [pairPlusBet, setPairPlusBet] = useState<string>('');
  const [playJackpot, setPlayJackpot] = useState<boolean>(false);

  const [jackpotResult, setJackpotResult] = useState<number>(0);
  const [roundResult, setRoundResult] = useState<number>(2);
  const [anteWin, setAnteWin] = useState<string>('');
  const [playBetWin, setPlayBetWin] = useState<string>('0');
  const [anteBonusWin, setAnteBonusWin] = useState<string>('0');
  const [pairPlusWin, setPairPlusWin] = useState<string>('0');

  const setWinningPayouts = [
    setAnteWin,
    setPlayBetWin,
    setAnteBonusWin,
    setPairPlusWin,
  ];

  const [playerResult, setPlayerResult] = useState<number>(0);
  const [dealerResult, setDealerResult] = useState<number>(0);

  const [gameStatus, dispatch] = useReducer(gameStatusReducer, {
    status: 'clear',
  });

  function gameStatusReducer(state, action: string) {
    switch (action) {
      case 'clear':
        return {status: 'clear'};
      case 'complete':
        return {status: 'complete'};
      case 'dealt':
        return {status: 'dealt'};
      default:
        return {status: 'clear'};
    }
  }

  const [jackpotStatus, jackpotDispatch] = useReducer(jackpotReducer, {win: 0});

  function jackpotReducer(state, tier: number) {
    switch (tier) {
      case 9:
        return {win: 100000};
      case 8:
        return {win: 10000};
      case 7:
        return {win: 3000};
      case 6:
        return {win: 1500};
      case 5:
        return {win: 1000};
      case 4:
        return {win: 200};
      case 3:
        return {win: 50};
      default:
        return {win: 0};
    }
  }

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

  function playerPlays(bool: boolean) {
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
    setPlayBet(anteBet);

    const jackpotPokerTier = checkPokerTier(jackpotHand);
    setJackpotResult(jackpotPokerTier.tier);

    setTimeout(() => {
      setShowTierResult(true);
      setRoundResult(finalResult);
      jackpotDispatch(jackpotPokerTier.tier);

      if (bool) {
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
      }
      dispatch('complete');
    }, 1500);
  }

  function clearTable() {
    setDisableStart(false);
    setShowTierResult(false);
    setRoundResult(3);
    setPlayBet('0');
    dispatch('clear');
    jackpotDispatch(0);

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
      dispatch('dealt');
      const deck: Card[] = generateDeck();
      //const shuffledDeck: Card[] = shuffleDeck(deck);
       const shuffledDeck: Card[] = [{"image": "Spade2", "suit": "Spade", "value": 2},
          {"image": "Club3", "suit": "Club", "value": 3},
          {"image": "Diamond3", "suit": "Diamond", "value": 3},
          {"image": "Heart3", "suit": "Heart", "value": 3},
          {"image": "Diamond12", "suit": "Diamond", "value": 12},
          {"image": "Spade12", "suit": "Spade", "value": 12},
          {"image": "Heart12", "suit": "Heart", "value": 12},
          {"image": "Spade3", "suit": "Spade", "value": 3},
       ];

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
        <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Dealer Hand:</Text>
            {showTierResult && (
            <Text style={styles.resultText}>
              {pokerDictionary(dealerResult)}
            </Text>
            )}
            <View style={styles.cardsView}>
              <CardFrame
                status={gameStatus.status}
                winning={roundResult === 0}
                showCard={showCard3}
                imageUrl={
                  dealerHand.length !== 0 ? dealerHand[0].image : 'Back'
                }
              />
              <CardFrame
                status={gameStatus.status}
                winning={roundResult === 0}
                showCard={showCard4}
                imageUrl={
                  dealerHand.length !== 0 ? dealerHand[1].image : 'Back'
                }
              />
              <CardFrame
                status={gameStatus.status}
                winning={roundResult === 0}
                showCard={showCard5}
                imageUrl={
                  dealerHand.length !== 0 ? dealerHand[2].image : 'Back'
                }
              />
            </View>
        </View>
        <View style={[styles.resultContainer]}>
            <View style={styles.ThisWrapsJackpotAnd3CardsSection}>
                <View style={styles.ThisWrapsPlayer3HandsSection}>
                <Text style={styles.resultTitle}>Player Hand:</Text>
                {showTierResult && (
                <Text style={styles.resultText}>
                    {pokerDictionary(playerResult)}
                </Text>
                )}
                <View style={[styles.cardsView , jackpotStatus.win > 0 ? styles.jackpotHighlight : null]}>
                    <CardFrame
                    winning={roundResult === 1}
                    status={gameStatus.status}
                    showCard={showCard0}
                    imageUrl={
                      dealerHand.length !== 0 ? playerHand[0].image : 'Back'
                    }
                    flipCard={() => flipCard(0)}
                    />
                    <CardFrame
                    winning={roundResult === 1}
                    status={gameStatus.status}
                    showCard={showCard1}
                    imageUrl={
                      dealerHand.length !== 0 ? playerHand[1].image : 'Back'
                    }
                    flipCard={() => flipCard(1)}
                    />
                    <CardFrame
                    winning={roundResult === 1}
                    status={gameStatus.status}
                    showCard={showCard2}
                    imageUrl={
                      dealerHand.length !== 0 ? playerHand[2].image : 'Back'
                    }
                    flipCard={() => flipCard(2)}
                    />
                </View>
                </View>
                <View style={styles.ThisWrapsJackpotSection}>
                <Text style={styles.resultTitle}>Jackpot Hand:</Text>
                    {showTierResult && (
                <Text style={styles.resultText}>
                      {jackpotStatus.win > 0
                        ? pokerDictionary(jackpotResult)
                        : 'Jackpot not won'}
                </Text>
                    )}
                <View style={[styles.cardsView, jackpotStatus.win > 0 ? styles.jackpotHighlight : null]}>
                        <CardFrame
                        winning={jackpotStatus.win > 0}
                        status={gameStatus.status}
                        showCard={showCard7}
                        imageUrl={
                        dealerHand.length !== 0 ? jackpotCards[1].image : 'Back'
                        }
                    />
                    <CardFrame
                    winning={jackpotStatus.win > 0}
                    status={gameStatus.status}
                    showCard={showCard6}
                    imageUrl={
                      dealerHand.length !== 0 ? jackpotCards[0].image : 'Back'
                    }
                    flipCard={() => flipCard(6)}
                    />
                </View>
                </View>
            </View>
        </View>
    </View>
    <View style={styles.end}>
        <View style={styles.bettingArea}>
          <TouchableOpacity
            style={styles.jackpotBet}
            onPress={() => setPlayJackpot(!playJackpot)}>
            <Text style={styles.jackpotBetText}>
              {playJackpot ? 10 : 'Jackpot'}
            </Text>
          </TouchableOpacity>
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
            editable={gameStatus.status === 'clear'}
            style={styles.antePlayInput}
            keyboardType="numeric"
            placeholder="Ante"
            placeholderTextColor={'#aaa'}
            onChangeText={e => setAnteBet(e)}
            value={anteBet}
          />
          <TextInput
            style={styles.antePlayInput}
            editable={gameStatus.status === 'clear'}
            keyboardType="numeric"
            placeholder={'Pair Plus'}
            placeholderTextColor={'#aaa'}
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
            <Text
              style={[
                styles.antePlayInput,
                playBet === '0' && styles.greyFont,
              ]}>
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
          {gameStatus.status === 'clear' && (
            <TouchableOpacity
              disabled={disableStart}
              style={styles.button}
              onPress={() => startGame()}>
              <Text>Start</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          {gameStatus.status === 'dealt' && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => playerPlays(true)}>
              <Text>Bet</Text>
            </TouchableOpacity>
          )}
          {gameStatus.status === 'dealt' && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => playerPlays(false)}>
              <Text>Fold</Text>
            </TouchableOpacity>
          )}
          {gameStatus.status === 'complete' && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => clearTable()}>
              <Text>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#003300',
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
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.4,
    height: 50,
    margin: 4,
    alignSelf: 'center',
  },
  body: {
    flex: 3,
  },
  end: {
    flex: 5,
    justifyContent: 'center',
    width: screenWidth,
  },
  bettingArea: {
    flexDirection: 'row',
    backgroundColor: 'papayawhip',
    justifyContent: 'center',
  },
  cardsView: {
    flexDirection: 'row',
    marginVertical: 12,
    padding: 8,
  },
  jackpotHighlight: {
    backgroundColor: '#da0c84',
    paddingHorizontal: 10,
    marginHorizontal: -10,
  },
  cardFrame: {
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 4,
    width: 70,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackBorder: {
    borderColor: 'black',
  },
  redBorder: {
    borderColor: 'red',
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
    fontWeight: 'bold',
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
    width: 50,
    height: 40,
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
    margin: 2,
    justifyContent: 'center',
  },
  jackpotBetText: {
    color: 'black',
    textAlign: 'center',
  },
  centreText: {
    textAlign: 'center',
  },
  greyFont: {
    color: '#aaa',
    textAlign: 'center',
  },
  ThisWrapsPlayer3HandsSection: {
    marginRight: 16,
  },
  ThisWrapsJackpotSection: {
  },
  ThisWrapsJackpotAnd3CardsSection: {
    flexDirection: 'row',
  },
});
