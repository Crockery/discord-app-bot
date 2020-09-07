import { Message, CategoryChannel, TextChannel } from 'discord.js'

import { getGuildAppChannel, getRecruiterRole } from '../helpers'

export default async (message: Message, botId: string) => {
  try {
    const { guild, author } = message

    const appCategory = getGuildAppChannel(guild) as CategoryChannel | undefined
    const recruiterRole = getRecruiterRole(guild)

    if (!appCategory || !recruiterRole) {
      await message.reply('This server has not been set up to take applications yet. An admin should use the `!setup` command.')
      return false
    }

    let app = appCategory.children.find(channel => channel.name === `app-${author.id}`) as TextChannel | undefined

    if (app) {
      await app.send(`<@${author.id}> you have an in progress application.`)
    } else {
      app = await guild.channels.create(`app-${author.id}`, {
        parent: appCategory,
        type: 'text',
        permissionOverwrites: [
          {
            id: guild.id,
            deny: 'VIEW_CHANNEL'
          },
          {
            id: message.author.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
          },
          {
            id: recruiterRole.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
          },
          {
            id: botId,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
          }
        ]
      })
      await app.send(`<@${author.id}> thank you for your interest in applying! We'll run through the app process in this channel.`)
      return true
    }

  } catch (e) {
    throw new Error(e)
  }
}