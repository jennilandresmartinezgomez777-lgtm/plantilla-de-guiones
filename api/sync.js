// Vercel Serverless Function for BLEX STUDIO Cloud Sync
let globalSyncState = null;

module.exports = async (req, res) => {
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
          updatedAt: new Date().toISOString()
        };
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
    if (globalSyncState && globalSyncState.data) {
      return res.status(200).json(globalSyncState.data);
    }
    return res.status(404).json({ error: 'No cloud state available yet' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
