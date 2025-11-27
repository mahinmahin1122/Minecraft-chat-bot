const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const token = process.env.DISCORD_TOKEN;

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} Railway এ রান করছে!`);
    console.log(`✅ ./text কমান্ড ব্যবহার করতে প্রস্তুত!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('./text')) {
        const textToSend = message.content.slice('./text'.length).trim();

        if (textToSend) {
            await message.channel.send(textToSend);
            console.log(`📨 মেসেজ পাঠানো হয়েছে: ${textToSend}`);
        } else {
            await message.reply('দয়া করে টেক্সট লিখুন। উদাহরণ: `./text হ্যালো বিশ্ব!`');
        }
    }
});

client.login(token);
