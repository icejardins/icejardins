import { google } from "googleapis";

interface LeadData {
  name: string;
  email: string;
  visitorType: string;
  phone?: string;
  website?: string;
  formLoadedAt?: number;
}

// In-Memory Rate Limiter by IP (Sliding Window)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per 10 minutes per IP
const ipRequestStore = new Map<string, number[]>();

// Minimum time in ms required for a human to fill the form (2.5 seconds)
const MIN_HUMAN_FILL_TIME_MS = 2500;

// Known disposable/temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "yopmail.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "trashmail.com",
  "dispostable.com",
  "sharklasers.com",
  "getnada.com",
  "throwawaymail.com",
  "fakeinbox.com",
  "mohmal.com"
]);

function cleanExpiredIpRecords(now: number) {
  for (const [ip, timestamps] of ipRequestStore.entries()) {
    const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (validTimestamps.length === 0) {
      ipRequestStore.delete(ip);
    } else {
      ipRequestStore.set(ip, validTimestamps);
    }
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  cleanExpiredIpRecords(now);

  const existingTimestamps = ipRequestStore.get(ip) || [];
  const recentTimestamps = existingTimestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  recentTimestamps.push(now);
  ipRequestStore.set(ip, recentTimestamps);
  return true;
}

function getClientIp(req: any): string {
  const forwardedFor =
    req.headers?.["x-forwarded-for"] ||
    req.headers?.["x-vercel-forwarded-for"] ||
    req.headers?.["x-real-ip"];

  if (forwardedFor) {
    const ip = String(forwardedFor).split(",")[0].trim();
    if (ip) return ip;
  }

  return req.socket?.remoteAddress || req.connection?.remoteAddress || "127.0.0.1";
}

function getServiceAccountCredentials() {
  const jsonEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (jsonEnv) {
    try {
      const parsed = JSON.parse(
        jsonEnv.startsWith("{") ? jsonEnv : Buffer.from(jsonEnv, "base64").toString("utf8")
      );
      return {
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key,
        projectId: parsed.project_id
      };
    } catch {
      console.warn("[api/send-lead] Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON");
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

function createRawEmail({
  to,
  from,
  replyTo,
  subject,
  html,
  text,
  listUnsubscribe,
  listUnsubscribePost
}: {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  listUnsubscribe?: string;
  listUnsubscribePost?: string;
}): string {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const boundary = `__boundary_${Date.now().toString(16)}__`;

  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : "",
    `Subject: ${utf8Subject}`,
    "MIME-Version: 1.0",
    listUnsubscribe ? `List-Unsubscribe: ${listUnsubscribe}` : "",
    listUnsubscribePost ? `List-Unsubscribe-Post: ${listUnsubscribePost}` : "",
    `Content-Type: multipart/alternative; boundary="${boundary}"`
  ].filter(Boolean);

  const messageParts = [
    headers.join("\r\n"),
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    `--${boundary}--`
  ];

  const message = messageParts.join("\r\n");
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default async function handler(req: any, res: any) {
  // CORS configuration
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
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const clientIp = getClientIp(req);

    // 1. IP Rate Limiting Check (Max 3 requests / 10 min)
    if (!checkRateLimit(clientIp)) {
      console.warn(`[api/send-lead] Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).json({
        error: "Muitas tentativas em pouco tempo. Por favor, aguarde alguns minutos antes de tentar novamente."
      });
    }

    const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body || {}) as LeadData & {
      resourceTitle?: string;
      resourceSlug?: string;
      resourceSubtitle?: string;
      resourceDescription?: string;
      resourcePdfUrl?: string;
    };
    const {
      name,
      email,
      visitorType,
      phone,
      website,
      formLoadedAt,
      resourceTitle,
      resourceSlug,
      resourceSubtitle,
      resourceDescription
    } = body;

    // 2. Honeypot anti-spam protection: if the hidden website field is filled, silently return success
    if (website && website.trim().length > 0) {
      console.warn(`[api/send-lead] Bot caught by honeypot from IP: ${clientIp}`);
      return res.status(200).json({ success: true, message: "Recebido com sucesso." });
    }

    // 3. Time-based submission check (Bots submit in milliseconds)
    const now = Date.now();
    if (formLoadedAt && typeof formLoadedAt === "number") {
      const elapsedMs = now - formLoadedAt;
      if (elapsedMs < MIN_HUMAN_FILL_TIME_MS) {
        console.warn(
          `[api/send-lead] Bot caught by speed check (${elapsedMs}ms < ${MIN_HUMAN_FILL_TIME_MS}ms) from IP: ${clientIp}`
        );
        // Silently return success to fool bot scripts
        return res.status(200).json({ success: true, message: "Recebido com sucesso." });
      }
    }

    // 4. Data validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "O campo Nome é obrigatório." });
    }

    if (!email || !email.trim() || !email.includes("@")) {
      return res.status(400).json({ error: "O campo E-mail é obrigatório e deve ser válido." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailDomain = cleanEmail.split("@")[1];

    // 5. Disposable temporary email check
    if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
      console.warn(`[api/send-lead] Blocked disposable email domain: ${emailDomain}`);
      return res.status(400).json({
        error: "Por favor, utilize um endereço de e-mail corporativo ou pessoal válido."
      });
    }

    const cleanName = name.trim();
    const cleanVisitorType = visitorType?.trim() || null;
    const cleanPhone = phone?.trim() || "Não informado";
    const cleanResourceTitle = resourceTitle?.trim() || "Quando a cabeça não para";
    const cleanResourceSlug = resourceSlug?.trim() || "quando-a-cabeca-nao-para";
    const cleanResourceSubtitle = resourceSubtitle?.trim() || "";
    const cleanResourceDescription = resourceDescription?.trim() || "";
    const timestamp = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

    const { clientEmail, privateKey } = getServiceAccountCredentials();
    const impersonatedUser =
      process.env.GOOGLE_IMPERSONATED_USER ||
      process.env.GMAIL_SENDER_EMAIL ||
      process.env.GOOGLE_SENDER_EMAIL ||
      "secretaria@icejardins.org.br";
    const notificationEmail =
      process.env.LEAD_NOTIFICATION_EMAIL ||
      process.env.NOTIFICATION_EMAIL ||
      "secretaria@icejardins.org.br";

    const fromName = process.env.EMAIL_FROM_NAME || "ICE Jardins";
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || impersonatedUser;
    const replyToAddress = process.env.EMAIL_REPLY_TO || impersonatedUser;

    if (!clientEmail || !privateKey) {
      console.warn(
        "[api/send-lead] Google Service Account credentials are not configured in environment variables.",
        {
          hasClientEmail: !!clientEmail,
          hasPrivateKey: !!privateKey,
          data: { cleanName, cleanEmail, cleanVisitorType, cleanPhone, cleanResourceTitle, timestamp, clientIp }
        }
      );

      // Return success in dev / unconfigured environments so the UI works gracefully
      return res.status(200).json({
        success: true,
        mock: true,
        message:
          "Lead recebido com sucesso (Ambiente sem credenciais do Google configuradas).",
        data: { name: cleanName, email: cleanEmail, resourceTitle: cleanResourceTitle }
      });
    }

    // Authenticate with Google Service Account using domain-wide delegation (impersonating church sender)
    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/gmail.send"],
      subject: impersonatedUser
    });

    await jwtClient.authorize();

    const gmail = google.gmail({ version: "v1", auth: jwtClient });

    // 1. Email notification to Church Staff / Leadership
    const churchSubject = cleanVisitorType
      ? `Novo Lead de Recurso (${cleanResourceTitle}): ${cleanName} (${cleanVisitorType})`
      : `Novo Lead de Recurso (${cleanResourceTitle}): ${cleanName}`;
    const churchHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #12383A; line-height: 1.6;">
        <div style="background: #145F63; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">ICE Jardins — Novo Lead de Recurso</h2>
        </div>
        <div style="background: #F4F8F8; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #E2F0F1; border-top: none;">
          <p style="font-size: 16px; margin-top: 0;">Um visitante solicitou o material <strong>"${cleanResourceTitle}"</strong> através do site:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 35%; color: #4D6B6D;">Recurso:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #12383A; font-weight: 600;">${cleanResourceTitle}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 35%; color: #4D6B6D;">Nome:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #12383A; font-weight: 600;">${cleanName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #4D6B6D;">E-mail:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #12383A;"><a href="mailto:${cleanEmail}" style="color: #145F63;">${cleanEmail}</a></td>
            </tr>
            ${
              cleanVisitorType
                ? `<tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #4D6B6D;">Perfil / Pessoa:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #12383A;"><strong>${cleanVisitorType}</strong></td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #4D6B6D;">WhatsApp / Telefone:</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #12383A;">${cleanPhone}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #4D6B6D;">Data e Hora:</td>
              <td style="padding: 12px 16px; color: #12383A;">${timestamp}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${cleanEmail}" style="display: inline-block; background: #145F63; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Responder ao Visitante</a>
          </div>
        </div>
      </div>
    `;

    const churchText = `
ICE Jardins — Novo Lead de Recurso
Recurso: ${cleanResourceTitle}

Nome: ${cleanName}
E-mail: ${cleanEmail}
${cleanVisitorType ? `Perfil / Pessoa: ${cleanVisitorType}\n` : ""}WhatsApp / Telefone: ${cleanPhone}
Data/Hora: ${timestamp}
    `.trim();

    const rawChurchEmail = createRawEmail({
      to: notificationEmail,
      from: `ICE Jardins <${impersonatedUser}>`,
      replyTo: cleanEmail,
      subject: churchSubject,
      html: churchHtml,
      text: churchText
    });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: rawChurchEmail }
    });

    // 2. Email confirmation & resource guide to the visitor
    try {
      const visitorSubject = `Aqui está o seu material: ${cleanResourceTitle}`;
      const unsubscribeUrl = `https://icejardins.org.br/descadastro?email=${encodeURIComponent(cleanEmail)}`;
      const unsubscribeMailto = `mailto:${impersonatedUser}?subject=${encodeURIComponent(`Descadastro: ${cleanEmail}`)}`;
      const listUnsubscribeHeader = `<${unsubscribeUrl}>, <${unsubscribeMailto}>`;
      const guidePageUrl = `https://icejardins.org.br/recursos/${cleanResourceSlug}/obrigado/`;

      const fullResourceTitleDisplay = cleanResourceSubtitle
        ? `${cleanResourceTitle}: ${cleanResourceSubtitle}`
        : cleanResourceTitle;

      const visitorHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #12383A; line-height: 1.6;">
          <div style="background: #145F63; padding: 28px 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Olá, ${cleanName}!</h1>
            <p style="color: #E2F0F1; margin: 8px 0 0; font-size: 15px;">Aqui está o seu material.</p>
          </div>
          <div style="background: #ffffff; padding: 32px 24px; border-radius: 0 0 8px 8px; border: 1px solid #E2F0F1; border-top: none;">
            <p style="font-size: 16px;">Ficamos muito felizes pelo seu contato. O material <strong>"${fullResourceTitleDisplay}"</strong> foi preparado com dedicação e base bíblica para enriquecer sua caminhada e vida espiritual.</p>
            
            ${cleanResourceDescription ? `<p style="font-size: 15px; color: #4D6B6D; line-height: 1.6;">${cleanResourceDescription}</p>` : ""}

            <div style="text-align: center; margin: 32px 0;">
              <a href="${guidePageUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #145F63; color: #ffffff; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(20,95,99,0.25);">
                📖 Acessar e Baixar: ${cleanResourceTitle}
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #E2F0F1; margin: 28px 0;" />

            <h3 style="color: #145F63; font-size: 18px; margin-bottom: 8px;">Venha nos fazer uma visita!</h3>
            <p style="font-size: 14px; color: #4D6B6D; margin-top: 0;">Nossa igreja está de portas abertas para você e sua família:</p>
            
            <p style="font-size: 14px; margin: 4px 0;">
              📍 <strong>Endereço:</strong> Auditório do Colégio In-Nova, Condomínio Estância Jardim Botânico II, Jardim Botânico, Brasília - DF<br />
              ⏰ <strong>Culto:</strong> Domingos às 09:30h
            </p>

            <p style="font-size: 13px; color: #888; margin-top: 28px; text-align: center;">
              Igreja Cristã Evangélica Jardins · <a href="https://icejardins.org.br" style="color: #145F63;">icejardins.org.br</a>
            </p>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2F0F1; font-size: 12px; color: #777; text-align: center; line-height: 1.5;">
              Você recebeu este e-mail porque solicitou este material em nosso site. Se não deseja mais receber nossos e-mails, <a href="${unsubscribeUrl}" style="color: #145F63; text-decoration: underline;">clique aqui para cancelar</a>.
            </div>
          </div>
        </div>
      `;

      const visitorText = `
Olá, ${cleanName}!

Aqui está o seu material: "${fullResourceTitleDisplay}".

Você pode acessar a página do material e fazer o download no link abaixo:
${guidePageUrl}

Venha nos fazer uma visita!
Endereço: Auditório do Colégio In-Nova, Condomínio Estância Jardim Botânico II, Jardim Botânico, Brasília - DF
Culto: Domingos às 09:30h

Igreja Cristã Evangélica Jardins
https://icejardins.org.br

---
Você recebeu este e-mail porque solicitou este material em nosso site. Se não deseja mais receber nossos e-mails, clique aqui para cancelar: ${unsubscribeUrl}
      `.trim();

      const rawVisitorEmail = createRawEmail({
        to: cleanEmail,
        from: `${fromName} <${fromAddress}>`,
        replyTo: replyToAddress,
        subject: visitorSubject,
        html: visitorHtml,
        text: visitorText,
        listUnsubscribe: listUnsubscribeHeader,
        listUnsubscribePost: "List-Unsubscribe=One-Click"
      });

      await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: rawVisitorEmail }
      });
    } catch (visitorErr) {
      console.error("[api/send-lead] Error sending confirmation to visitor:", visitorErr);
      // Non-fatal: church notification was already sent
    }

    return res.status(200).json({
      success: true,
      message: "Lead registrado e e-mails enviados com sucesso!"
    });
  } catch (err: any) {
    console.error("[api/send-lead] Fatal error sending email:", err);
    return res.status(500).json({
      error: "Ocorreu um erro ao processar o formulário. Por favor, tente novamente.",
      details: err?.message || String(err)
    });
  }
}
