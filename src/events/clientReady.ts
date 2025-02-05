import { Events, ActivityType } from 'discord.js';
import { logSuccess } from '@lib/console';

export const name = Events.ClientReady;
export const once = true;
export const customName = 'clientReady';

export function execute(client) {
  // Processing the bot login
  client.user.setActivity('Roknos@task/bot-base', { type: ActivityType.Watching });
  logSuccess('Bot en ligne !');
}
