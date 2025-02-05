import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const cooldown: number = 5;

export const data: SlashCommandBuilder = new SlashCommandBuilder().setName('ping').setDescription('Répond gentiment à votre ping');

export async function execute(interaction: any) {
  const embed: EmbedBuilder = new EmbedBuilder().setTitle('Pong!').setDescription(`🏓 ${interaction.client.ws.ping}ms`);

  await interaction.reply({ embeds: [embed] });
}
