const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en";

function jsonResponse(statusCode, body, cacheControl = "no-store") {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  const word = event.queryStringParameters?.word?.trim();

  if (!word || word.length > 100) {
    return jsonResponse(400, { error: "Provide a word between 1 and 100 characters." });
  }

  try {
    const response = await fetch(`${DICTIONARY_API}/${encodeURIComponent(word)}`);
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": response.ok ? "public, max-age=3600, s-maxage=86400" : "no-store",
      },
      body,
    };
  } catch {
    return jsonResponse(502, { error: "The dictionary service is temporarily unavailable." });
  }
}
