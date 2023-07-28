const app = require('express')();
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;


app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api', (req, res) => {
  const path = `/api/item/zzz`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

app.post('/api/sms', (req, res) => {
  console.log(req.body);
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.type('text/xml').send(twiml.toString());
});



module.exports = app;