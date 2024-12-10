export interface Card {
  suit: string;
  value: number;
  image: string;
}

export interface PokerTierResult {
  tier: number;
  tieBreaker: number[];
}

export function pokerDictionary(tier: number) {
  switch (tier) {
    case 1:
      return 'Pair';
    case 2:
      return 'Two pairs';
    case 3:
      return 'Three of a kind';
    case 4:
      return 'Straight';
    case 5:
      return 'Flush';
    case 6:
      return 'Full house';
    case 7:
      return 'Four of a kind';
    case 8:
      return 'Straight flush';
    case 9:
      return 'Royal flush';
    default:
      return 'High card';
  }
}
