require('dotenv').config(); // Load environment variables from .env
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages] });

// Bot commands
const commands = [
  {
    name: 'first-warning',
    description: 'Send a first warning to a user.',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'The user to warn',
        required: true,
      },
      {
        name: 'password',
        type: 3, // STRING
        description: 'The password to execute this command',
        required: true,
      },
    ],
  },
  {
    name: 'second-warning',
    description: 'Send a second warning to a user.',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'The user to warn',
        required: true,
      },
      {
        name: 'password',
        type: 3, // STRING
        description: 'The password to execute this command',
        required: true,
      },
    ],
  },
  {
    name: 'last-warning',
    description: 'Send a final warning to a user.',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'The user to warn',
        required: true,
      },
      {
        name: 'password',
        type: 3, // STRING
        description: 'The password to execute this command',
        required: true,
      },
    ],
  },
  {
    name: 'punishment',
    description: 'Notify a user that punishment is now in place.',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'The user to notify',
        required: true,
      },
      {
        name: 'password',
        type: 3, // STRING
        description: 'The password to execute this command',
        required: true,
      },
    ],
  },
];

// Register slash commands using Discord's REST API
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log('Refreshing application (/) commands...');
    await rest.put(
      Routes.applicationCommands(process.env.APPLICATION_ID), // Replace with your Application ID
      { body: commands }
    );
    console.log('Successfully registered application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

// Handle bot events
client.on('ready', () => {
  console.log(`${client.user.tag} is online and ready!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  const PIN = '7606';

  // Validate password
  const verifyPassword = async () => {
    const passwordOption = interaction.options.getString('password');
    if (passwordOption !== PIN) {
      await interaction.reply({ content: 'Incorrect password. Access denied.', ephemeral: true });
      return false;
    }
    return true;
  };

  if (commandName === 'first-warning') {
    if (!(await verifyPassword())) return;
    const user = interaction.options.getUser('user');
    try {
      await user.send('This is your first warning.');
      await interaction.reply({ content: `First warning sent to ${user.tag}.`, ephemeral: true });
    } catch (error) {
      console.error('Error sending DM:', error);
      await interaction.reply({ content: 'Failed to send the message.', ephemeral: true });
    }
  } else if (commandName === 'second-warning') {
    if (!(await verifyPassword())) return;
    const user = interaction.options.getUser('user');
    try {
      await user.send('This is your second warning.');
      await interaction.reply({ content: `Second warning sent to ${user.tag}.`, ephemeral: true });
    } catch (error) {
      console.error('Error sending DM:', error);
      await interaction.reply({ content: 'Failed to send the message.', ephemeral: true });
    }
  } else if (commandName === 'last-warning') {
    if (!(await verifyPassword())) return;
    const user = interaction.options.getUser('user');
    try {
      await user.send('This is your last warning. Further violations will result in punishment.');
      await interaction.reply({ content: `Last warning sent to ${user.tag}.`, ephemeral: true });
    } catch (error) {
      console.error('Error sending DM:', error);
      await interaction.reply({ content: 'Failed to send the message.', ephemeral: true });
    }
  } else if (commandName === 'punishment') {
    if (!(await verifyPassword())) return;
    const user = interaction.options.getUser('user');
    try {
      await user.send('Punishment is now in place.');
      await interaction.reply({ content: `Punishment notice sent to ${user.tag}.`, ephemeral: true });
    } catch (error) {
      console.error('Error sending DM:', error);
      await interaction.reply({ content: 'Failed to send the message.', ephemeral: true });
    }
  }
});

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);
