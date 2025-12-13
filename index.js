const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

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

// ================= READY =================
client.on('ready', async () => {
    console.log(`✅ ${client.user.tag} Railway এ রান করছে!`);
    console.log(`✅ IP রেসপন্স সিস্টেম চালু!`);

    // ===== SMP STATUS MESSAGE CREATE =====
    const STATUS_CHANNEL_ID = "1449379314985472041";
    const channel = await client.channels.fetch(STATUS_CHANNEL_ID);

    let statusMessage = await channel.send("🔄 **SMP Status Loading...**");

    // 🔄 Demo status function (later RCON / DiscordSRV add করা যাবে)
    function getSmpStatus() {
        return {
            online: true, // true / false
            players: Math.floor(Math.random() * 20) // demo count
        };
    }

    // ===== AUTO UPDATE EVERY 2 SECONDS =====
    setInterval(async () => {
        const status = getSmpStatus();

        const embed = new EmbedBuilder()
            .setTitle("🟩 DRK SURVRAZE SMP STATUS")
            .setColor(status.online ? 0x00ff00 : 0xff0000)
            .addFields(
                {
                    name: "🖥 Server",
                    value: status.online ? "🟢 Online" : "🔴 Offline",
                    inline: true
                },
                {
                    name: "👥 Players Online",
                    value: `${status.players}`,
                    inline: true
                }
            )
            .setFooter({ text: "Auto update every 2 seconds" })
            .setTimestamp();

        await statusMessage.edit({
            content: "",
            embeds: [embed]
        });
    }, 2000);
});

// ================= IP REPLY SYSTEM (UNCHANGED) =================
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const hasIpWord = /\bip\b/.test(content);

    if (hasIpWord) {
        const replyMessage = `
🎮 **DrkSurvRaze Server Connection Details**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

**☕ JAVA EDITION:**
🔗 **IP:** \`${SERVER_DETAILS.javaIp}\`

**🪨 BEDROCK EDITION:**
🔗 **IP:** \`${SERVER_DETAILS.bedrockIp}\`
⚡ **PORT:** \`${SERVER_DETAILS.port}\`

🌐 **WEBSITE:** ${SERVER_DETAILS.website}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        `.trim();

        await message.channel.send({ content: replyMessage });

        console.log(`📨 ${message.author.tag} কে সার্ভার ডিটেইলস পাঠানো হয়েছে`);
    }
});

client.login(token);
