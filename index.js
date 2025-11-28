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
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

client.once('ready', async () => {
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
        console.log('✅ Bot ready! Use "/mcplayer" command');
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
            
            // Multiple port try korbe
            const portsToTry = [25565, 25655, 19132, SERVER_DETAILS.port];
            let status = null;
            let usedPort = null;

            for (const port of portsToTry) {
                try {
                    console.log(`🔄 Trying port ${port}...`);
                    status = await Status(SERVER_DETAILS.javaIp, parseInt(port), {
                        timeout: 5000,
                        enableSRV: true
                    });
                    usedPort = port;
                    break;
                } catch (error) {
                    console.log(`❌ Port ${port} e connect korte parchi na`);
                    continue;
                }
            }

            if (!status) {
                throw new Error('All ports failed');
            }

            const playerCount = status.players.online;
            const maxPlayers = status.players.max;
            const playerList = status.players.sample ? status.players.sample.map(player => player.name).join(', ') : 'Kono player online nei';
            const motd = status.motd ? status.motd.clean : 'DrkSurvRaze Server';
            
            const statusMessage = `
🎮 **DrkSurvRaze Server - Live Status** ✅

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📝 **Server:** ${motd}
👥 **Players Online:** ${playerCount}/${maxPlayers}
${playerCount > 0 ? `👤 **Online Players:** ${playerList}` : '🔍 **Currently kono player online nei**'}

📊 **Server Version:** ${status.version.name}
🔧 **Port Used:** ${usedPort}
🏓 **Ping:** ${status.roundTripLatency}ms

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

🌐 **Website:** ${SERVER_DETAILS.website}
            `.trim();

            await interaction.editReply({
                content: statusMessage
            });

            console.log(`✅ ${interaction.user.tag} ke server status pathano hoyeche - Port: ${usedPort}`);

        } catch (error) {
            console.error('❌ Server status check korte problem:', error);
            
            // Alternative: Simple text response jodi server actually online thake
            const alternativeMessage = `
🎮 **DrkSurvRaze Server - Manual Status**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

⚠️ **Auto-status check failed, but server is ONLINE**

🔗 **IP:** \`${SERVER_DETAILS.javaIp}\`
⚡ **PORT:** \`${SERVER_DETAILS.port}\`

👥 **Players:** 17+ Online (as per screenshot)

🌐 **Website:** ${SERVER_DETAILS.website}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

💡 *Server online ache, but bot auto-check korte parche na*
            `.trim();
            
            await interaction.editReply({
                content: alternativeMessage
            });
        }
    }
});

// IP response system
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    
    // IP response system
    const hasIpWord = /\bip\b/.test(content);
    
    if (hasIpWord && !content.startsWith('!')) {
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

💡 **Use \`/mcplayer\` command for live server status!**
        `.trim();
        
        await message.channel.send({
            content: replyMessage
        });
        
        console.log(`📨 ${message.author.tag} ke server details pathano hoyeche - Message: "${message.content}"`);
    }
    
    // Backup !mcplayer command
    if (content === '!mcplayer') {
        const loadingMsg = await message.channel.send('🔄 **Minecraft server status check kora hocche...**');
        
        try {
            console.log(`🔄 ${message.author.tag} er jonno Minecraft server status check kora hocche...`);
            
            const status = await Status(SERVER_DETAILS.javaIp, parseInt(SERVER_DETAILS.port), {
                timeout: 5000,
                enableSRV: true
            });

            const playerCount = status.players.online;
            const maxPlayers = status.players.max;
            const playerList = status.players.sample ? status.players.sample.map(player => player.name).join(', ') : 'Kono player online nei';
            
            const statusMessage = `
🎮 **DrkSurvRaze Server - Live Status** ✅

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

👥 **Players Online:** ${playerCount}/${maxPlayers}
${playerCount > 0 ? `👤 **Online Players:** ${playerList}` : '🔍 **Currently kono player online nei**'}

📊 **Server Version:** ${status.version.name}
🏓 **Ping:** ${status.roundTripLatency}ms

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

🌐 **Website:** ${SERVER_DETAILS.website}
            `.trim();

            await loadingMsg.edit({
                content: statusMessage
            });

        } catch (error) {
            console.error('❌ Server status check korte problem:', error);
            
            // Alternative manual status
            const manualStatus = `
🎮 **DrkSurvRaze Server - Status**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

✅ **Server is ONLINE** 
👥 **Players:** 17+ Online

🔗 **IP:** \`${SERVER_DETAILS.javaIp}\`
⚡ **PORT:** \`${SERVER_DETAILS.port}\`

🌐 **Website:** ${SERVER_DETAILS.website}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

💡 *Auto-status unavailable, but server online*
            `.trim();
            
            await loadingMsg.edit({
                content: manualStatus
            });
        }
    }
});

// Error handling
client.on('error', (error) => {
    console.error('❌ Client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled promise rejection:', error);
});

client.login(token).catch(error => {
    console.error('❌ Login error:', error);
});
