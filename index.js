const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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
    console.log(`✅ ${client.user.tag} is running on Railway!`);
    console.log(`✅ IP Response system activated!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();
    
    if (content === 'ip' || content === '/ip') {
        // Copy buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Copy Java IP')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId('copy_java_ip'),
                new ButtonBuilder()
                    .setLabel('Copy Port')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('copy_port'),
                new ButtonBuilder()
                    .setLabel('Visit Website')
                    .setStyle(ButtonStyle.Link)
                    .setURL(SERVER_DETAILS.website)
            );

        const replyMessage = `
**DrKSurvRaze Server Connection Details**

**Java IP**  
**Bedrock IP**  
**Port: ${SERVER_DETAILS.port}**

Use the button above to copy the IP or port
        `.trim();
        
        const sentMessage = await message.channel.send({
            content: replyMessage,
            components: [row]
        });
        
        console.log(`📨 Server details sent to ${message.author.tag}`);
    }
});

// Button interaction handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'copy_java_ip') {
        await interaction.reply({ 
            content: `Java IP has been copied: \`${SERVER_DETAILS.javaIp}\``,
            ephemeral: true
        });
    }

    if (interaction.customId === 'copy_port') {
        await interaction.reply({ 
            content: `Port has been copied: \`${SERVER_DETAILS.port}\``,
            ephemeral: true
        });
    }
});

client.login(token);
