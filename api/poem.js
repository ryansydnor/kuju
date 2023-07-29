const twilio = require('../twilio');
const openai = require('../openai');
const { db } = require("@vercel/postgres");

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return; }
  
  const body = await openai.generatePoem({ prompt: req.body.Body });
  fetch('https://kuju.vercel.app/api/image', {
    method: 'POST',
    body: JSON.stringify({ ...req.body, prompt: body }),
    headers: {'Content-Type': 'application/json'}
  });  

  const twilioMessage = await twilio.sendMMS({ to: req.body.From, body });
  
  const client = await db.connect();
  const message = JSON.stringify(twilioMessage);
  await client.sql`
    INSERT INTO outgoing_messages (user_id, message, created_on, incoming_message_id)
    VALUES (${req.body.userID}, ${message}, NOW(), ${req.body.incomingMessageID});
  `;

  setTimeout(() => {
    // just wait for a sec to make sure the fetch finishes
    res.send({ status: 'ok' });
  }, 500)
}