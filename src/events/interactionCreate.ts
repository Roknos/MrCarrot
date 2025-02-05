import { Events, Collection, EmbedBuilder } from 'discord.js';
import { logError } from '@lib/console';

export const name = Events.InteractionCreate;
export const customName = 'interactionHandler';

export async function execute(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logError(`Aucune commande de la forme ${interaction.commandName} n'est présente.`);
    return;
  }

  const { cooldowns } = interaction.client;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      const embed = new EmbedBuilder()
        .setTitle('Pas trop vite !')
        .setDescription(`Merci d'attendre <t:${expiredTimestamp}:R> avant de réutiliser cette commande (\`${command.data.name}\`) !`)
        .setColor('#c79b4c');
      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  try {
    await command.execute(interaction);
  } catch (error) {
    logError(error);
    await interaction.reply({
      content: "Nous avons rencontré un problème au lancement de cette commande ! Merci de contacter l'administration",
      ephemeral: true
    });
  }
}
