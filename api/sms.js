const { db } = require("@vercel/postgres");
const fetch = require('node-fetch');
const twilio = require('../twilio');
const openai = require('../openai');
const baseURL = process.env.VERCEL_URL.includes('localhost') ? `http://${process.env.VERCEL_URL}` : `https://${process.env.VERCEL_URL}`;

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return res.status(500).end() }
  if (!req.body.Body) { return res.status(500).end() }

  const client = await db.connect();

  const metadata = JSON.stringify({
    city: req.body.FromCity,
    state: req.body.FromState,
    zip: req.body.FromZip,
    country: req.body.FromCountry,
  });
  const { rows: [{ id: userID }] } = await client.sql`
    INSERT INTO users (phone, created_on, updated_on, metadata)
    VALUES (${req.body.From}, NOW(), NOW(), ${metadata})
    ON CONFLICT (phone)
    DO UPDATE SET updated_on = EXCLUDED.updated_on
    RETURNING id;
  `;
  const bodyJSON = JSON.stringify(req.body);
  const { rows: [{ id: incomingMessageID }] } = await client.sql`
    INSERT INTO incoming_messages (user_id, message, created_on)
    VALUES (${userID}, ${bodyJSON}, NOW())
    RETURNING id;
  `;

  const body = await openai.generatePoem({ prompt: req.body.Body });
  fetch(`${baseURL}/api/image`, {
    method: 'POST',
    body: JSON.stringify({ ...req.body, userID, incomingMessageID, prompt: body }),
    headers: {'Content-Type': 'application/json'}
  });  

  const twilioMessage = await twilio.sendMMS({ to: req.body.From, body });
  const twilioMessageJSON = JSON.stringify(twilioMessage); 
  await client.sql`
    INSERT INTO outgoing_messages (user_id, message, created_on, incoming_message_id)
    VALUES (${userID}, ${twilioMessageJSON}, NOW(), ${incomingMessageID});
  `;
  
  // just wait for a sec to make sure the image fetch finishes
  setTimeout(() => {
    res.status(200).end();
  }, 500)
  
}