// functions/api/lead-submit.ts
//
// Cloudflare Pages Function, die als Server-zu-Server Proxy zwischen der
// Verkäufer-LP (verkauf.reiter-immobilien.net) und dem n8n-Webhook läuft.
//
// Zweck:
//  1. CORS umgehen: n8n akzeptiert nur Requests von reiter-immobilien.net,
//     das Frontend ist aber gleiche Origin wie diese Function -> kein CORS.
//  2. IP-Capture: Die echte Client-IP wird serverseitig aus dem
//     "CF-Connecting-IP" Header gelesen und in den Payload gemerged.
//     Damit kann der Client die IP nicht manipulieren (DSGVO-Audit-Trail).

const N8N_ENDPOINT =
  'https://n8n.max-mp.de/webhook/reiterimmobilien-eigentuemer-import';

type LeadPayload = Record<string, unknown>;

export const onRequestPost: PagesFunction = async (context) => {
  const { request } = context;

  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return jsonResponse(400, {
      status: 'error',
      reason: 'invalid json',
    });
  }

  // Echte Client-IP aus Cloudflare-Header, fällt sonst auf X-Forwarded-For zurück.
  const clientIp =
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    '';

  const merged: LeadPayload = {
    ...payload,
    consent_ip: clientIp,
  };

  try {
    const upstream = await fetch(N8N_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    });

    // Body 1:1 durchreichen, inkl. Content-Type (falls n8n JSON zurückgibt).
    const body = await upstream.text();
    const contentType =
      upstream.headers.get('Content-Type') ?? 'application/json';

    return new Response(body, {
      status: upstream.status,
      headers: { 'Content-Type': contentType },
    });
  } catch {
    return jsonResponse(500, {
      status: 'error',
      reason: 'proxy failure',
    });
  }
};

// Alle anderen Methoden sauber ablehnen (kein GET, PUT, OPTIONS etc.).
export const onRequest: PagesFunction = async () => {
  return new Response(
    JSON.stringify({ status: 'error', reason: 'method not allowed' }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'POST',
      },
    },
  );
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
