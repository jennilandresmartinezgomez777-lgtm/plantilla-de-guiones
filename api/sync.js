const fs = require('fs');
const path = require('path');

let channelsState = {};

module.exports = async (req, res) => {
  // Prevent aggressive browser caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // CORS Headers
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

  // Get channel name from query param or default to 'default'
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
        const syncObj = {
          data: body,
          channel: channel,
          updatedAt: body.updatedAt || new Date().toISOString()
        };
        channelsState[channel] = syncObj;

        // Attempt persistent temp cache
        try {
          fs.writeFileSync(tmpFilePath, JSON.stringify(syncObj));
        } catch (e) {
          // ignore temp write errors
        }

        return res.status(200).json({ 
          success: true, 
          channel: channel,
          count: body.scripts.length, 
          updatedAt: syncObj.updatedAt 
        });
      }
      return res.status(400).json({ error: 'Invalid payload structure' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    // 1. In-memory channel cache
    if (channelsState[channel] && channelsState[channel].data) {
      return res.status(200).json(channelsState[channel].data);
    }

    // 2. Temp file cache for channel
    try {
      if (fs.existsSync(tmpFilePath)) {
        const tmpRaw = fs.readFileSync(tmpFilePath, 'utf8');
        const parsed = JSON.parse(tmpRaw);
        if (parsed && parsed.data) {
          channelsState[channel] = parsed;
          return res.status(200).json(parsed.data);
        }
      }
    } catch (e) {
      // fallback
    }

    // 3. Static fallback for default channel
    if (channel === 'default') {
      try {
        const syncPath = path.join(process.cwd(), 'sync-data.json');
        if (fs.existsSync(syncPath)) {
          const fileContent = fs.readFileSync(syncPath, 'utf8');
          const staticData = JSON.parse(fileContent);
          return res.status(200).json(staticData);
        }
      } catch (e) {
        // fallback
      }
    }

    return res.status(404).json({ error: `No cloud state available for channel '${channel}'` });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
