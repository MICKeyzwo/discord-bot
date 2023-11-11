import { objectToQueryString, isEmpty, pickUpRandom } from './bot-utils';


type SafeLevel = 'strict' | 'normal' | 'unsafe';
type SearchTarget = 'images' | 'videos';

type SearchResponseBase = {
  ads: null;
  next: string;
  query: string;
  queryEncoded: string;
  response_type: SearchTarget;
};

type SearchImageResponseResultItem = {
  height: number;
  image: string;
  source: string;
  thumbnail: string;
  thumbnail_token: string;
  title: string;
  url: string;
  width: number;
};

type SearchVideoResponseResultItem = {
  content: string;
  description: string;
  duration: string;
  embed_html: string;
  embed_url: string;
  image_token: string;
  images: {
    large: string;
    medium: string;
    motion: string;
    small: string;
  };
  provider: string;
  published: string;
  statistics: {
    viewCount: number;
  };
  title: string;
  uploader: string;
};

type SearchImageResponse = SearchResponseBase & {
  results: SearchImageResponseResultItem[];
};

type SearchVideoResponse = SearchResponseBase & {
  results: SearchVideoResponseResultItem[];
}


/**
 * 文字列の引数列から検索用オプションを生成する
 */
export function parseSearchArgs(args: string[]) {
  if (['--strict', '--unsafe'].includes(args[0])) {
    return {
      keyword: args.slice(1).join(' '),
      safeLevel: args[0].replace('--', '') as SafeLevel,
    } as const;
  } else {
    return {
      keyword: args.join(' '),
      safeLevel: 'normal' as SafeLevel,
    } as const;
  }
}

/**
 * DuckDuckGoを用いた画像検索
 */
export async function searchImage(keyword: string, safeLevel: SafeLevel) {
  const cookie = generateDdgCookie(safeLevel);
  const searchPageContent = await fetchDdgSearchPage('images', keyword, cookie)
  const vqd = getVqd(searchPageContent);
  if (isEmpty(vqd)) {
    return 'Oops! Something went wrong. Searching image failed.'
  }
  const searchApiContent = await fetchDdgSearchApi('images', keyword, vqd, safeLevel, cookie);
  if (isEmpty(searchApiContent.results)) {
    return 'Oops! Image not found.';
  }
  const result = pickUpRandom(searchApiContent.results);
  return generateImageUrl(result, safeLevel);
}

/**
 * DuckDuckGoを用いた動画検索
 */
export async function searchVideo(keyword: string, safeLevel: SafeLevel) {
  const cookie = generateDdgCookie(safeLevel);
  const searchPageContent = await fetchDdgSearchPage('videos', keyword, cookie)
  const vqd = getVqd(searchPageContent);
  if (isEmpty(vqd)) {
    return 'Oops! Something went wrong. Searching video failed.'
  }
  const searchApiContent = await fetchDdgSearchApi('videos', keyword, vqd, safeLevel, cookie);
  if (isEmpty(searchApiContent.results)) {
    return 'Oops! Video not found.';
  }
  const result = pickUpRandom(searchApiContent.results);
  return result.content;
}


function generateDdgCookie(safeLevel: SafeLevel) {
  const safeLevelToken =
    safeLevel === 'strict' ? '1'
    : safeLevel === 'normal' ? '-1'
    : '-2';
  return `ah=jp-jp; l=jp-jp; 5=1; ay=b; p=${safeLevelToken}; ae=t;`;
}

async function fetchDdgSearchPage(
  searchTarget: SearchTarget,
  keyword: string,
  cookie: string
) {
  const frontPageUrl =
    'https://duckduckgo.com/' +
    objectToQueryString({
      q: encodeURIComponent(keyword),
      ia: searchTarget,
      iax: searchTarget,
    });
  const frontPageRes = await fetch(frontPageUrl, { headers: { cookie } });
  return decodeURIComponent(await frontPageRes.text());
}

function getVqd(content: string) {
  return content.match(/(?<=vqd=)\d.+?(?=&)/)?.[0] ?? '';
}

async function fetchDdgSearchApi<T extends SearchTarget>(
  searchTarget: T,
  keyword: string,
  vqd: string,
  safeLevel: SafeLevel,
  cookie: string
) {
  const targetScript =
    searchTarget === 'images' ? 'i.js' : 'v.js';
  const searchApiUrl =
    `https://duckduckgo.com/${targetScript}` +
    objectToQueryString({
      l: 'jp-jp',
      o: 'json',
      q: encodeURIComponent(keyword),
      vqd,
      p: safeLevel === 'strict' ? '1' : '-1',
    });
  const searchApiRes = await fetch(searchApiUrl, { headers: { cookie } });
  return await searchApiRes.json() as (
    T extends 'images' ? SearchImageResponse : SearchVideoResponse
  );
}

function generateImageUrl(searchResult: SearchImageResponseResultItem, safeLevel: SafeLevel) {
  const imageUrl =
    'https://external-content.duckduckgo.com/iu/' +
    objectToQueryString({
      u: searchResult.thumbnail,
      f: '1',
      ipt: searchResult.thumbnail_token,
      ipo: 'images',
    });
  if (safeLevel === 'unsafe') {
    return `<${imageUrl}>`;
  }
  return imageUrl;
}
