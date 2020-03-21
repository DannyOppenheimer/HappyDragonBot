const Discord = require('discord.js');
const fs = require('fs');
const reactRoleMessages = JSON.parse(fs.readFileSync('./Storage/reactRoleMessages.json', 'utf8'));

module.exports.run = async (client, message, cont) => {

    if(cont.length < 1) return message.channel.send({embed:{title:'You need arguments, use >reactionrole <emoji> <role>'}});
    let roleName = cont[1];
    if(!message.guild.roles.find(x => x.name == roleName)) return message.channel.send({embed:{title:'The second argument is not a role, use >reactionrole <emoji> <role>'}});
    var reactMessageEmbed = new Discord.RichEmbed()
        .setTitle('Click ' + cont[0] + ' to get the ' + roleName + ' role!')
        .setColor(0x965BCA)
        .setTimestamp()
        .setFooter('Beep boop, I\'m a bot!');
    message.channel.send(reactMessageEmbed).then(embedMessage => {
        embedMessage.react(cont[0]);
        let newId = embedMessage.id;
        if(!reactRoleMessages[newId]) reactRoleMessages[newId] = {};
        if(!reactRoleMessages[newId].roleName) reactRoleMessages[newId].roleName = roleName;
        if(!reactRoleMessages[newId].emojiReact) reactRoleMessages[newId].emojiReact = cont[0];
    
        fs.writeFile('./Storage/reactRoleMessages.json', JSON.stringify(reactRoleMessages, null, 4), (err) => {
            if(err) console.error(err);
        })
    });
}

module.exports.config = {
    command: "reactrole",
    aliases: ["rolereaction", "reactionrole", "rolereact"]
}