const fs = require('fs');
const path = require('path');

const CLOUD_STORE_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0a5fc4ad312ed';
let channelsState = {};

function mergeAppData(local, remote) {
  if (!remote || typeof remote !== 'object') return local || {};
  if (!local || typeof local !== 'object') return remote || {};

  // 1. Merge Scripts by ID (keep latest)
  const scriptsMap = new Map();
  (remote.scripts || []).forEach(s => { if (s && s.id) scriptsMap.set(String(s.id), s); });
  (local.scripts || []).forEach(s => {
    if (s && s.id) {
      const existing = scriptsMap.get(String(s.id));
      if (!existing || (s.updatedAt && (!existing.updatedAt || s.updatedAt >= existing.updatedAt))) {
        scriptsMap.set(String(s.id), s);
      }
    }
  });
  const mergedScripts = Array.from(scriptsMap.values());

  // 2. Merge Calendar Events by ID or date+title (NEVER delete events from other devices)
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
    primary: (local.notificationEmails && local.notificationEmails.primary) || (remote.notificationEmails && remote.notificationEmails.primary) || '',
    secondary: (local.notificationEmails && local.notificationEmails.secondary) || (remote.notificationEmails && remote.notificationEmails.secondary) || ''
  };

  // 6. Merge Viral Evaluations
  const evalMap = new Map();
  (remote.viralEvaluations || []).forEach(e => { if (e) evalMap.set(e.id || JSON.stringify(e), e); });
  (local.viralEvaluations || []).forEach(e => { if (e) evalMap.set(e.id || JSON.stringify(e), e); });

  return {
    clients: mergedClients,
    scripts: mergedScripts,
    notes: mergedNotes,
    calendarEvents: mergedCalendar,
    viralEvaluations: Array.from(evalMap.values()),
    notificationEmails: mergedEmails,
    aiBrain: { ...(remote.aiBrain || {}), ...(local.aiBrain || {}) },
    challengeStartDate: local.challengeStartDate || remote.challengeStartDate || '2026-09-13',
    updatedAt: new Date().toISOString()
  };
}

async function fetchFromPersistentCloud() {
  try {
    const res = await fetch(CLOUD_STORE_URL, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn('fetchFromPersistentCloud warning:', e.message);
  }
  return null;
}

async function saveToPersistentCloud(data) {
  try {
    const payload = JSON.stringify({
      name: 'BLEX_STUDIO_SYNC_DATA',
      data: data
    });
    const res = await fetch(CLOUD_STORE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    return res.ok;
  } catch (e) {
    console.warn('saveToPersistentCloud warning:', e.message);
    return false;
  }
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
        // Fetch current cloud state to perform deep merge
        const existingCloudData = (channel === 'default') ? await fetchFromPersistentCloud() : null;
        const mergedData = mergeAppData(body, existingCloudData);
        mergedData.updatedAt = body.updatedAt || new Date().toISOString();

        const syncObj = {
          data: mergedData,
          channel: channel,
          updatedAt: mergedData.updatedAt
        };
        channelsState[channel] = syncObj;

        // Persist to Cloud Store
        if (channel === 'default') {
          await saveToPersistentCloud(mergedData);
        }

        // Attempt persistent temp cache
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
    // 1. Persistent Cloud Store for default channel
    if (channel === 'default') {
      const cloudData = await fetchFromPersistentCloud();
      if (cloudData && Array.isArray(cloudData.scripts)) {
        channelsState['default'] = { data: cloudData, updatedAt: cloudData.updatedAt };
        return res.status(200).json(cloudData);
      }
    }

    // 2. In-memory channel cache
    if (channelsState[channel] && channelsState[channel].data) {
      return res.status(200).json(channelsState[channel].data);
    }

    // 3. Temp file cache for channel
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

    // 4. Static fallback for default channel
    if (channel === 'default') {
      try {
        const syncPath = path.join(process.cwd(), 'sync-data.json');
        if (fs.existsSync(syncPath)) {
          const fileContent = fs.readFileSync(syncPath, 'utf8');
          const staticData = JSON.parse(fileContent);
          return res.status(200).json(staticData);
        }
      } catch (e) {}
    }

    return res.status(200).json({ 
      clients: ['Jennil', 'Natalia'], 
      scripts: [], 
      notes: { Jennil: [], Natalia: [] }, 
      viralEvaluations: [],
      calendarEvents: [],
      notificationEmails: {},
      updatedAt: new Date().toISOString() 
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
