const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

// Environment variables থেকে টোকেন নেওয়া
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN) {
  console.error('❌ DISCORD_TOKEN environment variable সেট করা নেই!');
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error('❌ CLIENT_ID environment variable সেট করা নেই!');
  process.exit(1);
}

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

// কমান্ড রেজিস্টার ফাংশন
async function registerCommands() {
  try {
    console.log('🔧 কমান্ড রেজিস্টার করা হচ্ছে...');
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ কমান্ড সফলভাবে রেজিস্টার্ড হয়েছে!');
  } catch (error) {
    console.error('❌ কমান্ড রেজিস্টার করতে সমস্যা:', error);
  }
}

// বট প্রস্তুত হলে
client.once('ready', () => {
  console.log(`✅ লগইন হয়েছে ${client.user.tag} হিসেবে!`);
});

// স্ল্যাশ কমান্ড হ্যান্ডলার - ERROR HANDLING সহ
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'ping') {
      // আগে ডিফার রিপ্লাই দিয়ে বলুন যে কাজ চলছে
      await interaction.deferReply();
      
      const sent = await interaction.fetchReply();
      const ping = sent.createdTimestamp - interaction.createdTimestamp;
      
      await interaction.editReply({
        content: `🏓 **পং!**\n📡 বট লেটেন্সি: ${ping}ms\n💓 API লেটেন্সি: ${Math.round(client.ws.ping)}ms`
      });
    }
  } catch (error) {
    console.error('❌ কমান্ড এক্সিকিউট করতে সমস্যা:', error);
    
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply('❌ কমান্ড এক্সিকিউট করতে সমস্যা হয়েছে!');
      } else {
        await interaction.reply('❌ কমান্ড এক্সিকিউট করতে সমস্যা হয়েছে!');
      }
    } catch (e) {
      console.error('❌ ইরর মেসেজ সেন্ড করতে পারিনি:', e);
    }
  }
});

// আনহ্যান্ডল্ড এরর হ্যান্ডলিং
process.on('unhandledRejection', (error) => {
  console.error('❌ আনহ্যান্ডল্ড প্রমিস রিজেকশন:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ আনকট এক্সেপশন:', error);
  process.exit(1);
});

// বট শুরু করুন
async function startBot() {
  try {
    await registerCommands();
    await client.login(TOKEN);
    console.log('🚀 বট শুরু হয়েছে!');
  } catch (error) {
    console.error('❌ বট লগইন করতে সমস্যা:', error);
    process.exit(1);
  }
}

startBot();
