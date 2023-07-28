const twilio = require('../twilio');
const openai = require('../openai');

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return res.send('getter no getting'); }
  console.log('poem', req.body)
  const body = await openai.generatePoem({ prompt: req.body.Body });
  const mmsXML = await twilio.generateMMSReply({ body, body2: 'now im making something pretty' });
  res.status(200);
  res.setHeader('Content-Type', 'text/xml');
  res.write(mmsXML);
  console.log('fetching image')
  fetch('https://kuju.vercel.app/api/image', {
    method: 'POST',
    body: JSON.stringify({ ...req.body, prompt: body }),
    headers: {'Content-Type': 'application/json'}
  });
  setTimeout(() => {
    // just wait for a sec to make sure the fetch finishes
    res.end();
  }, 250)
}