const { db } = require("@vercel/postgres");
const twilio = require('../twilio');

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return; }
  if (!req.body.Body) { return; }

  const client = await db.connect();

  const metdata = JSON.stringify({
    city: req.body.FromCity,
    state: req.body.FromState,
    zip: req.body.FromZip,
    country: req.body.FromCountry,
  });
  const { rows: [{ id: userID }] } = await client.sql`
    INSERT INTO users (phone, created_on, updated_on, metadata)
    VALUES (${req.body.From}, NOW(), NOW(), ${metdata})
    ON CONFLICT (phone)
    DO UPDATE SET updated_on = EXCLUDED.updated_on
    RETURNING id;
  `;

  const message = JSON.stringify(req.body);
  const { rows: [{ id: incomingMessageID }] } = await client.sql`
    INSERT INTO incoming_messages (user_id, message, created_on)
    VALUES (${userID}, ${message}, NOW())
    RETURNING id;
  `;

  fetch('https://kuju.vercel.app/api/poem', {
    method: 'POST',
    body: JSON.stringify({ ...req.body, incomingMessageID, userID, }),
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