/* eslint-disable prettier/prettier */

import {Card} from './interfaces';

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

export function checkPair(tally: Record<string, number>, sortedCardValues: number[]) {
  if (Object.keys(tally).length === sortedCardValues.length) {
    return {result: 0, tieBreaker: sortCardValues}; //no pair
  }
  else if (Object.keys(tally).length === sortedCardValues.length - 1) {
    const pair = getKeyByValue(tally, 2);
    const tieBreaker = rearrangeCardsByPair(sortedCardValues, pair[0]);
    return {result: 1, tieBreaker}; //p
  } else if (Object.keys(tally).length === sortedCardValues.length - 2) {
    if (Object.values(tally).includes(3)) {
        const threeKind = getKeyByValue(tally, 3);
        return {result: 3, tieBreaker: [threeKind]}; // 3ok
    }
    const pair = getKeyByValue(tally, 2);
    const tieBreaker = rearrangeCardsByPair(sortedCardValues, pair[0], pair[1]);
    return {result: 2, tieBreaker}; //2p
  } else if (
    Object.keys(tally).length === 2 &&
    Object.values(tally).includes(4)
  ) {
    const fourKind = getKeyByValue(tally, 4);
    return {result: 7, tieBreaker:[fourKind]}; //4k
  }
  const threeKind = getKeyByValue(tally,3);
  return {result: 6, tieBreaker: [threeKind]}; //fh
}

export function rearrangeCardsByPair(arr: number[], pairValue: number, pairValue2?:number){

        const pairArray = arr.filter(num => num === pairValue);

        if(pairValue2){
            const pairArray2 = arr.filter(num => num === pairValue2);

            const remainingValues = arr.filter(num => num !== pairValue || num !== pairValue2).sort((a, b) => b - a);

            if(pairValue > pairValue2){
                return [...pairArray, ...pairArray2, ...remainingValues];
            }
            return [...pairArray2, ...pairArray, ...remainingValues];
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

export function checkPokerTier(cards: Card[]) {

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

    const checkPairResult = checkPair(cardsTally, sortedCardValues);

    return checkPairResult;

}
