const fs = require('fs');
const path = require('path');

let channelsState = {};

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

function mergeAppData(local, remote) {
  if (!remote || typeof remote !== 'object') return local || DEFAULT_INITIAL_DATA;
  if (!local || typeof local !== 'object') return remote || DEFAULT_INITIAL_DATA;

  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  // 0. Merge Deleted Scripts (Tombstones with 15-day TTL)
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

  // Filter out corrupted test IDs (s1, s2, test_1)
  deletedIdsSet.add('s1');
  deletedIdsSet.add('s2');
  deletedIdsSet.add('test_1');

  // 1. Merge Active Scripts by ID (NEVER restore scripts present in deletedIdsSet)
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

  // 2. Merge Calendar Events
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
  const mergedCalendar = Array.from(calMap.values());

  // 3. Merge Clients
  const mergedClients = Array.from(new Set([
    ...(local.clients || []),
    ...(remote.clients || []),
    'Jennil', 'Natalia'
  ]));

  // 4. Merge Notes per Client
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

  // 5. Merge Emails
  const mergedEmails = {
    primary: (local.notificationEmails && local.notificationEmails.primary) || (remote.notificationEmails && remote.notificationEmails.primary) || 'jennilandresmartinezgomez777@gmail.com',
    secondary: (local.notificationEmails && local.notificationEmails.secondary) || (remote.notificationEmails && remote.notificationEmails.secondary) || 'ncolorado2511@outlook.com'
  };

  // 6. Merge Viral Evaluations
  const evalMap = new Map();
  (remote.viralEvaluations || []).forEach(e => { if (e) evalMap.set(e.id || JSON.stringify(e), e); });
  (local.viralEvaluations || []).forEach(e => { if (e) evalMap.set(e.id || JSON.stringify(e), e); });

  return {
    clients: mergedClients,
    scripts: mergedScripts.length > 0 ? mergedScripts : DEFAULT_INITIAL_DATA.scripts,
    deletedScripts: mergedDeletedScripts,
    notes: mergedNotes,
    calendarEvents: mergedCalendar,
    viralEvaluations: Array.from(evalMap.values()),
    notificationEmails: mergedEmails,
    aiBrain: { ...(remote.aiBrain || {}), ...(local.aiBrain || {}) },
    challengeStartDate: local.challengeStartDate || remote.challengeStartDate || '2026-09-13',
    updatedAt: new Date().toISOString()
  };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let channel = 'default';
  if (req.query && req.query.channel) {
    channel = String(req.query.channel).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'default';
  }

  const tmpFileName = `sync_${channel}.json`;
  const tmpFilePath = path.join('/tmp', tmpFileName);

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      if (body && Array.isArray(body.scripts)) {
        let existing = channelsState[channel]?.data;
        if (!existing) {
          try {
            if (fs.existsSync(tmpFilePath)) {
              existing = JSON.parse(fs.readFileSync(tmpFilePath, 'utf8'))?.data;
            }
          } catch(e) {}
        }
        if (!existing) existing = DEFAULT_INITIAL_DATA;

        const mergedData = mergeAppData(body, existing);
        mergedData.updatedAt = body.updatedAt || new Date().toISOString();

        const syncObj = {
          data: mergedData,
          channel: channel,
          updatedAt: mergedData.updatedAt
        };
        channelsState[channel] = syncObj;

        try {
          fs.writeFileSync(tmpFilePath, JSON.stringify(syncObj));
        } catch (e) {}

        return res.status(200).json({ 
          success: true, 
          channel: channel,
          count: mergedData.scripts.length, 
          calendarCount: (mergedData.calendarEvents || []).length,
          data: mergedData,
          updatedAt: syncObj.updatedAt 
        });
      }
      return res.status(400).json({ error: 'Invalid payload structure' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    if (channelsState[channel] && channelsState[channel].data) {
      return res.status(200).json(channelsState[channel].data);
    }

    try {
      if (fs.existsSync(tmpFilePath)) {
        const tmpRaw = fs.readFileSync(tmpFilePath, 'utf8');
        const parsed = JSON.parse(tmpRaw);
        if (parsed && parsed.data) {
          channelsState[channel] = parsed;
          return res.status(200).json(parsed.data);
        }
      }
    } catch (e) {}

    try {
      const syncPathFile = path.join(process.cwd(), 'sync-data.json');
      if (fs.existsSync(syncPathFile)) {
        const fileContent = fs.readFileSync(syncPathFile, 'utf8');
        const staticData = JSON.parse(fileContent);
        channelsState[channel] = { data: staticData, updatedAt: staticData.updatedAt };
        return res.status(200).json(staticData);
      }
    } catch (e) {}

    return res.status(200).json(DEFAULT_INITIAL_DATA);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
