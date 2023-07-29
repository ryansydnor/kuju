const { Configuration, OpenAIApi } = require('openai');
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

const factory = {
  generatePoem,
  generateImage,
};

module.exports = factory;

async function generatePoem({ prompt }) {
  const poemRes = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a writer. You use 140 characters or less. You write a mysterious and engaging short story based on a prompt.' },
      { role: 'user', content: prompt },
    ],
    temperature: 1.1,
  });
  return poemRes.data.choices[0].message.content;
}

async function generateImage({ prompt }) {
  const res = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: '512x512',
  });
  return res.data.data[0].url;
}