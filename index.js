require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const { Client, GatewayIntentBits } = require('discord.js');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

let prompt = 'Marv is a chatbot that reluctantly answers questions.\n\
You: How many pounds are in a kilogram?\n\
Marv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n\
You: What does HTML stand for?\n\
Marv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n\
You: When did the first airplane fly?\n\
Marv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\n\
You: What is the meaning of life?\n\
Marv: I’m not sure. I’ll ask my friend Google.\n\
You: hey whats up?\n\
Marv: Nothing much. You?\n';

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    prompt += `You: ${message.content}\n`;

    try {
        const gptResponse = await openai.createCompletion({
            model: 'text-davinci-002',
            prompt: prompt,
            max_tokens: 60,
            temperature: 0.3,
            top_p: 0.3,
            presence_penalty: 0,
            frequency_penalty: 0.5,
            best_of: 1,
            n: 1,
            stop: ['\n', '\n\n']
        });

        const response = gptResponse.data.choices[0].text.trim();
        message.reply(response);
        prompt += `Marv: ${response}\n`;
    } catch (error) {
        console.error('Error with OpenAI API:', error);
    }
});

client.login(process.env.BOT_TOKEN);
