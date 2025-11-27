const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

// বট টোকেন এবং ক্লায়েন্ট আইডি সেট করুন
const TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';

// নতুন ক্লায়েন্ট তৈরি করুন
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// কমান্ড রেজিস্ট্রেশন
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('বটের পিং চেক করুন')
].map(command => command.toJSON());

// REST API ব্যবহার করে কমান্ড রেজিস্টার করুন
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('কমান্ড রেজিস্টার করা হচ্ছে...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('কমান্ড সফলভাবে রেজিস্টার্ড হয়েছে!');
  } catch (error) {
    console.error('কমান্ড রেজিস্টার করতে সমস্যা:', error);
  }
})();

// বট প্রস্তুত হলে
client.once('ready', () => {
  console.log(`লগইন হয়েছে ${client.user.tag} হিসেবে!`);
});

// স্ল্যাশ কমান্ড হ্যান্ডলার
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    const sent = await interaction.reply({ content: 'পিং গণনা করা হচ্ছে...', fetchReply: true });
    const ping = sent.createdTimestamp - interaction.createdTimestamp;
    
    await interaction.editReply(`🏓 **পং!**\n📡 বট লেটেন্সি: ${ping}ms\n💓 API লেটেন্সি: ${Math.round(client.ws.ping)}ms`);
  }
});

// বট লগইন করুন
client.login(TOKEN);
