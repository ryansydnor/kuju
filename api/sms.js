import { sql } from "@vercel/postgres";
const twilio = require('../twilio');

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { 
    const { rows } = await sql`SELECT * FROM users;`;
    return res.send(rows);
  }
  console.log('sms', req.body);
  if (!req.body.Body) { return res.send('need a word or phrase to start with'); }
  fetch('https://kuju.vercel.app/api/poem', {
    method: 'POST',
    body: JSON.stringify(req.body),
    headers: {'Content-Type': 'application/json'},
  });  
  const mmsXML = twilio.generateMMSReply({ body: 'making something just for you' });
  res.status(200);
  res.setHeader('Content-Type', 'text/xml');
  res.write(mmsXML);
  setTimeout(() => {
    // just wait for a sec to make sure the poem fetch finishes
    res.end();
  }, 500)
  
}