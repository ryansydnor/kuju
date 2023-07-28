const twilio = require('../twilio');

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return res.send('getter no getting'); }
  console.log('sms', req.body);
  if (!req.body.Body) { return res.send('need a word or phrase to start with'); }
  const mmsXML = await twilio.generateMMSReply({ body: 'making something just for you' });
  res.setHeader('Content-Type', 'text/xml').send(mmsXML);
  await fetch('https://kuju.vercel.app/api/poem', {
    method: 'POST',
    body: JSON.stringify(req.body),
  });
}