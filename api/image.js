const twilio = require('../twilio');
const openai = require('../openai');

module.exports.default = async function handler(req, res) {
  if (req.method === 'GET') { return res.send('getter no getting'); }
  console.log('image', req.body)
  const image = await openai.generateImage({ prompt: req.body.prompt });
  await twilio.sendMMS({ to: req.body.From, image });
  setTimeout(() => {
    // just wait for a sec to make sure it finishes
    res.send({ status: 'ok' });
  }, 500)
}