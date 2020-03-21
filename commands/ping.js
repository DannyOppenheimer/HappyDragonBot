const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {

    const m = await message.channel.send("Ping?");
    let pingEmbed = new Discord.RichEmbed()
        .setColor('#965BCA')
        .addField("Your ping is: ", (m.createdTimestamp - message.createdTimestamp) + "ms")
        .addField('API Latency is: ',  `${Math.round(client.ping)}ms`)
        .setTimestamp()
        .setFooter('Beep boop, I\'m a bot!');   
    m.edit(pingEmbed);
}

module.exports.config = {
    command: "ping",
    aliases: []
}