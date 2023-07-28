const twilio = require('twilio');
const { MessagingResponse } = twilio.twiml;

const factory = {
  generateMMSReply,
  sendMMS,
};

module.exports = factory;

function generateMMSReply({ body, image }) {
  const twiml = new MessagingResponse();
  const message = twiml.message()
  if (body) message.body(body.substring(0, 160)); // make sure we're less than 160 chars so we don't get rejected
  if (image) message.media(image);
  return twiml.toString();
}

async function sendMMS({ to, body, image }) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const message = {
   from: process.env.TWILIO_PHONE_NUMBER,
   to,    
  };
  if (body) message.body = body.substring(0, 160);
  if (image) message.mediaUrl = [image];
  await client.messages.create(message);
}

  