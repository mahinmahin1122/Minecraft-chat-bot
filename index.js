const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { Rcon } = require("rcon-client");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ================= CONFIG =================
const token = process.env.DISCORD_TOKEN;

const STATUS_CHANNEL_ID = "1449379314985472041";

// Minecraft Server Info
const MC_SERVER = {
    host: "play.drksurvraze.top",
    rconPort: 25575, // server.properties rcon.port
    rconPassword: "Lauramahin01980" // ⚠️ এখানে নিজের RCON password দাও
};

const SERVER_DETAILS = {
    javaIp: "play.drksurvraze.top",
    bedrockIp: "play.drksurvraze.top",
    port: "25655",
    website: "https://drksurvraze.vercel.app/"
};
// =========================================

// ================= REAL-TIME SMP STATUS =================
async function getSmpStatus() {
    try {
        const rcon = await Rcon.connect({
            host: MC_SERVER.host,
            port: MC_SERVER.rconPort,
            password: MC_SERVER.rconPassword
        });

        const response = await rcon.send("list");
        await rcon.end();

        // Example: There are 5 of a max of 100 players online: Alex, Steve
        const match = response.match(/There are (\d+)/);
        const count = match ? match[1] : "0";

        return {
            online: true,
            players: count
        };
    } catch (err) {
        console.error("❌ RCON Error:", err.message);
        return {
            online: false,
            players: "0"
        };
    }
}
// =======================================================

// ================= BOT READY =================
client.on("ready", async () => {
    console.log(`✅ ${client.user.tag} Railway এ রান করছে!`);

    const channel = await client.channels.fetch(STATUS_CHANNEL_ID);
    const statusMessage = await channel.send("🔄 SMP Status Loading...");

    // 🔁 Auto update (REAL-TIME)
    setInterval(async () => {
        const status = await getSmpStatus();

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
                    value: status.players,
                    inline: true
                }
            )
            .setFooter({ text: "Auto update every 5 seconds" })
            .setTimestamp();

        await statusMessage.edit({
            content: "",
            embeds: [embed]
        });
    }, 5000); // ⚠️ 5 seconds recommended
});
// ============================================

// ================= IP REPLY SYSTEM =================
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const hasIpWord = /\bip\b/.test(content);

    if (hasIpWord) {
        const replyMessage = `
🎮 **DrkSurvRaze Server Connection Details**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

**☕ JAVA EDITION**
🔗 IP: \`${SERVER_DETAILS.javaIp}\`

**🪨 BEDROCK EDITION**
🔗 IP: \`${SERVER_DETAILS.bedrockIp}\`
⚡ PORT: \`${SERVER_DETAILS.port}\`

🌐 WEBSITE: ${SERVER_DETAILS.website}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        `.trim();

        await message.channel.send({ content: replyMessage });
    }
});
// ====================================================

client.login(token);
