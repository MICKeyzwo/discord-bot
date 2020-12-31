const CommandBase = require('../command-base');
const { randomInt } = require('../bot-utils');


/** ポーカーで遊ぶ */
class Poker extends CommandBase {
    constructor() {
        super();
        this.name = 'poker';
        this.description = '`poker`: play poker'
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        const cards = PlayingCard.pickRandomCards(5);
        const sortedCards = PlayingCard.sortPlayingCards(cards);
        const pairs = this.countSameCards(sortedCards, 2);
        const threeCards = Boolean(this.countSameCards(sortedCards, 3));
        const fourCards = Boolean(this.countSameCards(sortedCards, 4));
        const fullHouse = pairs === 1 && threeCards;
        const flush = this.hasFlush(sortedCards);
        const straight = this.hasStraight(sortedCards);
        if (straight && sortedCards[0].number === 0) {
            const cardOne = sortedCards.pop();
            sortedCards.unshift(cardOne);
        }
        const message = (() => {
            if (straight && flush && sortedCards[0].number === 8) {
                return '**Wow!! It\'s Royal Straight Flush!!!!**';
            } else if (straight && flush) {
                return 'It\'s Straight Flush!!!';
            } else if (fourCards) {
                return 'It\'s Four of a Kind!!';
            } else if (fullHouse) {
                return 'It\'s Full House!!';
            } else if (flush) {
                return 'It\'s Flush!';
            } else if (straight) {
                return 'It\'s Straight!';
            } else if (threeCards) {
                return 'It\'s Three of a Kind!';
            } else if (pairs === 2) {
                return 'It\'s Two Pairs!';
            } else if (pairs === 1) {
                return 'It\'s One Pair!';
            }
            return 'It\'s High cards...';
        })();
        return `${sortedCards.join('')} ${message}`;
    }

    /**
     * 同じ数字n枚の組の数を数える
     * @param {PlayingCard[]} cards
     * @param {number} n 
     */
    countSameCards(cards, targetN) {
        return [...new Set(cards.map(c => c.number))]
            .map(n => 
                cards.reduce(
                    (cnt, c) => c.number === n ? cnt + 1 : cnt,
                    0
                )
            )
            .filter(n => n === targetN)
            .length;
    }

    /**
     * フラッシュかどうかを判定する
     * @param {PlayingCard[]} cards 
     */
    hasFlush(cards) {
        return cards.every(c => c.suit === cards[0].suit);
    }
    
    /**
     * ストレートかどうかを判定する
     * @param {PlayingCard[]} cards 
     */
    hasStraight(cards) {
        return (
            cards.every(
                (c, idx) => c.number === cards[0].number + idx
            ) || (
                cards[0].number === 0 &&
                cards.slice(-1)[0].number === 12 &&
                cards.slice(0, -1).every(
                    (c, idx) => c.number === cards[0].number + idx
                )
            )
        );
    }
}

/** トランプカードクラス */
class PlayingCard {
    /** 
     * コンストラクタ
     *  @param {number} num
     */
    constructor(num) {
        this.suit = PlayingCard.suits[Math.floor(num / 100)];
        this.number = num % 100;
    }
    /**
     * 表示用文字列への変換
     */
    toString() {
        return (
            '[' +
            PlayingCard.displaySuits[this.suitStrength] +
            PlayingCard.displayNumbers[this.number] +
            ']'
        );
    }
    /**
     * スートの強さを数値で返す
     */
    get suitStrength() {
        return PlayingCard.suits.indexOf(this.suit);
    }
    /** カードのスート文字一覧 */
    static suits = ['H', 'C', 'D', 'S'];
    /** 表示時のスート一覧 */
    static displaySuits = [
        ':hearts:', ':clubs:', ':diamonds:', ':spades:'
    ];
    /** 表示時の数字一覧 */
    static displayNumbers = [
        ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:',
        ':nine:', ':keycap_ten:', ':regional_indicator_j:', ':regional_indicator_q:',
        ':regional_indicator_k:', ':regional_indicator_a:'
    ];
    /** 
     * 指定された枚数のトランプをランダムに取得する
     * @param {number} len
     */
    static pickRandomCards(len) {
        const nums = [];
        for (let i = 0; i < len; i++) {
            const n = randomInt(4) * 100 + randomInt(13);
            if (!nums.includes(n)) {
                nums.push(n);
            } else {
                i--;
            }
        }
        return nums.map(n => new PlayingCard(n));
    }
    /**
     * トランプを弱→強順にソートする
     * @param {PlayingCard[]} cards 
     */
    static sortPlayingCards(cards) {
        return [...cards].sort((a, b) => {
            if (a.number != b.number) {
                return a.number - b.number;
            } else {
                return a.suitStrength - b.suitStrength;
            }
        });
    }
}

module.exports = Poker;
