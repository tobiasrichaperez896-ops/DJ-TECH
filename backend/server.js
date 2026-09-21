const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');
const nodemailer = require('nodemailer');

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadLocalEnv();

const PORT = Number(process.env.PORT || 3000);
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || 'DJ TECH <onboarding@resend.dev>';
const ORDER_FORWARD_URL = process.env.ORDER_FORWARD_URL || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error('invalid-json')); }
    });
    request.on('error', reject);
  });
}

function callGroq(messages) {
  return new Promise((resolve, reject) => {
    if (!GROQ_API_KEY) return reject(new Error('GROQ_API_KEY is not configured'));
    const body = JSON.stringify({ model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b', temperature: 0.1, messages });
    const request = https.request({
      hostname: 'api.groq.com', path: '/openai/v1/chat/completions', method: 'POST',
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) return reject(new Error(`groq-${response.statusCode}: ${data.slice(0, 300)}`));
        try { resolve(JSON.parse(data)); } catch { reject(new Error('invalid-groq-response')); }
      });
    });
    request.on('error', reject);
    request.write(body);
    request.end();
  });
}

async function handleSmartSearch(payload) {
  const catalog = Array.isArray(payload.products) ? payload.products : [];
  const result = await callGroq([
    { role: 'system', content: 'Convert the request into JSON criteria for the provided catalog. Return only JSON with keys query, categories, tags, maxPrice. Never invent catalog values.' },
    { role: 'user', content: JSON.stringify({ request: payload.query, catalog }) }
  ]);
  return JSON.parse(result.choices?.[0]?.message?.content || '{}');
}

async function handleRecommendations(payload) {
  const catalog = Array.isArray(payload.products) ? payload.products : [];
  const result = await callGroq([
    { role: 'system', content: 'Recommend only products from the catalog. Return only JSON: {"productIds":[number]}. Never invent IDs, prices, stock, or features. Maximum three IDs.' },
    { role: 'user', content: JSON.stringify({ request: payload.query, catalog }) }
  ]);
  return JSON.parse(result.choices?.[0]?.message?.content || '{"productIds":[]}');
}

async function handleOrder(payload) {
  if (ORDER_FORWARD_URL) {
    const body = JSON.stringify({ ...payload, adminEmail: ADMIN_EMAIL });
    const target = new URL(ORDER_FORWARD_URL);
    await new Promise((resolve, reject) => {
      const request = https.request({ hostname: target.hostname, port: target.port || 443, path: `${target.pathname}${target.search}`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (response) => {
        response.on('data', () => {});
        response.on('end', () => response.statusCode >= 200 && response.statusCode < 300 ? resolve() : reject(new Error(`order-forward-${response.statusCode}`)));
      });
      request.on('error', reject);
      request.write(body);
      request.end();
    });
    return { accepted: true, configured: true, method: 'forward-url' };
  }

  if (RESEND_API_KEY && ADMIN_EMAIL) {
    const body = JSON.stringify({
      from: RESEND_FROM,
      to: [ADMIN_EMAIL],
      subject: 'Nuevo pedido - DJ TECH',
      text: payload.summary || 'Pedido sin resumen'
    });
    await new Promise((resolve, reject) => {
      const request = https.request({
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) resolve();
          else reject(new Error(`resend-${response.statusCode}: ${data.slice(0, 300)}`));
        });
      });
      request.setTimeout(15000, () => request.destroy(new Error('resend-timeout')));
      request.on('error', reject);
      request.write(body);
      request.end();
    });
    return { accepted: true, configured: true, method: 'resend' };
  }

  if (!SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
    return { accepted: false, configured: false, message: 'Configure SMTP_USER, SMTP_PASS and ADMIN_EMAIL for automatic email delivery.' };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    requireTLS: !SMTP_SECURE,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  await Promise.race([
    transporter.sendMail({ from: SMTP_USER, to: ADMIN_EMAIL, subject: 'Nuevo pedido - DJ TECH', text: payload.summary || 'Pedido sin resumen' }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('smtp-timeout')), 25000))
  ]);
  return { accepted: true, configured: true, method: 'smtp' };
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return sendJson(response, 204, {});
  if (request.method === 'GET' && request.url === '/api/health') return sendJson(response, 200, { ok: true, service: 'dj-tech-backend' });
  if (request.method !== 'POST') return sendJson(response, 404, { error: 'Ruta no disponible' });
  try {
    const payload = await readBody(request);
    if (request.url === '/api/order') return sendJson(response, 200, await handleOrder(payload));
    if (request.url === '/api/smart-search') return sendJson(response, 200, await handleSmartSearch(payload));
    if (request.url === '/api/recommendations') return sendJson(response, 200, await handleRecommendations(payload));
    return sendJson(response, 404, { error: 'Ruta no disponible' });
  } catch (error) {
    sendJson(response, 502, { error: 'La integración no está disponible', detail: error.message });
  }
});

server.listen(PORT, () => console.log(`DJ TECH integrations listening on http://127.0.0.1:${PORT}`));
