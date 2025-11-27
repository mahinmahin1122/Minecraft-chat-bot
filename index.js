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
    console.log(`✅ ${client.user.tag} Railway এ রান করছে!`);
    console.log(`✅ IP রেসপন্স সিস্টেম চালু!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();
    
    if (content === 'ip' || content === '/ip') {
        // কপি বাটন তৈরি
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Java IP কপি করুন')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId('copy_java_ip'),
                new ButtonBuilder()
                    .setLabel('পোর্ট কপি করুন')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('copy_port'),
                new ButtonBuilder()
                    .setLabel('ওয়েবসাইট ভিজিট করুন')
                    .setStyle(ButtonStyle.Link)
                    .setURL(SERVER_DETAILS.website)
            );

        const replyMessage = `
🎮 **DrkSurvRaze Server Connection Details**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

**☕ JAVA EDITION:**
🔗 **IP:** \`${SERVER_DETAILS.javaIp}\`

**🪨 BEDROCK EDITION:**
🔗 **Ip:** \`${SERVER_DETAILS.bedrockIp}\`
⚡ **PORT:** \`${SERVER_DETAILS.port}\`

🌐 **WEBSITE:** ${SERVER_DETAILS.website}

*Use the button above to copy the IP or port*
        `.trim();
        
        const sentMessage = await message.channel.send({
            content: replyMessage,
            components: [row]
        });
        
        console.log(`📨 ${message.author.tag} কে সার্ভার ডিটেইলস পাঠানো হয়েছে`);
    }
});

// বাটন ইন্টার্যাকশন হ্যান্ডেলার
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'copy_java_ip') {
        await interaction.reply({ 
            content: `📋 Java IP has been copied: \`${SERVER_DETAILS.javaIp}\``,
            ephemeral: true
        });
    }

    if (interaction.customId === 'copy_port') {
        await interaction.reply({ 
            content: `📋 Port has been copied: \`${SERVER_DETAILS.port}\``,
            ephemeral: true
        });
    }
});

client.login(token);
