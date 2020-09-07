import { Message, Guild } from 'discord.js';

import { getGuildAppChannel, getRecruiterRole } from '../helpers'

export const isSetup = (message: Message): boolean => {
  let appChannel = getGuildAppChannel(message.guild)
  let recruiterRole = getRecruiterRole(message.guild)
  return !!appChannel && !!recruiterRole
}

export default async (message: Message): Promise<boolean> => {
  try {
    const guild = message.guild
    const member = message.member
    const reply = await message.reply('🕵️‍♀️ Checking requesting user permissions 🕵️‍♀️')

    const hasPermission = member.hasPermission(['ADMINISTRATOR']) || (
      member.hasPermission(['MANAGE_CHANNELS', 'MANAGE_ROLES'])
    )

    let appChannel = getGuildAppChannel(guild)
    let recruiterRole = getRecruiterRole(guild)

    if (!!appChannel && !!recruiterRole) {
      await reply.edit('✅ This server has already been set up ✅')
      return true
    }

    if (!hasPermission) {
      await reply.edit('🤚 Only admins, or users with "MANAGE_CHANNELS" & "MANAGE_ROLES" permissions cant setup this bot. 🤚')
      return false
    }

    const embed = {
      color: 4386805,
      fields: [
        {
          name: 'Recruiter Role',
          value: !!recruiterRole ? '[✅] Recruiter role exists.' : '[  ] Creating Recruiter role...'
        },
        {
          "name": 'Applications Channel',
          "value": !!appChannel ? '[✅] Applications category exists.' : '[  ] Creating Applications category...'
        }
      ]
    }

    await reply.edit(null, {
      content: 'Setting up server...',
      embed
    })

    if (!recruiterRole) {
      recruiterRole = await guild.roles.create({
        data: {
          color: 'YELLOW',
          name: 'Recruiter',
          permissions: [
            'MANAGE_ROLES',
            'ADD_REACTIONS',
            'SEND_MESSAGES',
            'SPEAK',
            'STREAM',
            'USE_EXTERNAL_EMOJIS',
            'VIEW_CHANNEL',
            'EMBED_LINKS',
            'ATTACH_FILES',
            'CHANGE_NICKNAME',
            'CONNECT'
          ]
        }
      })
      embed.fields[0] = {
        name: 'Recruiter Role',
        value: '[✅] Recruiter role added.'
      }
      await reply.edit(null, {
        content: 'Setting up server...',
        embed
      })
    }

    if (!appChannel) {
        appChannel = await guild.channels.create('Applications', {
          type: 'category',
        })
        await appChannel.overwritePermissions([
          {
            id: guild.roles.everyone.id,
            deny: ['VIEW_CHANNEL']
          },
          {
            id: recruiterRole.id,
            allow: ['VIEW_CHANNEL']
          }
        ])

        embed.fields[1] = {
          name: 'Applications Channel',
          value: '[✅] Applications category added.'
        }
        await reply.edit(null, {
          content: 'Server set up complete!',
          embed
        })
    }
    return true
  } catch (e) {
    throw new Error(e)
  }
}