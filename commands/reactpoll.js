const Discord = require('discord.js');

module.exports.run = async (client, message, cont) => {

    message.delete();
    if (!cont.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}! Use &rpoll (title) {Main Body}`);
    } else {
        if(!cont[0].includes('(')) {
            message.channel.send({embed:{
                title:'Incorrect Syntax: You need a \'(\'',
                color: 0x965BCA
            }});
        } else {
            let e = 0;
            for(e; e<cont.length; e++) {
                if(cont[e].includes(')')) {
                    break;   
                } else if(cont[e].includes('{')) {
                    message.channel.send({embed:{
                        title:'Incorrect Syntax: You need a \')\'',
                        color: 0x965BCA
                    }});
                    return;
                }
            }
            if(!cont[e].includes(')')) {
                message.channel.send({embed:{
                    title:'Incorrect Syntax: You need a \')\'',
                    color: 0x965BCA
                }});
            } else { 
                e++;
                if(!cont[e].includes('{')) {
                    message.channel.send({embed:{
                        title:'Incorrect Syntax: You need a \'{\'',
                        color: 0x965BCA
                    }});
                } else {
                    for(e; e<cont.length; e++) {
                        if(cont[e].includes('}')) {
                            break;
                        }
                    }
                    e = cont.length - 1;
                    if(!cont[e].includes('}')) {
                        message.channel.send({embed:{
                            title:'Incorrect Syntax: You need a \'}\'',
                            color: 0x965BCA
                        }});
                    } else {
                        var bigBoiString = cont.join(' ');
                        var e1 = bigBoiString.replace("{", "");
                        var e2 = e1.replace("}", "");
                        var e3 = e2.replace("(", "**");
                        var e4 = e3.replace(")", "**:");
                        let pollEmbed = new Discord.RichEmbed()
                            .setColor('#965BCA')
                            .setTitle(e4)
                            .setAuthor(`${message.author.username}'s poll:`, message.author.avatarURL)
                            .setTimestamp()
                            .setFooter('Beep boop, I\'m a bot!');
                        message.channel.send(pollEmbed).then(sentEmbed => {
                        sentEmbed.react('✅')
                        sentEmbed.react('❌')
                        });
                    }
                }
            }
        }
    }
}

module.exports.config = {
    command: "reactionpoll",
    aliases: ["reactpoll", "pollreaction", "pollreact"]
}