import { Client, Message } from 'discord.js';
import * as config from './config'
import { startDmApp } from './lib/dm-application'

export class DiscordBot {
  private static instance: DiscordBot;

  private client: Client = new Client();

  private constructor() {
    this.initializeCient();
  }

  static getInstance(): DiscordBot {
    if (!DiscordBot.instance) {
      DiscordBot.instance = new DiscordBot();
    }
    return DiscordBot.instance;
  }

  connect(): void {
    this.client
      .login(process.env.D_TOKEN)
      .then(_ => console.log('Connected to Discord'))
      .catch(error =>
        console.error(`Could not connect. Error: ${error.message}`)
      );
  }

  private initializeCient(): void {
    if (!this.client) return;

    this.setReadyHandler();
    this.setMessageHandler();
  }
  
  private setReadyHandler(): void {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
  };

  private setMessageHandler(): void {
    this.client.on('message', async (message: Message) => {
      //* filters out requests from bots
      if (message.author.bot) return;

      if (message.content === '!apply') {
        await message.reply(`Thanks for your interest in **${config.SERVER_NAME}**. Sending you a DM to start the application process.`);
        await startDmApp(message)
      }
    });
  };
}