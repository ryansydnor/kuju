const twilio = require('../twilio');
const openai = require('../openai');
const { db } = require("@vercel/postgres");

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return; }
  const image = await openai.generateImage({ prompt: req.body.prompt });
    
  const twilioMessage = await twilio.sendMMS({ to: req.body.From, image });
  const twilioMessageJSON = JSON.stringify(twilioMessage)
  const client = await db.connect();
  const { rows: [{ id: outgoingMessageID }] } = await client.sql`
    INSERT INTO outgoing_messages (user_id, message, created_on, incoming_message_id)
    VALUES (${req.body.userID}, ${twilioMessageJSON}, NOW(), ${req.body.incomingMessageID})
    RETURNING id;
  `;

  // for some reason it takes twilio about a second before it has a uri for the
  // media resource idk fml
  setTimeout(async () => {
    const publicImageUrl = await twilio.getImageUrl({ messageID: twilioMessage.sid });
    await client.sql`
      UPDATE outgoing_messages SET "publicImageUrl" = ${publicImageUrl}
      WHERE id = ${outgoingMessageID};
    `;
    res.send({ status: 'ok' });
  }, 1000)
}