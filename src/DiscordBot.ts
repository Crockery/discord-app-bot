import { Client, Message, TextChannel } from 'discord.js';
import * as config from './config'
import { startDmApp } from './lib/dm-application'
import { DB } from './db'
import { endApplication } from './helpers'

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
      this.welcomeChannel = await this.client.channels.fetch(config.APPLICATION_CHANNEL_ID) as TextChannel
    });
  };

  private setMessageHandler(): void {
    this.client.on('message', async (message: Message) => {
      try {
        //* filters out requests from bots
        if (message.author.bot) return;

        if (message.content === '!end' && message.channel.type === 'dm') {
          endApplication(
            'ended their application early',
            this.db,
            message,
            this.welcomeChannel
          )
        }

        if (message.content === '!apply' && message.channel.type !== 'dm') {
          const hasActiveDM = this.db.has(message.author.id)
          if (!hasActiveDM) {
            const welcomeMessage = await message.reply(`Thanks for your interest in **${config.SERVER_NAME}**. Sending you a DM to start the application process.`);
            this.db.set(message.author.id, { welcomeMessageId: welcomeMessage.id })
            startDmApp(message, this.db)
          }
        }
      } catch (e) {
        console.log(e)
      }
    });
  };
}