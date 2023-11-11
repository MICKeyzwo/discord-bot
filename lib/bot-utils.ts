import { prefix } from '../config';

/**
 * 受け取ったメッセージからコマンド名と引数列を取り出す
 */
export function parseMessage(msg: string) {
    const cmdAndArgs = msg.trim().replace(prefix, '').trim();
    const cmdName = cmdAndArgs.split(/ +/)[0];
    const args: string[] = [];
    let msgStartPos = -1;
    const quoteInfo = {
        single: -1,
        double: -1
    };
    const tokens = (cmdAndArgs.replace(cmdName, '').trim() + ' ').split('');
    tokens.forEach((s, idx) => {
        if (s === '\'' && quoteInfo.double === -1) {
            if (quoteInfo.single === -1) {
                quoteInfo.single = idx;
            } else if (tokens[idx - 1] !== '\\') {
                args.push(tokens.slice(quoteInfo.single + 1, idx).join(''));
                quoteInfo.single = -1;
            }
        } else if (s === '"' && quoteInfo.single === -1) {
            if (quoteInfo.double === -1) {
                quoteInfo.double = idx;
            } else if (tokens[idx - 1] !== '\\') {
                args.push(tokens.slice(quoteInfo.double + 1, idx).join(''));
                quoteInfo.double = -1;
            }
        } else if (
            !s.match(/\s/) &&
            msgStartPos === -1 &&
            quoteInfo.single === -1 &&
            quoteInfo.double === -1
        ) {
            msgStartPos = idx;
        } else if (s.match(/\s/) && msgStartPos >= 0) {
            args.push(tokens.slice(msgStartPos, idx).join(''));
            msgStartPos = -1;
        }
    });
    const argsError =
        msgStartPos !== -1 ||
        quoteInfo.single !== -1 ||
        quoteInfo.double !== -1;
    return { commandName: cmdName, args, argsError };
}

/**
 * オブジェクトをクエリ文字列に変換する
 */
export function objectToQueryString(obj: {[key: string]: string}) {
    return '?' + Object.entries(obj).reduce((query, [key, value]) => {
        return query + (query && '&') + key + '=' + value;
    }, '');
}

/**
 * [0, n)の区間でランダムな整数を返す
 */
export function randomInt(n: number) {
    return Math.floor(Math.random() * n);
}

/**
 * 与えられた配列のコピーをシャッフルして返却する
 */
export function shuffleArray<T>(target: T[]): T[] {
    const result = [...target];
    if (result.length <= 1) {
        return result;
    }
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * 長さが0の場合にtrueを返す
 */
export function isEmpty(seq: { length: number }) {
    return seq.length === 0;
}

/**
 * 配列から1要素をランダムに取り出す
 */
export function pickUpRandom<T>(items: T[]) {
    return items[randomInt(items.length)];
}

/**
 * 関数のメモ化関数
 */
export function IdiotCache<T extends Function>(f: T) {
    const cache = new Map();
    return ((...args: any[]) => {
        if (cache.has(args.join(','))) {
            return cache.get(args.join(','));
        }
        const r = f(...args);
        cache.set(args.join(','), r);
        return r;
    }) as any as T;
};

/**
 * レーベンシュタイン距離を求める
 */
export function getLevenshteinDistance(s: string, t: string) {
    const ld = IdiotCache((s: string, t: string): number => {
        if (!s) {
            return t.length;
        }
        if (!t) {
            return s.length;
        }
        if (s[0] === t[0]) {
            return ld(s.slice(1), t.slice(1));
        }
        const l1 = ld(s, t.slice(1));
        const l2 = ld(s.slice(1), t);
        const l3 = ld(s.slice(1), t.slice(1));
        return 1 + Math.min(l1, l2, l3)
    });
    return ld(s, t);
}

/**
 * 正規化されたレーベンシュタイン距離を求める
 */
export function getNormalizedLevenshteinDistance(s: string, t: string) {
    return getLevenshteinDistance(s, t) / Math.max(s.length, t.length);
}

/**
 * レーベンシュタイン類似度を求める
 */
export function getLevenshteinSimilarity(s: string, t: string) {
    return -getNormalizedLevenshteinDistance(s, t) + 1;
}

/**
 * 文字列の配列からオプション形式の文を作成する
 * 例） ['hoge', 'fuga', 'piyo'] => '`hoge`, `fuga` or `piyo`'
 */
export function getOptionsMessage(strs: string[]) {
    const len = strs.length;
    if (len === 0) {
        return '';
    }
    if (len === 1) {
        return `\`${strs[0]}\``;
    }
    return (
        `${strs.slice(0, len - 1).map(str => `\`${str}\``).join(', ')}` +
        ` or \`${strs[len - 1]}\``
    );
}
