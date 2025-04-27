require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

// Konfigurasi OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Inisialisasi client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
});

// Event saat menerima pesan
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Cek kalau pesan diawali dengan !ask
    if (message.content.startsWith('!ask')) {
        const userInput = message.content.replace('!ask', '').trim();
        if (!userInput) {
            return message.reply('Tolong masukkan pertanyaan setelah !ask');
        }

        try {
            await message.channel.sendTyping(); // Efek typing
            const response = await openai.createChatCompletion({
                model: 'gpt-4', // atau gpt-3.5-turbo
                messages: [{ role: 'user', content: userInput }],
            });

            const botReply = response.data.choices[0].message.content;
            await message.reply(botReply);
        } catch (error) {
            console.error(error);
            message.reply('Terjadi kesalahan saat menghubungi ChatGPT.');
        }
    }
});

// Jalankan bot
client.login(process.env.DISCORD_TOKEN);
