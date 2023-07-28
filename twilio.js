const { MessagingResponse } = require('twilio').twiml;

const factory = {
  generateMMSReply,
};

module.exports = factory;

async function generateMMSReply({ body, image }) {
  const twiml = new MessagingResponse();
  const message = twiml.message()
  if (body) message.body(body);
  if (image) message.media(image);
  return twiml.toString();
}

  