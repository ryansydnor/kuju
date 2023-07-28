const twilio = require('../twilio');
const openai = require('../openai');

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return res.send('getter no getting'); }
  console.log(req.body.Body);
  const body = await openai.generatePoem({ prompt: req.body.Body });
  // const image = await openai.generateImage({ prompt: body });
  const mmsXML = await twilio.generateMMSReply({ body, image });
  res.setHeader('Content-Type', 'text/xml').send(mmsXML);
}