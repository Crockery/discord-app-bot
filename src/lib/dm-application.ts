import { Message } from 'discord.js'

export const startDmApp = async (message: Message) => {
  const dm = await message.author.createDM()
  await dm.send('Hey there! Type `!start` to start your application, and `!end` to exit the process without applying at any time.')

  try {
    const startMessage = await dm.awaitMessages(
      (message: Message) => message.content === '!start' || message.content === '!end',
      {
        time: 60000,
        max: 1
      }
    )
      .then(collection => collection.first())
      .catch(() => {
        throw new Error('Timed Out')
      })
    
    if (startMessage.content === '!start') {
      await dm.send('Starting Application Process')
    } else {
      await dm.send('Ending Application Process')
      await dm.delete('Ended By User')
    }
  } catch (e) {
    await dm.delete('Timed Out')
  }


}