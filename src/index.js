require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const cron = require('node-cron')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

cron.schedule('0 0 * * *', () => {
  oleoDeMacaco()
}, {
  timezone: 'America/Sao_Paulo'
})

async function oleoDeMacaco () {
  console.log('Triggering')
  const broadcast = client.voice.createBroadcast()
  const connections = await Promise.all(client.guilds.cache.map(async guild => {
    const channel = guild.channels.cache.filter(c => c.type === 'voice' && c.joinable && c.members.size > 0).first()
    if (!channel) return
    const connection = await channel.join()
    console.log(`Joined ${channel.id}`)
    connection.play(broadcast)
    return connection
  }))
  console.log('Joined all channels, playing sound')
  const dispatcher = broadcast.play('./src/oleodemacaco.mp3')
  dispatcher.on('finish', () => {
    connections.forEach(connection => {
      if (!connection) return
      connection.disconnect()
    })
  })
}

client.login(process.env.DISCORD_TOKEN)
