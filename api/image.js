const twilio = require('../twilio');
const openai = require('../openai');

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return res.send('getter no getting'); }
  console.log('image', req.body)
  const image = await openai.generateImage({ prompt: req.body.prompt });
  const mmsXML = await twilio.generateMMSReply({ image });
  res.setHeader('Content-Type', 'text/xml').send(mmsXML);
}