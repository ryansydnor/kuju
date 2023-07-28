const twilio = require('../twilio');
const openai = require('../openai');

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return res.send('getter no getting'); }
  console.log('poem', req.body)
  const body = await openai.generatePoem({ prompt: req.body.Body });
  const mmsXML = await twilio.generateMMSReply({ body, body2: 'making something pretty' });
  res.setHeader('Content-Type', 'text/xml').send(mmsXML);  
  console.log('fetching image')
  const fetchRes = await fetch('https://kuju.vercel.app/api/image', {
    method: 'POST',
    body: JSON.stringify({ ...req.body, prompt: body }),
    headers: {'Content-Type': 'application/json'}
  });
  console.log(fetchRes)
}