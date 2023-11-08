import { CommandBase, type CommandHandler } from '../command-base';
import { randomInt } from '../bot-utils';


/** ポーカーで遊ぶ */
export default class Poker extends CommandBase {
    private readonly deckPattern = new RegExp(
      Array.from({ length: 5 })
        .map(() => "([:[a-z]+::[a-z_]+:])")
        .join("")
    );

    constructor() {
        super();
        this.name = 'poker';
        this.description = 
            '`poker`: play poker\n' +
            'subCommand:\n' +
            '  reload [indexes] (max 5 indexes; if no index specified, all cards will be discarded)\n' +
            '  e.g. `!bot poker reload 0 2 4`';
    }

    exec(): CommandHandler {
        return async (sendMessage, ctx) => {
            // リロードでない場合
            if (ctx.args[0] !== "reload") {
                return sendMessage(this.play(PlayingCard.pickRandomCards(5)));
            }
            // リロードの場合
            if (!ctx.referenceMessageID) {
                // リロード対象のメッセージが指定されていない
                return sendMessage("no reload target was specified");
            }
            /** リロード対象のメッセージ */
            const msg = await ctx.getMessage(ctx.referenceMessageID);
            if (!msg) {
                // リロード対象のメッセージを取得できない
                return sendMessage("failed to get reload target");
            } else if (!msg.isBotMessage) {
                // リロード対象のメッセージがBOTのメッセージでない
                return sendMessage("reload target must be message from bot");
            }
            /** 前回までのプレイで出たカード */
            const decks = msg.content
                .split("\n")
                .map((line) => line.match(this.deckPattern))
                .filter((matchRes): matchRes is RegExpMatchArray => matchRes !== null)
                .map((matchRes) => matchRes.slice(1).map(PlayingCard.fromString));
            if (decks.length === 0) {
                // ポーカーのカードが見つからなかった
                return sendMessage("reload target does not seam to poker message");
            }
            /** 引数 */
            const args = ctx.args.slice(1);
            /** リロード対象のカードのインデックス */
            const reloadTargetIndexes = args.length === 0
                ? Array.from({ length: 5 }).map((_, idx) => idx)
                : args.map((num) => parseInt(num, 10));
            if (
                reloadTargetIndexes.length > 5 ||
                reloadTargetIndexes.some((n) => n < 0 || n > 4)
            ) {
                // 引数が間違っている
                return sendMessage("invalid arguments");
            }
            /** これまでに出た全てのカード */
            const discardedCards: PlayingCard[] = [];
            for (const card of decks.reduce((cards, deck) => cards.concat(deck), [])) {
                if (!discardedCards.some((discardedCard) => card.isSameCard(discardedCard))) {
                    discardedCards.push(card);
                }
            }
            /** 残り枚数 */
            const remainsCardsCount = 13 * 4 - discardedCards.length;
            if (remainsCardsCount <= 0) {
                // 全てのカードが出尽くした
                return sendMessage("no card remained...");
            } else if (reloadTargetIndexes.length > remainsCardsCount) {
                // カードが足りない
                return sendMessage([
                    `you requested to reload ${reloadTargetIndexes.length} ${reloadTargetIndexes.length === 1 ? 'card' : 'cards'},`,
                    `but ${remainsCardsCount} ${remainsCardsCount === 1 ? 'card' : 'cards'} remains`
                ].join(" "));
            }
            /** 直前のプレイで出たカード */
            const lastDeck = decks[decks.length - 1];
            /** 手札 */
            const cards = lastDeck.filter((_, idx) => !reloadTargetIndexes.includes(idx));
            // リロード処理
            for (const card of PlayingCard.pickRandomCards()) {
                if (cards.length === 5) {
                    break;
                } else if (!discardedCards.some((discardedCard) => card.isSameCard(discardedCard))) {
                    cards.push(card);
                }
            }
            return msg.updateMessage(`${msg.content}\n:arrow_down: reload\n${this.play(cards)}`);
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
     * 枚数を指定しない場合は52枚全てをランダムな順番で生成する
     * 
     * 52以上の数を指定した場合、例外を送出
     */
    static pickRandomCards(len?: number): PlayingCard[] {
        if (len === undefined) {
            len = 52;
        } else if (len > 52) {
            throw new Error("too many cards requested");
        }
        const deck = Array.from({ length: 4 })
            .map((_, suitIdx) =>
                Array.from({ length: 13 }).map(
                    (_, number): [string, number] => [this.suits[suitIdx], number]
                )
            )
            .reduce((cards, card) => cards.concat(card), [])
            .map(([suit, number]) => new PlayingCard(suit, number));
        const cards: PlayingCard[] = [];
        for (let n = 0; n < len; n++) {
            cards.push(deck.splice(randomInt(deck.length), 1)[0]);
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
