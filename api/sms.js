const { MessagingResponse } = require('twilio').twiml;

export default function handler(req, res) {
  console.log(req);
  if (req.method === 'GET') { return; }
  const twiml = new MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.type('text/xml').send(twiml.toString());
}