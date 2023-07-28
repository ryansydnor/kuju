const twilio = require('../twilio');
const openai = require('../openai');


export default function handler(req, res) {
  if (req.method === 'GET') { return res.send('getter no getting'); }
  const body = await openai.generatePoem({ prompt: req.body.Body });
  const image = await openai.generateImage({ prompt: body });
  const mmsXML = await twilio.generateMMSReply({ body, image });
  res.setHeader('Content-Type', 'text/xml').send(mmsXML);
}