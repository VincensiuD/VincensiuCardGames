/* eslint-disable prettier/prettier */

import {Card, PokerTierResult} from './interfaces';

export function checkFlush(cards: Card[]): boolean {
  for (let index = 1; index < cards.length; index++) {
    if (cards[index].suit !== cards[index - 1].suit) {
      return false;
    }
  }
  return true;
}

/**
 * This function check which card value has certain amount of appearance
 * for example if player has 7♥, 7♣, 8♥, 9♦, K♦ - then 7 has 2 appearance
 * so passing through getKeyByValue(object, 2) will return [7]
 * executing getKeyByValue(object, 1) will return [8,9,13]
 * @param object of tally (example: {14: 1, 12: 3})
 * @param value
 * @returns array of numbers
 */
export function tallyCards(cards: Card[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const card of cards) {
    counts[card.value] = counts[card.value] ? counts[card.value] + 1 : 1;
  }
  return counts;
}

/**
 * This function converts array of string into array of numbers
 * @param array of strings
 * @returns array of numbers
 */
function strArrToIntArr(array: string[]): number[] {
  const newArray: number[] = [];
  for (let index = 0; index < array.length; index++) {
    let element = parseInt(array[index], 10);
    newArray.push(element);
  }
  return newArray;
}


function getKeyByValue(
  object: Record<string, number>,
  value: number,
): number[] {
  const keyResult = Object.keys(object).filter(key => object[key] === value);

  return keyResult ? strArrToIntArr(keyResult) : [];
}

export function checkPair(tally: Record<string, number>, sortedCardValues: number[], cardAmount: number): PokerTierResult {
  if (Object.keys(tally).length === cardAmount) {
    return {tier: 0, tieBreaker: sortedCardValues}; //no pair
  }
  else if (Object.keys(tally).length === cardAmount - 1) {
    const pair = getKeyByValue(tally, 2);
    const tieBreaker = rearrangeCardsByPair(sortedCardValues, pair[0]);
    return {tier: 1, tieBreaker}; //p
  } else if (Object.keys(tally).length === cardAmount - 2) {
    if (Object.values(tally).includes(3)) {
        const threeKind = getKeyByValue(tally, 3);
        return {tier: 3, tieBreaker: threeKind}; // 3ok
    }
    const pair = getKeyByValue(tally, 2);
    const tieBreaker = rearrangeCardsByPair(sortedCardValues, pair[0], pair[1]);

    return {tier: 2, tieBreaker}; //2p
  } else if (
    Object.keys(tally).length === 2 &&
    Object.values(tally).includes(4)
  ) {
    const fourKind = getKeyByValue(tally, 4);
    return {tier: 7, tieBreaker:fourKind}; //4k
  }
  const threeKind = getKeyByValue(tally,3);
  return {tier: 6, tieBreaker: threeKind}; //fh
}

export function rearrangeCardsByPair(arr: number[], pairValue: number, pairValue2?:number){

        const pairArray = arr.filter(num => num === pairValue);

        if(pairValue2){

            const remainingValues = arr.filter(num => num !== pairValue && num !== pairValue2).sort((a, b) => b - a);

            if(pairValue > pairValue2){
                return [pairValue, pairValue2, ...remainingValues];
            }
            return [pairValue2, pairValue, ...remainingValues];
        }
        const remainingValues = arr.filter(num => num !== pairValue).sort((a, b) => b - a);
        return [...pairArray, ...remainingValues];
      }


/**
 * Sort numbers in array from highest to lowest
 */
export function sortCardValues(numberArr: number[]): number[] {
  const sortedCardValues = numberArr.sort(function (a: number, b: number) {
    return b - a;
  });

  return sortedCardValues;
}

export function checkStraight(sortedRank: number[], cardsLength: number): boolean {
  if (Object.keys(sortedRank).length !== cardsLength) {
    return false;
  }

  if (sortedRank.length === 3) {
    if (sortedRank[0] === 14 && sortedRank[2] === 2 && sortedRank[1] === 3) {
      return true;
    }
  } else if (sortedRank.length === 5) {
    if (
      sortedRank[0] === 14 &&
      sortedRank[4] === 2 &&
      sortedRank[3] === 3 &&
      sortedRank[2] === 4 &&
      sortedRank[1] === 5
    ) {
      return true;
    }
  }

  for (let index = 0; index < cardsLength - 1; index++) {
    if (sortedRank[index] - 1 !== sortedRank[index + 1]) {
      return false;
    }
  }
  return true;
}

export function checkRoyalFlush(sortedCardValues: number[]){
    if (sortedCardValues[0] === 14 && sortedCardValues[1] === 13){
        return true;
    }
    return false;
}

export function checkPokerTier(cards: Card[]): PokerTierResult {

  const cardsTally: Record<string,number> = tallyCards(cards);
  const keysArr: number[] = strArrToIntArr(Object.keys(cardsTally));
  const sortedCardValues: number [] = sortCardValues(keysArr);

  const isFlush = checkFlush(cards);
  const isStraight = checkStraight(sortedCardValues, cards.length);

  if (isFlush && isStraight) {
    if(checkRoyalFlush(sortedCardValues)){
        return {tier: 9, tieBreaker:[0]};
    }
    return {tier: 8, tieBreaker: sortedCardValues};
    }
    if(isFlush) {
        return {tier:5, tieBreaker: sortedCardValues};
    }

    if(isStraight){
        return {tier:4, tieBreaker: sortedCardValues};
    }

    const checkPairResult = checkPair(cardsTally, sortedCardValues, cards.length);

    return checkPairResult;

}

export function PairPlusPayout(bet: number, tier: number){
    if(isNaN(bet)){
      return 0;
    }
    switch(tier){
        case 1:
        return bet * 2;
        case 3:
        return 30 * bet + bet;
        case 5:
        return 4 * bet + bet;
        case 4:
        return 6 * bet + bet;
        case 8:
        return 40 * bet + bet;
        default:
        return 0;
    }
}

export function AnteBonusPayout(bet: number, tier: number){

    switch(tier){
        case 4:
        return bet;
        case 3:
        return bet * 4;
        case 8:
        return bet * 5;
        default:
        return 0;
    }
}

export function ThreeCardWinLose(dealerResult, playerResult): number {

    function processTier(tierNumber: number){

    switch(tierNumber){
        case 5:
            return 15;
        case 4:
            return 16;
        case 3:
            return 17;
        case 8:
            return 18;
        default:
            return tierNumber;
    }
    }

    if(dealerResult.tier === 0 && dealerResult.tieBreaker[0] < 12){
        return 1; // player win
    }

    let dealerTier = processTier(dealerResult.tier);
    let playerTier = processTier(playerResult.tier);

    if(dealerTier > playerTier){
        return 0; //dealer win
    }
    else if(dealerTier < playerTier){
        return 1; //player win
    }
    else if (dealerTier === playerTier){
        for (let index = 0; index < dealerResult.tieBreaker.length; index++) {
            if(dealerResult.tieBreaker[index] > playerResult.tieBreaker[index]){
                return 0;
            }
            else if(dealerResult.tieBreaker[index] < playerResult.tieBreaker[index]){
                return 1;
            }
        }
    }
    return 2; //stand off

    }

export function JackpotPayout(tier: number){
    switch (tier) {
        case 9:
          return {win: 100000};
        case 8:
          return {win: 10000};
        case 7:
          return {win: 4000};
        case 6:
          return {win: 1500};
        case 5:
          return {win: 1000};
        case 4:
          return {win: 300};
        default:
          return {win: 0};
      }
}
