const twilio = require('./twilio');
const openai = require('./openai');

async function main() {
  const req = { body: { Body: process.argv[2] } };
  console.time('total')
  console.time('poem')
  const body = await openai.generatePoem({ prompt: req.body.Body });
  console.timeEnd('poem')
  console.time('image')
  const image = await openai.generateImage({ prompt: body });
  console.timeEnd('image')
  console.timeEnd('total')
  const mmsXML = await twilio.generateMMSReply({ body, image });
}

main();