const { MessagingResponse } = require('twilio').twiml;

export default function handler(req, res) {
  if (req.method === 'GET') { return res.send('getter no getting'); }
  console.log(req.body);
  const twiml = new MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.type('text/xml').send(twiml.toString());
}