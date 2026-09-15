const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline; filename="blex-content-calendar.ics"');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  let calendarEvents = [];

  // 1. Try reading from /tmp/sync_default.json
  try {
    const tmpPath = path.join('/tmp', 'sync_default.json');
    if (fs.existsSync(tmpPath)) {
      const parsed = JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
      if (parsed && parsed.data && Array.isArray(parsed.data.calendarEvents)) {
        calendarEvents = parsed.data.calendarEvents;
      }
    }
  } catch (e) {}

  // 2. Fallback to sync-data.json
  if (calendarEvents.length === 0) {
    try {
      const staticPath = path.join(process.cwd(), 'sync-data.json');
      if (fs.existsSync(staticPath)) {
        const parsed = JSON.parse(fs.readFileSync(staticPath, 'utf8'));
        if (parsed && Array.isArray(parsed.calendarEvents)) {
          calendarEvents = parsed.calendarEvents;
        }
      }
    } catch (e) {}
  }

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BLEX STUDIO//Live Content Calendar Feed//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:BLEX STUDIO - Calendario de Contenidos',
    'X-WR-CALDESC:Sincronizacion automatica de rodajes y publicaciones de BLEX Studio para Celulares y iPad',
    'X-PUBLISHED-TTL:PT15M',
    'REFRESH-INTERVAL;VALUE=DURATION:PT15M'
  ];

  calendarEvents.forEach(ev => {
    if (!ev.date) return;
    const timeStr = (ev.time || '19:00').replace(':', '') + '00';
    const dateFormatted = ev.date.replace(/-/g, '');
    const dtStart = `${dateFormatted}T${timeStr}`;

    const startDate = new Date(`${ev.date}T${ev.time || '19:00'}:00`);
    const endDate = new Date(startDate.getTime() + 60 * 60000);
    const endFormatted = endDate.toISOString().split('T')[0].replace(/-/g, '') + 'T' + String(endDate.getHours()).padStart(2, '0') + String(endDate.getMinutes()).padStart(2, '0') + '00';

    const uid = (ev.id || 'event-' + Date.now()) + '@content-script-studio.vercel.app';
    const summary = `[${ev.client || 'General'}] ${ev.title || 'Actividad de Contenido'}`;
    const description = `Tipo: ${ev.type || 'Contenido'}\\nPlataforma: ${ev.platform || 'Redes'}\\nNotas: ${ev.notes || 'Sin notas'}`;

    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:${uid}`);
    icsLines.push(`DTSTAMP:${dateFormatted}T000000Z`);
    icsLines.push(`DTSTART:${dtStart}`);
    icsLines.push(`DTEND:${endFormatted}`);
    icsLines.push(`SUMMARY:${summary}`);
    icsLines.push(`DESCRIPTION:${description}`);
    icsLines.push('STATUS:CONFIRMED');

    // VALARM Trigger: sound alarm on iPhone / iPad / Android
    icsLines.push('BEGIN:VALARM');
    icsLines.push('ACTION:DISPLAY');
    icsLines.push(`DESCRIPTION:Recordatorio BLEX: ${summary}`);
    if (ev.reminder === '15min') {
      icsLines.push('TRIGGER:-PT15M');
    } else if (ev.reminder === '1hour') {
      icsLines.push('TRIGGER:-PT1H');
    } else if (ev.reminder === '1day') {
      icsLines.push('TRIGGER:-P1D');
    } else {
      icsLines.push('TRIGGER:-PT0M');
    }
    icsLines.push('END:VALARM');

    icsLines.push('END:VEVENT');
  });

  icsLines.push('END:VCALENDAR');

  return res.status(200).send(icsLines.join('\r\n'));
};
