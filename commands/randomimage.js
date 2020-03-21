const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (client, message, cont) => {

    randomImage = Math.floor(Math.random()*20) +1 
    var imageEmbed = new Discord.RichEmbed()
        .attachFile("./Images/"+ randomImage.toString() +".jpg")
        .setImage('attachment://'+ randomImage.toString() + '.jpg')
        .setColor('#965BCA')    
        .setTimestamp()
        .setFooter('Beep boop, I\'m a bot!');
    message.channel.send(imageEmbed);
}

module.exports.config = {
    command: "randomimage",
    aliases: ["randomi", "irandom", "imagerandom"]
}