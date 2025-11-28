const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { Status, Query } = require('minecraft-server-util');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const token = process.env.DISCORD_TOKEN;

const SERVER_DETAILS = {
    javaIp: "play.drksurvraze.top",
    bedrockIp: "play.drksurvraze.top", 
    port: "25655",
    queryPort: "25655", // Query port add koro
    website: "https://drksurvraze.vercel.app/"
};

// Player statistics storage
let playerStats = {
    onlinePlayers: 0,
    playerList: [],
    maxPlayers: 0,
    lastUpdated: null
};

// Slash Commands
const commands = [
    new SlashCommandBuilder()
        .setName('mcplayer')
        .setDescription('Minecraft server er realtime player information dekhabe'),
    new SlashCommandBuilder()
        .setName('mcstatus')
        .setDescription('Server er detailed status dekhabe')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

// Real player count get korar function
async function getRealPlayerCount() {
    try {
        console.log('🔄 Real player count check kora hocche...');
        
        // Method 1: Query protocol (more accurate)
        try {
            const query = await Query(SERVER_DETAILS.javaIp, parseInt(SERVER_DETAILS.queryPort), {
                timeout: 5000
            });
            
            playerStats = {
                onlinePlayers: query.players.online,
                playerList: query.players.list || [],
                maxPlayers: query.players.max,
                lastUpdated: new Date()
            };
            
            console.log(`✅ Query method: ${playerStats.onlinePlayers} players online`);
            return playerStats;
        } catch (queryError) {
            console.log('❌ Query method failed, trying Status method...');
        }
        
        // Method 2: Status protocol (fallback)
        const status = await Status(SERVER_DETAILS.javaIp, parseInt(SERVER_DETAILS.port), {
            timeout: 5000,
            enableSRV: true
        });
        
        playerStats = {
            onlinePlayers: status.players.online,
            playerList: status.players.sample ? status.players.sample.map(p => p.name) : [],
            maxPlayers: status.players.max,
            lastUpdated: new Date()
        };
        
        console.log(`✅ Status method: ${playerStats.onlinePlayers} players online`);
        return playerStats;
        
    } catch (error) {
        console.error('❌ Both methods failed:', error);
        throw error;
    }
}

// Auto update player count every 2 minutes
async function startAutoUpdate() {
    try {
        await getRealPlayerCount();
    } catch (error) {
        console.log('❌ Auto-update failed, retrying next cycle');
    }
    
    // Every 2 minutes update
    setTimeout(startAutoUpdate, 2 * 60 * 1000);
}

client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} Railway e run korche!`);
    console.log(`✅ Real-time player tracking chalu!`);
    
    // Auto-update start koro
    startAutoUpdate();
    
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
        await interaction.deferReply();

        try {
            console.log(`🔄 ${interaction.user.tag} er jonno REAL-TIME player count check...`);
            
            // Real-time data fetch koro
            const stats = await getRealPlayerCount();
            
            const playerListText = stats.playerList.length > 0 
                ? `👤 **Online Players:** ${stats.playerList.join(', ')}`
                : '🔍 **Currently kono player online nei**';
            
            const statusMessage = `
🎮 **DrkSurvRaze - Live Player Status** 📊

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

👥 **Players Online:** ${stats.onlinePlayers}/${stats.maxPlayers}
${playerListText}

⏰ **Last Updated:** ${stats.lastUpdated.toLocaleTimeString()}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

🌐 **Website:** ${SERVER_DETAILS.website}
            `.trim();

            await interaction.editReply({
                content: statusMessage
            });

            console.log(`✅ ${interaction.user.tag} ke REAL player count pathano hoyeche: ${stats.onlinePlayers}`);

        } catch (error) {
            console.error('❌ Real player count check fail:', error);
            
            // Last known data show korbe
            const fallbackMessage = `
🎮 **DrkSurvRaze - Player Status** ⚠️

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

❌ **Live update fail!**

📊 **Last Known Status:**
👥 **Players:** ${playerStats.onlinePlayers} online
⏰ **Updated:** ${playerStats.lastUpdated ? playerStats.lastUpdated.toLocaleTimeString() : 'Never'}

🔧 **Trying manual refresh...**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

💡 *Please try again in 1 minute*
            `.trim();
            
            await interaction.editReply({
                content: fallbackMessage
            });
        }
    }

    // Additional status command
    if (interaction.commandName === 'mcstatus') {
        await interaction.deferReply();
        
        try {
            const stats = await getRealPlayerCount();
            
            const statusMessage = `
🎮 **DrkSurvRaze - Detailed Status** 🔍

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📊 **Player Statistics:**
👥 **Online:** ${stats.onlinePlayers}/${stats.maxPlayers}
👤 **Active Players:** ${stats.playerList.length}

🕐 **Last Update:** ${stats.lastUpdated.toLocaleTimeString()}
📅 **Date:** ${stats.lastUpdated.toLocaleDateString()}

🔗 **Connection Info:**
🌐 **IP:** \`${SERVER_DETAILS.javaIp}\`
⚡ **Port:** \`${SERVER_DETAILS.port}\`

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

✅ **Server is LIVE with ${stats.onlinePlayers} players!**
            `.trim();
            
            await interaction.editReply({ content: statusMessage });
        } catch (error) {
            await interaction.editReply({
                content: '❌ **Server status check fail!** Server offline ba query disabled.'
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
🎮 **DrkSurvRaze Server Connection**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

**☕ JAVA EDITION:**
🔗 **IP:** \`${SERVER_DETAILS.javaIp}\`

**🪨 BEDROCK EDITION:**
🔗 **IP:** \`${SERVER_DETAILS.bedrockIp}\`
⚡ **PORT:** \`${SERVER_DETAILS.port}\`

📊 **Current Players:** ${playerStats.onlinePlayers} online

🌐 **Website:** ${SERVER_DETAILS.website}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

💡 **Use \`/mcplayer\` for live player list!**
        `.trim();
        
        await message.channel.send({
            content: replyMessage
        });
    }
    
    // Backup !mcplayer command
    if (content === '!mcplayer' || content === '!players') {
        try {
            const stats = await getRealPlayerCount();
            
            const statusMessage = `
🎮 **DrkSurvRaze - Players Online**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

👥 **${stats.onlinePlayers} Players Online**

${stats.playerList.length > 0 ? `**Playing Now:** ${stats.playerList.join(', ')}` : '**No players online**'}

⏰ ${stats.lastUpdated.toLocaleTimeString()}

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

💡 Use \`/mcstatus\` for detailed info
            `.trim();
            
            await message.reply({
                content: statusMessage
            });
        } catch (error) {
            await message.reply({
                content: `❌ Can't fetch player data. Server might be offline. Last known: ${playerStats.onlinePlayers} players`
            });
        }
    }
});

// Error handling
client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.login(token).catch(console.error);
