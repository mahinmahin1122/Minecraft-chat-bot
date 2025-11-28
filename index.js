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
            
            const status = await Status(SERVER_DETAILS.javaIp, parseInt(SERVER_DETAILS.port), {
                timeout: 10000,
                enableSRV: true
            });

            const playerCount = status.players.online;
            const maxPlayers = status.players.max;
            const playerList = status.players.sample ? status.players.sample.map(player => player.name).join(', ') : 'Kono player online nei';
            const motd = status.motd ? status.motd.clean : 'DrkSurvRaze Server';
            
            const statusMessage = `
🎮 **DrkSurvRaze Server - Live Status**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📝 **Server:** ${motd}
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
            
            const errorMessage = `
❌ **Server Status Check Failed!**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

**Possible Reasons:**
• 🔄 Server currently offline
• 🌐 Network connection problem
• ⚡ Server restarting
• 🔧 Temporary maintenance

**Please try again after few minutes!**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

🌐 **Website:** ${SERVER_DETAILS.website}
            `.trim();
            
            await interaction.editReply({
                content: errorMessage
            });
        }
    }
});

// IP response system with both !mcplayer and ip detection
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
    
    // Backup !mcplayer command jodi slash command kaj na kore
    if (content === '!mcplayer') {
        const loadingMsg = await message.channel.send('🔄 **Minecraft server status check kora hocche...**');
        
        try {
            console.log(`🔄 ${message.author.tag} er jonno Minecraft server status check kora hocche...`);
            
            const status = await Status(SERVER_DETAILS.javaIp, parseInt(SERVER_DETAILS.port), {
                timeout: 10000,
                enableSRV: true
            });

            const playerCount = status.players.online;
            const maxPlayers = status.players.max;
            const playerList = status.players.sample ? status.players.sample.map(player => player.name).join(', ') : 'Kono player online nei';
            const motd = status.motd ? status.motd.clean : 'DrkSurvRaze Server';
            
            const statusMessage = `
🎮 **DrkSurvRaze Server - Live Status**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📝 **Server:** ${motd}
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

            console.log(`✅ ${message.author.tag} ke server status pathano hoyeche`);

        } catch (error) {
            console.error('❌ Server status check korte problem:', error);
            
            const errorMessage = `
❌ **Server Status Check Failed!**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

**Possible Reasons:**
• 🔄 Server currently offline
• 🌐 Network connection problem
• ⚡ Server restarting
• 🔧 Temporary maintenance

**Please try again after few minutes!**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

🌐 **Website:** ${SERVER_DETAILS.website}
            `.trim();
            
            await loadingMsg.edit({
                content: errorMessage
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
