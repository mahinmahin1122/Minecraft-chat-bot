const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

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

// টোকেন এখানে সরাসরি দিন (Render.com এর Environment Variable থেকে পড়বে)
const DISCORD_TOKEN = process.env.DISCORD_TOKEN || 'your_bot_token_here';

// যদি টোকেন না থাকে তবে Error দেখাবে
if (!DISCORD_TOKEN || DISCORD_TOKEN === 'your_bot_token_here') {
    console.error('❌ ERROR: Discord Token is missing!');
    console.log('Please set DISCORD_TOKEN in Render.com environment variables');
    process.exit(1);
}

// Keywords that trigger the bot response
const TRIGGER_KEYWORDS = ['ip', 'server', 'server ip', 'mc server', 'minecraft', 'connect', 'how to join', 'drksurvraze'];

client.on('ready', () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
    client.user.setActivity('DrkSurvRaze Server', { type: 'PLAYING' });
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
            .setColor(0x00FF00)
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
            .setFooter({ text: 'DrkSurvRaze Server' });
        
        try {
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending message:', error);
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
client.login(DISCORD_TOKEN);
