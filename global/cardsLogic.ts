/* eslint-disable prettier/prettier */

import { Card } from "./interfaces";

export function generateDeck () {

    const CardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const Suits = ['Spade', 'Diamond', 'Heart', 'Club'];

    const deck = [];
    for (const suit of Suits) {
      for (const value of CardValues) {
        const cardObj: Card = {
          suit,
          value,
          image: `${suit}${value}`,
        };
        deck.push(cardObj);
      }
    }
    return deck;
  };

export const shuffleDeck = (deck: Card[]) => {
    const shuffledDeck = [...deck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
  };
