const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { Status } = require('minecraft-server-util');

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

// Slash Commands register korar jonno
const commands = [
    new SlashCommandBuilder()
        .setName('mcplayer')
        .setDescription('Minecraft server er realtime player information dekhabe')
];

const rest = new REST({ version: '10' }).setToken(token);

client.on('ready', async () => {
    console.log(`✅ ${client.user.tag} Railway e run korche!`);
    console.log(`✅ IP response system chalu!`);
    console.log(`✅ Minecraft player check system chalu!`);
    
    try {
        console.log('🔧 Slash commands register kora hocche...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('✅ Slash commands successfully register hoyeche!');
    } catch (error) {
        console.error('❌ Slash commands register korte problem:', error);
    }
});

// Slash Command handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'mcplayer') {
        await interaction.deferReply(); // Loading state dekhabe

        try {
            console.log(`🔄 ${interaction.user.tag} er jonno Minecraft server status check kora hocche...`);
            
            const status = await Status(SERVER_DETAILS.javaIp, parseInt(SERVER_DETAILS.port), {
                timeout: 5000,
                enableSRV: true
            });

            const playerCount = status.players.online;
            const maxPlayers = status.players.max;
            const playerList = status.players.sample ? status.players.sample.map(player => player.name).join(', ') : 'Kono player online nei';
            
            const statusMessage = `
🎮 **DrkSurvRaze Server - Live Status**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

👥 **Players Online:** ${playerCount}/${maxPlayers}
${playerCount > 0 ? `👤 **Online Players:** ${playerList}` : '🔍 **Currently kono player online nei**'}

📊 **Server Version:** ${status.version.name}
🏓 **Ping:** ${status.roundTripLatency}ms

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

🌐 **Website:** ${SERVER_DETAILS.website}
            `.trim();

            await interaction.editReply({
                content: statusMessage
            });

            console.log(`✅ ${interaction.user.tag} ke server status pathano hoyeche`);

        } catch (error) {
            console.error('❌ Server status check korte problem:', error);
            
            await interaction.editReply({
                content: '❌ **Server currently offline ba check korte problem hocche!**\n\nServer offline thakte pare, network problem hote pare, ba server restarted hocche. Please pore abar try korun.'
            });
        }
    }
});

// Old IP response system (same as before)
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    
    // Shudhu "ip" shobdo ta khuje ber kora (jekono jaygay thakle)
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
        
        await message.channel.send({
            content: replyMessage
        });
        
        console.log(`📨 ${message.author.tag} ke server details pathano hoyeche - Message: "${message.content}"`);
    }
});

client.login(token);
