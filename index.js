const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

// বট ক্লায়েন্ট তৈরি করুন
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// বট টোকেন (আপনার বটের টোকেন দিয়ে REPLACE করুন)
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';

// স্ল্যাশ কমান্ড রেজিস্টার করার ফাংশন
async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('বটের পিং চেক করুন')
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

    try {
        console.log('স্ল্যাশ কমান্ড রেজিস্টার করা হচ্ছে...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('স্ল্যাশ কমান্ড সফলভাবে রেজিস্টার হয়েছে!');
    } catch (error) {
        console.error('কমান্ড রেজিস্টারে সমস্যা:', error);
    }
}

// বট রেডি হলে
client.once('ready', () => {
    console.log(`✅ ${client.user.tag} বট চালু হয়েছে!`);
    registerCommands();
});

// কমান্ড হ্যান্ডলার
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        const sent = await interaction.reply({ content: 'পিং গণনা করা হচ্ছে...', fetchReply: true });
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        
        await interaction.editReply(`🏓 **পং!**\n📡 বট লেটেন্সি: ${ping}ms\n💓 API লেটেন্সি: ${client.ws.ping}ms`);
    }
});

// বট লগইন করুন
client.login(BOT_TOKEN);
