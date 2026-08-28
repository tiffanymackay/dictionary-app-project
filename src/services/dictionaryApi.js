const IS_DEVELOPMENT = import.meta.env.DEV;
const DICTIONARY_ENDPOINT = IS_DEVELOPMENT
  ? "/dictionary-api/api/v2/entries/en"
  : "/.netlify/functions/dictionary";
const DATAMUSE_ENDPOINT = IS_DEVELOPMENT
  ? "/datamuse-api"
  : "/.netlify/functions/datamuse";

export class WordNotFoundError extends Error {
  constructor(word) {
    super(`No dictionary entry found for ${word}`);
    this.name = "WordNotFoundError";
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  return response.json();
}

function getDictionaryUrl(word) {
  const encodedWord = encodeURIComponent(word);
  return IS_DEVELOPMENT
    ? `${DICTIONARY_ENDPOINT}/${encodedWord}`
    : `${DICTIONARY_ENDPOINT}?word=${encodedWord}`;
}

function getDatamuseUrl(resource, params) {
  if (IS_DEVELOPMENT) return `${DATAMUSE_ENDPOINT}/${resource}?${params}`;

  const functionParams = new URLSearchParams(params);
  functionParams.set("resource", resource);
  return `${DATAMUSE_ENDPOINT}?${functionParams}`;
}

export async function getDictionaryEntry(word, { signal } = {}) {
  const response = await fetch(getDictionaryUrl(word), { signal });
  if (response.status === 404) throw new WordNotFoundError(word);
  if (!response.ok) throw new Error(`Dictionary request failed with ${response.status}`);

  const data = await response.json();
  return data[0];
}

export async function getSuggestions(query, { signal, max = 6 } = {}) {
  if (query.trim().length < 2) return [];
  const params = new URLSearchParams({ s: query.trim(), max: String(max) });
  const data = await requestJson(getDatamuseUrl("sug", params), { signal });
  return data.map(({ word }) => word);
}

export async function getWordConnections(word, { signal } = {}) {
  const makeUrl = (relationship) => {
    const params = new URLSearchParams({ [relationship]: word, max: "8" });
    return getDatamuseUrl("words", params);
  };

  const [synonyms, antonyms] = await Promise.all([
    requestJson(makeUrl("rel_syn"), { signal }),
    requestJson(makeUrl("rel_ant"), { signal }),
  ]);

  return {
    synonyms: synonyms.map(({ word: synonym }) => synonym),
    antonyms: antonyms.map(({ word: antonym }) => antonym),
  };
}

export function toStressPattern(pronunciation = "") {
  return pronunciation
    .trim()
    .split(/\s+/)
    .filter((phoneme) => /[012]$/.test(phoneme))
    .map((phoneme) => phoneme.endsWith("0") ? "◡" : "—")
    .join(" ");
}

function normalizeMeterWord(item) {
  const pronunciation = item.tags?.find((tag) => tag.startsWith("pron:"))?.replace("pron:", "").trim() || "";
  return {
    word: item.word,
    syllables: item.numSyllables ?? null,
    pronunciation,
    stressPattern: toStressPattern(pronunciation),
  };
}

export async function getWriterTools(word, { signal } = {}) {
  const rhymeParams = new URLSearchParams({ rel_rhy: word, md: "sr", max: "32" });
  const meterParams = new URLSearchParams({ sp: word, qe: "sp", md: "sr", max: "1" });
  const [rhymeData, meterData] = await Promise.all([
    requestJson(getDatamuseUrl("words", rhymeParams), { signal }),
    requestJson(getDatamuseUrl("words", meterParams), { signal }),
  ]);

  const meter = meterData.find((item) => item.word.toLowerCase() === word.toLowerCase()) || meterData[0];
  return {
    meter: meter ? normalizeMeterWord(meter) : null,
    exactRhymes: rhymeData
      .filter((item) => item.word.toLowerCase() !== word.toLowerCase())
      .map(normalizeMeterWord),
  };
}
