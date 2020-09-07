import { DB } from './db'
import { Message, TextChannel, Guild, GuildChannel, Role } from 'discord.js'

export const endApplication = async (
  reason: string,
  db: DB,
  message: Message,
  welcomeChannel?: TextChannel
) => {
  try {
    // check if the user has an active app
    const hasActiveDM = db.has(message.author.id)
    
    if (hasActiveDM) {
      // Require a welcomeChannel if ending an application via DM
      if (message.channel.type === 'dm' && !welcomeChannel) {
        throw new Error('Must provice a welcomeChannel if ending an application via DM.')
      }

      // Let the user know we're closing the app if its a DM.
      if (message.channel.type === 'dm') message.channel.send('**Closing Application**')

      const channel = welcomeChannel || message.channel

      // Fetch the memeber from the welcomeChannel if its provided.
      const member = !!welcomeChannel ?
        await welcomeChannel.members.get(message.author.id)
        :
        message.member

      // Fetch the welcome message id from the DB
      const welcomeMessageId = db.get(`${message.author.id}.welcomeMessageId`)

      if (!!welcomeMessageId) {
        const welcomeMessage = await channel.messages.fetch(welcomeMessageId)
        if (!!welcomeMessage) {
          // Delete the original apply message if it can be deleted.
          if (welcomeMessage.deletable) await welcomeMessage.delete()
          await channel.send(`**${member.nickname}** ${reason}.`)
        }
      }
      if (message.channel.type === 'dm') {
        await message.channel.delete()
      }
      db.delete(message.author.id)
    }
  } catch (e) {
    throw new Error(e)
  }
}

export const getGuildAppChannel = (guild: Guild): GuildChannel | undefined => {
  return guild.channels.cache.array().find(channel => {
    return channel.name === 'Applications' && channel.type === 'category'
  })
}

export const getRecruiterRole = (guild: Guild): Role | undefined => {
  return guild.roles.cache.array().find(role => {
    return role.name === 'Recruiter'
  })
}