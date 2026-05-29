import { SefariaV3TextResponse } from "../types";

const BASE_URL = "https://www.sefaria.org";

export async function getTexts(tref: string): Promise<SefariaV3TextResponse> {
  const encoded = encodeURIComponent(tref);
  const res = await fetch(`${BASE_URL}/api/v3/texts/${encoded}`);
  if (!res.ok) {
    throw new Error(`Sefaria API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<SefariaV3TextResponse>;
}
