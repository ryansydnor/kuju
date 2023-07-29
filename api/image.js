const twilio = require('../twilio');
const openai = require('../openai');
const { db } = require("@vercel/postgres");

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return; }
  const image = await openai.generateImage({ prompt: req.body.prompt });

  const twilioMessage = await twilio.sendMMS({ to: req.body.From, image });  
  // TODO: instead of this weird wait, just call another api to fetch the image url and update that on field
  // just wait for a sec to make sure twilio has the image
  setTimeout(async () => {
    const publicImageUrl = await twilio.getImageUrl({ messageID: twilioMessage.sid });
    const client = await db.connect();
    const message = JSON.stringify({ ...JSON.parse(JSON.stringify(twilioMessage)), publicImageUrl });  
    await client.sql`
      INSERT INTO outgoing_messages (user_id, message, created_on, incoming_message_id)
      VALUES (${req.body.userID}, ${message}, NOW(), ${req.body.incomingMessageID});
    `;
    res.send({ status: 'ok' });
  }, 1000)
}