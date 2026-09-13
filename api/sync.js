const fs = require('fs');
const path = require('path');

let globalSyncState = null;

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

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      if (body && body.scripts) {
        globalSyncState = {
          data: body,
          updatedAt: body.updatedAt || new Date().toISOString()
        };
        
        // Attempt persistent temp cache
        try {
          fs.writeFileSync(path.join('/tmp', 'sync.json'), JSON.stringify(globalSyncState));
        } catch (e) {
          // ignore temp write errors
        }

        return res.status(200).json({ 
          success: true, 
          count: body.scripts.length, 
          updatedAt: globalSyncState.updatedAt 
        });
      }
      return res.status(400).json({ error: 'Invalid payload structure' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    // 1. Memory cache
    if (globalSyncState && globalSyncState.data) {
      return res.status(200).json(globalSyncState.data);
    }

    // 2. Temp file cache
    try {
      if (fs.existsSync(path.join('/tmp', 'sync.json'))) {
        const tmpRaw = fs.readFileSync(path.join('/tmp', 'sync.json'), 'utf8');
        const parsed = JSON.parse(tmpRaw);
        if (parsed && parsed.data) {
          globalSyncState = parsed;
          return res.status(200).json(parsed.data);
        }
      }
    } catch (e) {
      // fallback
    }

    // 3. Repository sync-data.json static fallback
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

    return res.status(404).json({ error: 'No cloud state available' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
