const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { emails, title, client, date, time, platform, notes } = body || {};

    const recipients = (Array.isArray(emails) ? emails : [emails]).filter(e => e && e.includes('@'));

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No valid recipient email provided.' });
    }

    const eventTitle = title || 'Actividad de Contenido';
    const eventClient = client || 'General';
    const eventDate = date || new Date().toISOString().split('T')[0];
    const eventTime = time || '19:00';
    const eventPlatform = platform || 'Instagram / TikTok';
    const eventNotes = notes || 'Sin notas adicionales.';

    const subject = `🔔 [BLEX STUDIO] Recordatorio: ${eventClient} - ${eventTitle}`;
    const emailBody = `
========================================
🔔 RECORDATORIO DE CONTENIDO - BLEX STUDIO
========================================

📌 Actividad: ${eventTitle}
👤 Cliente: ${eventClient}
📅 Fecha: ${eventDate}
⏰ Hora: ${eventTime}
🌐 Plataforma: ${eventPlatform}

📝 Notas / Instrucciones:
${eventNotes}

----------------------------------------
Organizado automáticamente desde BLEX Content Script Studio
https://content-script-studio.vercel.app
========================================
    `.trim();

    // Send dispatch via reliable transactional endpoints
    const dispatchPromises = recipients.map(email => {
      return new Promise((resolve) => {
        const postData = JSON.stringify({
          access_key: "c8e87498-8422-4cb6-86f2-89d1b7a2bbcd", // public notification webhook relay
          subject: subject,
          from_name: "BLEX Content Script Studio",
          email: email,
          reply_to: email,
          to: email,
          message: emailBody
        });

        const options = {
          hostname: 'api.web3forms.com',
          port: 443,
          path: '/submit',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const r = https.request(options, (resp) => {
          let data = '';
          resp.on('data', chunk => data += chunk);
          resp.on('end', () => {
            resolve({ email, success: resp.statusCode >= 200 && resp.statusCode < 300, data });
          });
        });

        r.on('error', (err) => {
          resolve({ email, success: false, error: err.message });
        });

        r.write(postData);
        r.end();
      });
    });

    const results = await Promise.all(dispatchPromises);

    return res.status(200).json({
      success: true,
      message: `Notificaciones enviadas a ${recipients.join(', ')}`,
      results: results
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
