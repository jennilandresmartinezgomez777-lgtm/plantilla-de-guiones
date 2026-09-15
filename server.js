const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const OLLAMA_HOST = 'http://127.0.0.1:11434';
const DIR = __dirname;

const DEFAULT_INITIAL_DATA = {
  "clients": [
    "Jennil",
    "Natalia"
  ],
  "scripts": [
    {
      "id": "script-andres-presentacion",
      "client": "Jennil",
      "number": 1,
      "status": "Por Grabar",
      "formato": "Hablando a cámara",
      "objetivo": "VENTA",
      "actor": "Andrés",
      "ideaGanadora": "Presentación y Autoridad - Quién soy y Cómo funciona el Método",
      "linkReferencia": "",
      "gancho": "Hola, soy Andrés. Si estás cansado de intentar métodos que no dan resultados y quieres aprender un sistema real para escalar tus ingresos y dominar el mercado, esto es para ti.",
      "historia": "Durante años he desarrollado y perfeccionado una metodología práctica para que cualquier persona, sin importar su punto de partida, pueda tener un sistema claro de toma de decisiones.\n\nNo se trata de suerte ni de fórmulas mágicas: es estructura, disciplina, herramientas profesionales y acompañamiento en vivo.",
      "moraleja": "El éxito no llega por casualidad, llega cuando sigues un vehículo probado con las personas correctas.",
      "cta": "Comenta la palabra BLEX o escríbeme por interno para acceder a la clase gratuita donde te muestro el paso a paso.",
      "contextoAdicional": "Grabación en setup profesional / oficina",
      "attachments": [],
      "views": 0,
      "comments": 0,
      "rating": 0,
      "completed": false,
      "espacio": "",
      "updatedAt": "2026-09-15T20:37:52.944Z",
      "createdAt": "2026-09-15T00:00:00.000Z"
    },
    {
      "id": "script-trabajar-duro",
      "client": "Jennil",
      "number": 2,
      "status": "Por Grabar",
      "formato": "Hablando a cámara",
      "objetivo": "VIRAL",
      "actor": "Andrés",
      "ideaGanadora": "Mentalidad & Apalancamiento - El Mito de Trabajar Duro",
      "linkReferencia": "",
      "gancho": "Si trabajar duro fuera el secreto para hacerte rico, los obreros de construcción que trabajan 14 horas al día bajo el sol serían los más millonarios del mundo.",
      "historia": "El trabajo duro sin dirección solo te deja exhausto. Los que realmente multiplican sus ingresos no trabajan más horas: se apalancan en sistemas, tecnología y decisiones inteligentes.\n\nMientras unos siguen intercambiando tiempo por dinero, otros construyen vehículos que trabajan para ellos las 24 horas.",
      "moraleja": "No trabajes más duro, trabaja con apalancamiento y con el sistema correcto.",
      "cta": "Comenta la palabra SISTEMA y te muestro el método exacto con el que puedes empezar a transformar tus resultados hoy.",
      "contextoAdicional": "Tomas dinámicas con transiciones y b-rolls de alto impacto",
      "attachments": [],
      "views": 0,
      "comments": 0,
      "rating": 0,
      "completed": false,
      "espacio": "",
      "updatedAt": "2026-09-15T20:37:52.945Z",
      "createdAt": "2026-09-15T01:00:00.000Z"
    },
    {
      "id": "script-no-importa-nivel",
      "client": "Jennil",
      "number": 3,
      "status": "Por Grabar",
      "formato": "Hablando a cámara",
      "objetivo": "VENTA",
      "actor": "Jennil / Andrés",
      "ideaGanadora": "Venta - Casos de Éxito y Metodología desde Cero",
      "linkReferencia": "",
      "gancho": "No importa cuál sea el nivel de conocimiento que tengas, con nosotros podrás aprender desde cero toda la metodología aplicada que utilizaron nuestros alumnos Mabel, Asceineth, Jeison, Tomás, Deysi y Andrés.",
      "historia": "Obtendrás metodología y entorno propio de análisis para que aprendas a tomar tus propias decisiones sin depender de nadie.\n- Plataforma con herramientas exclusivas\n- Sala operativa en vivo 4 veces por semana\n- Acompañamiento personalizado y estrategias rentables\n- Algoritmos entrenados con IA y mucho más.",
      "moraleja": "Aprender un sistema probado es la diferencia entre improvisar y tener resultados consistentes.",
      "cta": "Si quieres tener resultados y mejorar tus ingresos mientras haces lo que amas, escribe la palabra CAMBIO, te ayudaré y te mostraré cómo lograrlo.",
      "contextoAdicional": "PRUEBAS VIDEOS CORTOS (VARIOS)",
      "attachments": [],
      "views": 0,
      "comments": 0,
      "rating": 0,
      "completed": false,
      "espacio": "",
      "updatedAt": "2026-09-15T20:37:52.945Z",
      "createdAt": "2026-09-15T03:31:24.089Z"
    }
  ],
  "deletedScripts": [],
  "notes": {
    "Jennil": [],
    "Natalia": []
  },
  "viralEvaluations": [],
  "calendarEvents": [
    {
      "id": "c1",
      "title": "Grabación de Reels",
      "date": "2026-09-16"
    },
    {
      "id": "c2",
      "title": "Publicación de Contenido",
      "date": "2026-09-17"
    }
  ],
  "notificationEmails": {
    "primary": "jennilandresmartinezgomez777@gmail.com",
    "secondary": "ncolorado2511@outlook.com"
  },
  "challengeStartDate": "2026-09-13",
  "updatedAt": "2026-09-15T20:37:52.945Z"
};

