import { afterEach, expect, test, vi } from "vitest";
import { handler as dictionaryHandler } from "../../netlify/functions/dictionary.mjs";
import { handler as datamuseHandler } from "../../netlify/functions/datamuse.mjs";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("dictionary function proxies a word and preserves the upstream response", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(
    JSON.stringify([{ word: "moon" }]),
    { status: 200, headers: { "Content-Type": "application/json" } },
  ));
  vi.stubGlobal("fetch", fetchMock);

  const response = await dictionaryHandler({ queryStringParameters: { word: "moon" } });

  expect(fetchMock).toHaveBeenCalledWith("https://api.dictionaryapi.dev/api/v2/entries/en/moon");
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)[0].word).toBe("moon");
});

test("datamuse function forwards only supported query parameters", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(
    JSON.stringify([{ word: "tune" }]),
    { status: 200, headers: { "Content-Type": "application/json" } },
  ));
  vi.stubGlobal("fetch", fetchMock);

  const response = await datamuseHandler({
    queryStringParameters: {
      resource: "words",
      rel_rhy: "moon",
      max: "8",
      unsupported: "ignored",
    },
  });

  expect(fetchMock).toHaveBeenCalledWith("https://api.datamuse.com/words?rel_rhy=moon&max=8");
  expect(response.statusCode).toBe(200);
});

test("functions reject invalid requests before contacting an upstream API", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  const dictionaryResponse = await dictionaryHandler({ queryStringParameters: {} });
  const datamuseResponse = await datamuseHandler({
    queryStringParameters: { resource: "everything", q: "moon" },
  });

  expect(dictionaryResponse.statusCode).toBe(400);
  expect(datamuseResponse.statusCode).toBe(400);
  expect(fetchMock).not.toHaveBeenCalled();
});
