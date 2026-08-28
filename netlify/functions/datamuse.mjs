const DATAMUSE_API = "https://api.datamuse.com";
const ALLOWED_RESOURCES = new Set(["sug", "words"]);
const ALLOWED_PARAMETERS = new Set([
  "s",
  "max",
  "rel_syn",
  "rel_ant",
  "rel_rhy",
  "md",
  "sp",
  "qe",
]);

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
  const query = event.queryStringParameters || {};
  const resource = query.resource;

  if (!ALLOWED_RESOURCES.has(resource)) {
    return jsonResponse(400, { error: "Unsupported Datamuse resource." });
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (ALLOWED_PARAMETERS.has(key) && typeof value === "string") {
      params.set(key, value);
    }
  }

  if (![...params.keys()].length) {
    return jsonResponse(400, { error: "Provide at least one supported search parameter." });
  }

  try {
    const response = await fetch(`${DATAMUSE_API}/${resource}?${params}`);
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": response.ok ? "public, max-age=900, s-maxage=3600" : "no-store",
      },
      body,
    };
  } catch {
    return jsonResponse(502, { error: "The word-association service is temporarily unavailable." });
  }
}