function deduplicateScripts(scripts) {
  if (!Array.isArray(scripts)) return [];
  const seenIds = new Set();
  const seenFingerprints = new Set();
  const result = [];
  for (const s of scripts) {
    if (!s || typeof s !== 'object') continue;
    const id = String(s.id || '').trim();
    if (!id || seenIds.has(id)) continue;
    const fp = `${(s.client || 'Jennil').toLowerCase().trim()}|${(s.ideaGanadora || s.title || '').toLowerCase().trim()}|${(s.gancho || '').toLowerCase().trim().slice(0, 50)}`;
    if (fp.length > 5 && seenFingerprints.has(fp)) continue;
    seenIds.add(id);
    if (fp.length > 5) seenFingerprints.add(fp);
    result.push(s);
  }
  return result;
}

function mergeAppData(local, remote) {
  if (!remote || typeof remote !== 'object') return local || DEFAULT_INITIAL_DATA;
  if (!local || typeof local !== 'object') return remote || DEFAULT_INITIAL_DATA;

  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const deletedMap = new Map();
  (remote.deletedScripts || []).forEach(s => {
    if (s && s.id && s.deletedAt) {
      const age = now - new Date(s.deletedAt).getTime();
      if (age < FIFTEEN_DAYS_MS) deletedMap.set(String(s.id), s);
    }
  });
  (local.deletedScripts || []).forEach(s => {
    if (s && s.id && s.deletedAt) {
      const age = now - new Date(s.deletedAt).getTime();
      if (age < FIFTEEN_DAYS_MS) {
        const existing = deletedMap.get(String(s.id));
        if (!existing || new Date(s.deletedAt) >= new Date(existing.deletedAt)) {
          deletedMap.set(String(s.id), s);
        }
      }
    }
  });
  const mergedDeletedScripts = Array.from(deletedMap.values());
  const deletedIdsSet = new Set(mergedDeletedScripts.map(s => String(s.id)));
  deletedIdsSet.add('s1');
  deletedIdsSet.add('s2');
  deletedIdsSet.add('test_1');

  const scriptsMap = new Map();
  (remote.scripts || []).forEach(s => {
    if (s && s.id && !deletedIdsSet.has(String(s.id)) && (s.ideaGanadora || s.gancho || s.title)) {
      scriptsMap.set(String(s.id), s);
    }
  });
  (local.scripts || []).forEach(s => {
    if (s && s.id && !deletedIdsSet.has(String(s.id)) && (s.ideaGanadora || s.gancho || s.title)) {
      const existing = scriptsMap.get(String(s.id));
      if (!existing || (s.updatedAt && (!existing.updatedAt || s.updatedAt >= existing.updatedAt))) {
        scriptsMap.set(String(s.id), s);
      }
    }
  });
  const mergedScripts = Array.from(scriptsMap.values());

  const calMap = new Map();
  (remote.calendarEvents || []).forEach(c => {
    if (c) {
      const key = String(c.id || (c.date + '_' + c.title));
      calMap.set(key, c);
    }
  });
  (local.calendarEvents || []).forEach(c => {
    if (c) {
      const key = String(c.id || (c.date + '_' + c.title));
      calMap.set(key, c);
    }
  });

  const mergedClients = Array.from(new Set([
    ...(local.clients || []),
    ...(remote.clients || []),
    'Jennil', 'Natalia'
  ]));

  const mergedNotes = {};
  mergedClients.forEach(c => {
    const lNotes = (local.notes && Array.isArray(local.notes[c])) ? local.notes[c] : [];
    const rNotes = (remote.notes && Array.isArray(remote.notes[c])) ? remote.notes[c] : [];
    const notesMap = new Map();
    rNotes.forEach(n => {
      const k = typeof n === 'string' ? n : (n.id || n.text || JSON.stringify(n));
      notesMap.set(k, n);
    });
    lNotes.forEach(n => {
      const k = typeof n === 'string' ? n : (n.id || n.text || JSON.stringify(n));
      notesMap.set(k, n);
    });
    mergedNotes[c] = Array.from(notesMap.values());
  });

  return {
    clients: mergedClients,
    scripts: mergedScripts.length > 0 ? mergedScripts : DEFAULT_INITIAL_DATA.scripts,
    deletedScripts: mergedDeletedScripts,
    notes: mergedNotes,
    calendarEvents: Array.from(calMap.values()),
    viralEvaluations: (local.viralEvaluations || remote.viralEvaluations || []),
    notificationEmails: local.notificationEmails || remote.notificationEmails || DEFAULT_INITIAL_DATA.notificationEmails,
    aiBrain: { ...(remote.aiBrain || {}), ...(local.aiBrain || {}) },
    challengeStartDate: local.challengeStartDate || remote.challengeStartDate || '2026-09-13',
    updatedAt: new Date().toISOString()
  };
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Bypass-Tunnel-Reminder, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];

  // API SYNC
  if (urlPath === '/api/sync') {
    if (req.method === 'POST' || req.method === 'PUT') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', () => {
        try {
          const body = JSON.parse(bodyStr);
          let syncDataPathFile = path.join(DIR, 'sync-data.json');
          let diskData = DEFAULT_INITIAL_DATA;
          try {
            if (fs.existsSync(syncDataPathFile)) diskData = JSON.parse(fs.readFileSync(syncDataPathFile, 'utf8'));
          } catch(e) {}

          const merged = mergeAppData(body, diskData);
          try {
            fs.writeFileSync(syncDataPathFile, JSON.stringify(merged, null, 2));
          } catch(e) {}

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: merged }));
        } catch(e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET') {
      let syncDataPathFile = path.join(DIR, 'sync-data.json');
      let dataToSend = DEFAULT_INITIAL_DATA;
      try {
        if (fs.existsSync(syncDataPathFile)) dataToSend = JSON.parse(fs.readFileSync(syncDataPathFile, 'utf8'));
      } catch(e) {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dataToSend));
      return;
    }
  }

  // OLLAMA PROXY
  if (urlPath.startsWith('/api/ollama')) {
    const subRoute = urlPath.replace('/api/ollama', '') || '/tags';
    const targetUrl = OLLAMA_HOST + '/api' + subRoute;

    let bodyData = [];
    req.on('data', chunk => bodyData.push(chunk));
    req.on('end', async () => {
      try {
        const bodyBuf = Buffer.concat(bodyData);
        const options = {
          method: req.method,
          headers: { 'Content-Type': 'application/json' }
        };
        if (bodyBuf.length > 0 && req.method !== 'GET') {
          options.body = bodyBuf;
        }

        const ollamaRes = await fetch(targetUrl, options);
        const data = await ollamaRes.text();
        res.writeHead(ollamaRes.status, { 'Content-Type': 'application/json' });
        res.end(data);
      } catch (err) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ollama proxy error', details: err.message }));
      }
    });
    return;
  }

  // STATIC FILES
  let filePath = path.join(DIR, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(DIR, 'index.html'), (e, fallback) => {
          if (e) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallback);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 BLEX STUDIO Server running at http://localhost:' + PORT);
});
