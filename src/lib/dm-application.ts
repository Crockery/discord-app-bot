import { Message } from 'discord.js'
import { WELCOME_CHANNEL_ID } from '../config'
import { DB } from '../db'
import { endApplication } from '../helpers'

export const startDmApp = async (message: Message, db: DB) => {
  const dm = await message.author.send('Hey there 👋! Type `!start` to start your application, and `!end` to exit the process at any time.')
  const dmStartFilter = (m: Message) => m.content === '!start'

  try {
    await dm.channel.awaitMessages(dmStartFilter, { time: 10000, max: 1, errors: ['time'] })
  } catch (e) {
    await endApplication(
      'timed out of their application',
      db,
      message
    )
    await dm.channel.send('Took too long to respond. Please re-`!apply` if you still wish to apply.')
  }
}