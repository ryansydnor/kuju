const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/sms', (req, res) => {
  console.log(req.body);
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.type('text/xml').send(twiml.toString());
});

app.listen(1234, () => {
  console.log('Express server listening on port 3000');
});