import { google } from "googleapis";

function getServiceAccountCredentials() {
  const jsonEnv =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT ||
    process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ||
    process.env.GCP_SERVICE_ACCOUNT;

  if (jsonEnv) {
    try {
      const trimmed = jsonEnv.trim();
      const parsed = JSON.parse(
        trimmed.startsWith("{") ? trimmed : Buffer.from(trimmed, "base64").toString("utf8")
      );
      return {
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key ? parsed.private_key.replace(/\\n/g, "\n") : undefined,
        projectId: parsed.project_id
      };
    } catch (e: any) {
      console.warn("[api/translate] Failed to parse service account JSON:", e.message);
    }
  }

  const clientEmail =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_CLIENT_EMAIL ||
    process.env.GMAIL_CLIENT_EMAIL;

  let privateKey =
    process.env.GOOGLE_PRIVATE_KEY ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    process.env.GMAIL_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  return {
    clientEmail,
    privateKey,
    projectId: process.env.GOOGLE_PROJECT_ID
  };
}

async function translateWithGoogleCloud(
  texts: string[],
  targetLang: string,
  sourceLang: string = "pt",
  format: "html" | "text" = "html"
): Promise<string[]> {
  const credentials = getServiceAccountCredentials();

  if (!credentials.clientEmail || !credentials.privateKey) {
    throw new Error(
      `Credenciais Google Service Account não encontradas no ambiente (clientEmail: ${!!credentials.clientEmail}, privateKey: ${!!credentials.privateKey})`
    );
  }

  // 1. Obter token de acesso OAuth2 usando Service Account JWT
  const jwtClient = new google.auth.JWT({
    email: credentials.clientEmail,
    key: credentials.privateKey,
    scopes: [
      "https://www.googleapis.com/auth/cloud-translation",
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  });

  const authData = await jwtClient.authorize();
  const accessToken = authData.access_token;

  if (!accessToken) {
    throw new Error("Falha ao gerar o token de acesso OAuth2 com a conta de serviço.");
  }

  // 2. Fazer requisição POST oficial à Cloud Translation API v2
  const res = await fetch("https://translation.googleapis.com/language/translate/v2", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      q: texts,
      target: targetLang,
      source: sourceLang,
      format
    })
  });

  const responseJson = await res.json();

  if (!res.ok) {
    const errorDetails =
      responseJson.error?.message ||
      responseJson.error ||
      JSON.stringify(responseJson);
    throw new Error(`Google Cloud Translation API (HTTP ${res.status}): ${errorDetails}`);
  }

  const translations = responseJson.data?.translations;
  if (!translations || !Array.isArray(translations)) {
    throw new Error("Estrutura de resposta inesperada da Google Cloud Translation API");
  }

  return translations.map((t: any) => t.translatedText || "");
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Utilize POST." });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const {
      text,
      texts,
      targetLang = "es",
      sourceLang = "pt",
      format = "html"
    } = body || {};

    if (targetLang !== "en" && targetLang !== "es") {
      return res.status(400).json({ error: "targetLang deve ser 'en' ou 'es'" });
    }

    const inputList: string[] = Array.isArray(texts)
      ? texts
      : typeof text === "string"
      ? [text]
      : [];

    if (inputList.length === 0) {
      return res.status(400).json({ error: "Envie 'text' (string) ou 'texts' (array de strings)" });
    }

    const translatedList = await translateWithGoogleCloud(
      inputList,
      targetLang,
      sourceLang,
      format
    );

    // Cache Edge CDN por 24h
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");

    if (typeof text === "string" && !Array.isArray(texts)) {
      return res.status(200).json({ translatedText: translatedList[0] || "" });
    }

    return res.status(200).json({ translations: translatedList });
  } catch (err: any) {
    console.error("[api/translate] Erro:", err?.message || err);
    return res.status(500).json({
      error: "Falha na tradução",
      details: err?.message || String(err)
    });
  }
}
