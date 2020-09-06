import { Message } from 'discord.js'

export const startDmApp = async (message: Message) => {
  const dm = await message.author.createDM()
  await dm.send('Hey there! Type `!start` to start your application, and `!end` to exit the process without applying at any time.')

  await dm.awaitMessages(
    (message: Message) => message.content === '!start' || message.content === '!end',
    {
      time: 60000,
      max: 1
    }
  )
    .then(async (collected) => {
      const message = collected.first()
      if (message.content === '!start') {
        await dm.send('Starting application!')
      }
      if (message.content === '!end') {
        await message.reply('Ended application early.')
        await dm.delete('Ending Application')
      }
    })
    .catch(() => dm.delete('Took too long to respond.'))
}