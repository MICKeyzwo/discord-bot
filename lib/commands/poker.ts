import { CommandBase, type CommandHandler } from '../command-base';
import { randomInt } from '../bot-utils';


/** ポーカーで遊ぶ */
export default class Poker extends CommandBase {
    constructor() {
        super();
        this.name = 'poker';
        this.description = 
            '`poker`: play poker\n' +
            'subCommand:\n' +
            '  reload [indexes] (max 4 indexes)\n' +
            '  e.g. `!bot poker reload 0 2 4`';
    }

    exec(): CommandHandler {
        return async (sendMessage, ctx) => {
            let cards: PlayingCard[];
            if (ctx.args[0] === "reload" && ctx.referenceMessageID) {
                const reloadTargetIndexes = ctx.args.slice(1).map((num) => parseInt(num, 10));
                const msg = await ctx.getMessage(ctx.referenceMessageID);
                const matchRes = msg?.content?.match(
                    new RegExp(Array.from({length: 5}).map(() => "(\[:[a-z]+::[a-z_]+:\])").join(""))
                );
                if (
                    !matchRes ||
                    reloadTargetIndexes.length > 4 ||
                    reloadTargetIndexes.length === 0 ||
                    reloadTargetIndexes.some((n) => n < 0 || n > 4)
                ) {
                    return sendMessage("invalid reload request");
                }
                const prevCards = matchRes.slice(1).map(PlayingCard.fromString);
                const reloadTargets = prevCards.filter((_, idx) => reloadTargetIndexes.includes(idx));
                cards = prevCards.filter((_, idx) => !reloadTargetIndexes.includes(idx));
                for (const card of PlayingCard.pickRandomCards()) {
                    if (cards.length === 5) {
                        break;
                    } else if (!reloadTargets.some((prevCard) => card.isSameCard(prevCard))) {
                        cards.push(card);
                    }
                }
            } else {
                cards = PlayingCard.pickRandomCards(5);
            }
            await sendMessage(this.play(cards));
        };
    }

    play(cards: PlayingCard[]) {
        const sortedCards = PlayingCard.sortPlayingCards(cards);
        const pairs = this.countSameCards(sortedCards, 2);
        const threeCards = Boolean(this.countSameCards(sortedCards, 3));
        const fourCards = Boolean(this.countSameCards(sortedCards, 4));
        const fullHouse = pairs === 1 && threeCards;
        const flush = this.hasFlush(sortedCards);
        const straight = this.hasStraight(sortedCards);
        if (straight && sortedCards[0].number === 0) {
            const cardOne = sortedCards.pop()!;
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
     */
    countSameCards(cards: PlayingCard[], targetN: number) {
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
     */
    hasFlush(cards: Pick<PlayingCard, 'suit'>[]) {
        return cards.every(c => c.suit === cards[0].suit);
    }
    
    /**
     * ストレートかどうかを判定する
     */
    hasStraight(cards: Pick<PlayingCard, 'number'>[]) {
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
    constructor(readonly suit: string, readonly number: number) {}

    static createRandomCard(num: number): PlayingCard {
        return new PlayingCard(
            PlayingCard.suits[Math.floor(num / 100)],
            num % 100
        );
    }

    /**
     * 表示用文字列から生成
     */
    static fromString(cardDisplayText: string): PlayingCard {
        const matchRes = cardDisplayText.match(/\[(:[a-z]+:)(:[a-z_]+:)\]/);
        if (!matchRes) {
            throw new Error("invalid card display string");
        }
        const [_, suitText, numberText] = matchRes;
        return new PlayingCard(
            PlayingCard.suits[PlayingCard.displaySuits.indexOf(suitText)],
            PlayingCard.displayNumbers.indexOf(numberText)
        );
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

    /** @returns 同じカードかどうか */
    isSameCard(card: PlayingCard) {
        return this.suit === card.suit && this.number === card.number;
    }

    /**
     * スートの強さを数値で返す
     */
    get suitStrength() {
        return PlayingCard.suits.indexOf(this.suit);
    }

    /** カードのスート文字一覧 */
    static readonly suits = ['H', 'C', 'D', 'S'];

    /** 表示時のスート一覧 */
    static readonly displaySuits = [
        ':hearts:', ':clubs:', ':diamonds:', ':spades:'
    ];

    /** 表示時の数字一覧 */
    static readonly displayNumbers = [
        ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:',
        ':nine:', ':keycap_ten:', ':regional_indicator_j:', ':regional_indicator_q:',
        ':regional_indicator_k:', ':regional_indicator_a:'
    ];

    /** 
     * 指定された枚数のトランプをランダムに取得する
     * 
     * 枚数を指定しない場合は無限にトランプを生成する
     */
    static pickRandomCards(len: number): PlayingCard[];
    static pickRandomCards(): Iterable<PlayingCard>;
    static pickRandomCards(len?: number) {
        if (len === undefined) {
            return (function*(): Iterable<PlayingCard> {
                while (true) {
                    const n = randomInt(4) * 100 + randomInt(13);
                    yield PlayingCard.createRandomCard(n);
                }
            })()
        }
        const cards: PlayingCard[] = [];
        for (const card of PlayingCard.pickRandomCards()) {
            if (cards.length >= len) {
                break;
            }
            cards.push(card);
        }
        return cards;
    }

    /**
     * トランプを弱→強順にソートする
     */
    static sortPlayingCards(cards: PlayingCard[]) {
        return [...cards].sort((a, b) => {
            if (a.number != b.number) {
                return a.number - b.number;
            } else {
                return a.suitStrength - b.suitStrength;
            }
        });
    }
}
