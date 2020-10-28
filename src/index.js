require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const cron = require('node-cron')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

cron.schedule('0 0 * * *', () => {
  const broadcast = client.voice.createBroadcast()
  client.guilds.cache.each(async guild => {
    const channel = guild.channels.cache.filter(c => c.type === 'voice' && c.joinable && c.members.size > 0).first()
    if (!channel) return
    const connection = await channel.join()
    connection.play(broadcast)
    dispatcher.on('finish', () => {
      connection.disconnect()
    })
  })
  const dispatcher = broadcast.play('oleodemacaco.mp3')
}, {
  timezone: 'America/Sao_Paulo'
})

client.login(process.env.DISCORD_TOKEN)
