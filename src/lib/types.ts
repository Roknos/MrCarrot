import type { Client, Collection } from 'discord.js';

export interface CustomClient extends Client {
  commands: Collection<string, any>;
  cooldowns: Collection<string, any>;
}

export interface Command {
  cooldown: number;
  data: {
    name: string;
    description: string;
    options: any;
  };
  execute: (interaction: any) => void;
}
