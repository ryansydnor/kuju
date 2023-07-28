const { MessagingResponse } = require('twilio').twiml;

export default function handler(req, res) {
  if (req.method === 'GET') { return res.send('getter no getting'); }
  const twiml = new MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  twiml.message('Runn!!');
  twiml.media('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqHkoeb3TGsE72Ta1r-9C9Q9B42304Q0EYi5iHoAoByw&s');
  res.setHeader('Content-Type', 'text/xml');
  console.log(twiml.toString())
  res.status(200).send(twiml.toString());
}