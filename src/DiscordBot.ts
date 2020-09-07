import { Client, Message, TextChannel } from 'discord.js';
import * as config from './config'
import { startDmApp } from './lib/dm-application'
import { DB } from './db'
import { endApplication } from './helpers'
import setup, { isSetup } from './commands/setup'
import apply from './commands/apply'

export class DiscordBot {
  private static instance: DiscordBot;

  private client: Client = new Client();
  private db: DB = new DB()
  private welcomeChannel: TextChannel | undefined

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
    this.client.on('ready', async () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
  };

  private setMessageHandler(): void {
    this.client.on('message', async (message: Message) => {
      try {
        //* filters out requests from bots
        if (message.author.bot) return;

        if (message.content === '!apply' && message.channel.type !== 'dm') {
          if (!isSetup(message)) {
            message.reply('This server has not been set up to take applications yet. An admin should use the `!setup` command.')
          } else {
            apply(message, this.client.user.id)
          }
        }

        if (message.content === '!setup' && message.channel.type !== 'dm') {
          setup(message)
        }
      } catch (e) {
        throw new Error(e)
      }
    });
  };
}