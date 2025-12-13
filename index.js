const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const token = process.env.DISCORD_TOKEN;

const SERVER_DETAILS = {
    javaIp: "play.drksurvraze.top",
    bedrockIp: "play.drksurvraze.top",
    port: "25655",
    website: "https://drksurvraze.vercel.app/"
};

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} Railway এ রান করছে!`);
    console.log(`✅ IP রেসপন্স সিস্টেম চালু!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    
    // শুধু "ip" শব্দটি খুঁজে বের করা (যেকোনো জায়গায় থাকলে)
    const hasIpWord = /\bip\b/.test(content);
    
    if (hasIpWord) {
        const replyMessage = `
🎮 **DrkSurvRaze Server Connection Details**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

**☕ JAVA EDITION:**
🔗 **IP:** \`${SERVER_DETAILS.javaIp}\`

**🪨 BEDROCK EDITION:**
🔗 **Ip:** \`${SERVER_DETAILS.bedrockIp}\`
⚡ **PORT:** \`${SERVER_DETAILS.port}\`

🌐 **WEBSITE:** ${SERVER_DETAILS.website}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        `.trim();
        
        await message.channel.send({
            content: replyMessage
        });
        
        console.log(`📨 ${message.author.tag} কে সার্ভার ডিটেইলস পাঠানো হয়েছে - মেসেজ: "${message.content}"`);
    }
});

client.login(token);
