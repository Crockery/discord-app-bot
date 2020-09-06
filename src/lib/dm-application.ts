import { Message } from 'discord.js'

export const startDmApp = async (message: Message) => {
  const dm = await message.author.createDM()
  await dm.send('Hey there! Type `!start` to start your application, and `!end` to exit the process without applying at any time.')
  let appProgress
  try {
    const hasStarted = await dm.awaitMessages(
      (message: Message) => {
        const willReturn = message.content === '!start' || message.content === '!end'
        console.log({ msg: message.content, willReturn })
        return willReturn
      },
      {
        time: 60000,
        errors: ['time']
      }
    )
      .then(collection => {
        console.log(collection.first())
        if (collection.array().some(message => {
          console.log('FILTERED: ', message.content)
          return message.content === '!start'
        })) {
          return true
        } else {
          return false
        }
      })
      .catch(() => {
        throw new Error('Timed Out')
      })
    if (hasStarted) {
      await dm.send('Starting Application Process')
    } else {
      await dm.send('Ending Application Process')
      await dm.delete()
    }
  } catch (e) {
    await dm.send('Timed Out')
    await dm.delete()
  }


}