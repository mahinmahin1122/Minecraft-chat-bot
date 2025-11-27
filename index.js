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
🎮 **ডার্ক সারভাইভাল জ়েরো সার্ভার কানেকশন ডিটেইলস**

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

**☕ জাভা এডিশন:**
🔗 **আইপি:** \`${SERVER_DETAILS.javaIp}\`
⚡ **পোর্ট:** \`${SERVER_DETAILS.port}\`

**🪨 বেডরক এডিশন:**
🔗 **আইপি:** \`${SERVER_DETAILS.bedrockIp}\`
⚡ **পোর্ট:** \`${SERVER_DETAILS.port}\`

🌐 **ওয়েবসাইট:** ${SERVER_DETAILS.website}

*আইপি বা পোর্ট কপি করতে উপরের বাটন ব্যবহার করুন*
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
            content: `📋 Java IP কপি করা হয়েছে: \`${SERVER_DETAILS.javaIp}\``,
            ephemeral: true
        });
    }

    if (interaction.customId === 'copy_port') {
        await interaction.reply({ 
            content: `📋 পোর্ট কপি করা হয়েছে: \`${SERVER_DETAILS.port}\``,
            ephemeral: true
        });
    }
});

client.login(token);
