const http = require('node:http');
const { randomUUID } = require('node:crypto');

const PORT = Number(process.env.MOCK_API_PORT || 3002);
const API_PREFIX = '/api/v1';
const clients = new Set();

let processing = false;
let sessionId = randomUUID();
let telemetry = { calls: 0, costUsd: 0, latencyMs: 0 };
let messages = [
  {
    role: 'assistant',
    content:
      '## Bagis kampanyasi dogrulamasi\n\nMock API hazir. Bir analiz mesaji gonderildiginde SSE uzerinden agent runtime akisi simule edilir.',
    timestamp: new Date().toISOString(),
    kind: 'analysis_response',
  },
];
let graphVersion = 1;

function json(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(JSON.stringify(body));
}

function notFound(res) {
  json(res, 404, { error: 'Endpoint not found', statusCode: 404 });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
  });
}

function sendEvent(res, event) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

function broadcast(event) {
  for (const client of clients) {
    sendEvent(client, event);
  }
}

function sessionGraph() {
  return {
    nodes: [
      { id: 'claim-main', label: 'Claim', caption: 'Kullanici iddiasi' },
      { id: 'supervisor', label: 'Agent', caption: 'Supervisor' },
      { id: 'identity-agent', label: 'Agent', caption: 'Identity Agent' },
      { id: 'media-agent', label: 'Agent', caption: 'Media Agent' },
      { id: 'strategy-agent', label: 'Agent', caption: 'Strategy Agent' },
      { id: 'source-domain', label: 'Source', caption: 'Yeni kayitli domain' },
      { id: 'visual-evidence', label: 'Evidence', caption: 'Ters gorsel eslesmesi' },
    ],
    edges: [
      { from: 'supervisor', to: 'claim-main', label: 'ROUTES', caption: 'claim routing' },
      { from: 'identity-agent', to: 'source-domain', label: 'CHECKS', caption: 'domain/user pivot' },
      { from: 'media-agent', to: 'visual-evidence', label: 'FINDS', caption: 'reverse image' },
      { from: 'source-domain', to: 'claim-main', label: 'RISK', caption: 'new domain' },
      { from: 'visual-evidence', to: 'claim-main', label: graphVersion % 2 ? 'CONTRADICTS' : 'SUPPORTS', caption: 'context check' },
      { from: 'strategy-agent', to: 'claim-main', label: 'REVIEWS', caption: 'false-positive review' },
    ],
  };
}

function startMockResearch(message) {
  processing = true;
  const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };
  messages.push(userMessage);

  const events = [
    [0, { type: 'user_message', content: message, ts: new Date().toISOString() }],
    [100, { type: 'status', processing: true }],
    [500, { type: 'progress', msg: 'Supervisor: Ilk iddia siniflandiriliyor ve gorevler uzman hatlara dagitiliyor.', ts: '00:00:01' }],
    [1200, { type: 'progress', msg: 'Identity Agent: Iliskili sosyal profiller, kullanici adlari ve e-posta pivotlari araniyor.', ts: '00:00:02' }],
    [
      1700,
      {
        type: 'detail',
        toolName: 'run_sherlock',
        toolCallId: randomUUID(),
        output: 'Mock sonuc: kullanici adi 4 platformda bulundu; 1 profil dusuk guvenli eslesme olarak isaretlendi.',
      },
    ],
    [2400, { type: 'progress', msg: 'Media Agent: Ters gorsel arama ve EXIF kontrolu yurutuluyor.', ts: '00:00:03' }],
    [
      3000,
      {
        type: 'detail',
        toolName: 'reverse_image_search',
        toolCallId: randomUUID(),
        output: 'Mock sonuc: gorsel daha once farkli bir baglamda kullanilmis olabilir.',
      },
    ],
    [3600, { type: 'progress', msg: 'Strategy Agent: Kanitlar celiski, guven ve false-positive acisindan inceleniyor.', ts: '00:00:04' }],
    [4100, { type: 'telemetry', msg: '[Mock Telemetry] 5 tool event', ts: '00:00:05', summary: { calls: 5, costUsd: 0.03, latencyMs: 4100 } }],
    [4500, { type: 'session_graph_dirty' }],
    [
      5200,
      {
        type: 'response',
        content:
          `## Mock analiz sonucu\n\n**Sorgu:** ${message}\n\nSupervisor akisi tamamlandi. Kimlik, medya ve strateji ajanlari mock verilerle sinyal urettiler.\n\n- Guven skoru: 68%\n- Risk: Belirsiz / incelenmeli\n- Kanit: 2 tool detayi\n- Oneri: Gercek backend hazir oldugunda ayni endpoint sozlesmesiyle cevap donmelidir.`,
      },
    ],
    [5300, { type: 'status', processing: false }],
  ];

  for (const [delay, event] of events) {
    setTimeout(() => {
      if (event.type === 'telemetry' && event.summary) telemetry = event.summary;
      if (event.type === 'session_graph_dirty') graphVersion += 1;
      if (event.type === 'response') {
        messages.push({ role: 'assistant', content: event.content, timestamp: new Date().toISOString(), kind: 'analysis_response' });
      }
      if (event.type === 'status' && event.processing === false) processing = false;
      broadcast(event);
    }, delay);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    return json(res, 204, {});
  }

  if (!url.pathname.startsWith(API_PREFIX)) {
    return notFound(res);
  }

  const path = url.pathname.slice(API_PREFIX.length) || '/';

  try {
    if (req.method === 'GET' && path === '/health') {
      return json(res, 200, {
        status: 'ok',
        version: 'mock-1.0.0',
        uptime: 'mock session',
        neo4j: 'mock connected (7 nodes, 6 rels)',
        sessionId,
        toolCount: 48,
      });
    }

    if (req.method === 'GET' && path === '/status') {
      return json(res, 200, { processing });
    }

    if (req.method === 'GET' && path === '/history') {
      return json(res, 200, { messages });
    }

    if (req.method === 'GET' && path === '/graph/session') {
      return json(res, 200, sessionGraph());
    }

    if (req.method === 'GET' && path === '/graph/stats') {
      return json(res, 200, { nodes: sessionGraph().nodes.length, relationships: sessionGraph().edges.length });
    }

    if (req.method === 'GET' && path === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });
      clients.add(res);
      sendEvent(res, {
        type: 'init',
        sessionId,
        processing,
        messageCount: messages.length,
        telemetry,
        replayEvents: [],
      });
      req.on('close', () => clients.delete(res));
      return;
    }

    if (req.method === 'POST' && path === '/chat') {
      const body = await readBody(req);
      if (typeof body.message !== 'string' || !body.message.trim()) {
        return json(res, 400, { error: 'message is required', statusCode: 400 });
      }
      if (processing) {
        return json(res, 409, { error: 'Research in progress', statusCode: 409 });
      }
      startMockResearch(body.message.trim());
      return json(res, 200, { ok: true, message: 'Mock research started' });
    }

    if (req.method === 'POST' && path === '/reset') {
      processing = false;
      sessionId = randomUUID();
      telemetry = { calls: 0, costUsd: 0, latencyMs: 0 };
      messages = [];
      graphVersion += 1;
      broadcast({ type: 'reset', sessionId });
      return json(res, 200, { ok: true, sessionId });
    }

    return notFound(res);
  } catch (error) {
    return json(res, 500, {
      error: error instanceof Error ? error.message : 'Mock API error',
      statusCode: 500,
    });
  }
});

server.listen(PORT, () => {
  console.log(`OSINT mock API running at http://localhost:${PORT}${API_PREFIX}`);
});
