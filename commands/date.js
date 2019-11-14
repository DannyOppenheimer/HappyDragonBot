const Discord = require('discord.js');
const moment = require('moment');

module.exports.run = async (client, message, args) => {


    let dateEmbed = new Discord.RichEmbed()
        .setColor('#965BCA')
        .addField("Date and Time: ", (moment().format('LLLL')))
        .setFooter('Beep boop, I\'m a bot!')
        .setTimestamp();
    message.channel.send(dateEmbed);
}

module.exports.config = {
    command: "date",
    aliases: []
}