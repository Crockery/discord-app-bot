import { Message } from 'discord.js'

export const startDmApp = async (message: Message) => {
  const dm = await message.author.send('Hey there! Type `!start` to start your application, and `!end` to exit the process without applying at any time.')

  const dmStartFilter = (m: Message) => ['!start', '!end'].includes(m.content)
  
  const startCommand = await dm.channel.awaitMessages(dmStartFilter, { time: 300000, max: 999999, errors: ['time'] })

  console.log(startCommand.first())
}