const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Server Information
const SERVER_INFO = {
    java: {
        ip: 'play.drksurvraze.top',
        port: null
    },
    bedrock: {
        ip: 'play.drksurvraze.top',
        port: '25655'
    },
    website: 'https://drksurvraze.top'
};

// Keywords that trigger the bot response
const TRIGGER_KEYWORDS = ['ip', 'server', 'server ip', 'mc server', 'minecraft', 'connect', 'how to join'];

client.on('ready', () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
    client.user.setActivity('Minecraft Server Info', { type: 'PLAYING' });
});

client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;
    
    const content = message.content.toLowerCase();
    
    // Check if message contains trigger keywords
    const shouldRespond = TRIGGER_KEYWORDS.some(keyword => 
        content.includes(keyword.toLowerCase())
    );
    
    if (shouldRespond) {
        const embed = new EmbedBuilder()
            .setColor(0x00FF00) // Green color
            .setTitle('🎮 DrkSurvRaze Minecraft Server')
            .setDescription('Here are the server details:')
            .addFields(
                {
                    name: '🟢 **JAVA EDITION**',
                    value: `\`\`\`${SERVER_INFO.java.ip}\`\`\``,
                    inline: false
                },
                {
                    name: '🟣 **BEDROCK EDITION**',
                    value: `\`\`\`IP: ${SERVER_INFO.bedrock.ip}\nPort: ${SERVER_INFO.bedrock.port}\`\`\``,
                    inline: false
                },
                {
                    name: '🌐 **WEBSITE**',
                    value: `[${SERVER_INFO.website}](${SERVER_INFO.website})`,
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: 'DrkSurvRaze Server', iconURL: 'https://cdn.discordapp.com/embed/avatars/0.png' });
        
        // Try to send the embed
        try {
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback to simple message if embed fails
            const simpleMessage = `
**DrkSurvRaze Minecraft Server Details:**

🟢 **JAVA EDITION:**
\`${SERVER_INFO.java.ip}\`

🟣 **BEDROCK EDITION:**
IP: \`${SERVER_INFO.bedrock.ip}\`
Port: \`${SERVER_INFO.bedrock.port}\`

🌐 **WEBSITE:**
${SERVER_INFO.website}
            `;
            await message.channel.send(simpleMessage);
        }
    }
});

// Error handling
client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
