const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const token = process.env.DISCORD_TOKEN;
const SERVER_IP = "play.drksurvraze.top";

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} Railway এ রান করছে!`);
    console.log(`✅ IP রেসপন্স সিস্টেম চালু!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // ip বা Ip টেক্সট চেক করবে
    if (message.content.toLowerCase() === 'ip') {
        await message.channel.send(`🎮 **সার্ভার আইপি:** ${SERVER_IP}`);
        console.log(`📨 ${message.author.tag} কে আইপি পাঠানো হয়েছে: ${SERVER_IP}`);
    }
});

client.login(token);
