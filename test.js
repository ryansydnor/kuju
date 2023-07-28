const twilio = require('./twilio');
const openai = require('./openai');

async function main() {
  const req = { body: { Body: process.argv[2] } };
  const body = await openai.generatePoem({ prompt: req.body.Body });
  const image = await openai.generateImage({ prompt: body });
  const mmsXML = await twilio.generateMMSReply({ body, image });
}

main();