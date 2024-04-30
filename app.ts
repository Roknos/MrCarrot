import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { logInfo, logWarning, logSuccess, logStatus, logStatup, logError } from '@lib/console';
import settings from './settings/core.json';
import type { CustomClient, Command } from '@lib/types';

config();

const activatedModules = settings.activated_modules;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as CustomClient;
client.cooldowns = new Collection();
client.commands = new Collection();

// WARNING ONLY FOR DEBBUGING OR DEV
//client.setMaxListeners(15);

// ==============================
// importing and executing commands
// ==============================

logStatus('Processing bot commands');
for (const modules of activatedModules) {
  const commandsPath = path.join(__dirname, 'src', 'modules', modules);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const filePath = path.join('file://', __dirname, 'src', 'modules', modules, file);

    const command: Command = await import(filePath);

    // Check if the command has the required properties
    if (!('data' in command) || !('execute' in command) || !('cooldown' in command)) {
      logError(`The command at ${filePath} is missing a required "data" or "execute" or "cooldown" property.`);
      break;
    }

    client.commands.set(command.data.name, command);
    logStatup(`Loaded command ${command.data.name} from ${modules}`);
  }
  logSuccess(`Module ${modules} loaded`);
}

// ==============================
// importing and executing events
// ==============================

logStatus('Processing bot events');

const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

for (const file of eventFiles) {
  const filePath = path.join('file://', __dirname, 'src', 'events', file);
  const event = await import(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
    logStatup(`Loaded 1 event : ${event.customName}`);
  }
}

// export client for use in other files that doesn't use discord.js interaction.client
export default client;

client.login(process.env.BOT_TOKEN);
