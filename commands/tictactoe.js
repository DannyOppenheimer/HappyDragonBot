const Discord = require('discord.js');
const fs = require('fs');
const tttGames = JSON.parse(fs.readFileSync('./Storage/tttGames.json', 'utf8'));

module.exports.run = async (client, message, cont) => {
    if(!tttGames[message.guild.id + message.author.id]) tttGames[message.guild.id + message.author.id] = {};

    if(!tttGames[message.guild.id + message.author.id].a1) tttGames[message.guild.id + message.author.id].a1 = "-";
    if(!tttGames[message.guild.id + message.author.id].a2) tttGames[message.guild.id + message.author.id].a2 = "-";
    if(!tttGames[message.guild.id + message.author.id].a3) tttGames[message.guild.id + message.author.id].a3 = "-";
    if(!tttGames[message.guild.id + message.author.id].b1) tttGames[message.guild.id + message.author.id].b1 = "-";
    if(!tttGames[message.guild.id + message.author.id].b2) tttGames[message.guild.id + message.author.id].b2 = "-";
    if(!tttGames[message.guild.id + message.author.id].b3) tttGames[message.guild.id + message.author.id].b3 = "-";
    if(!tttGames[message.guild.id + message.author.id].c1) tttGames[message.guild.id + message.author.id].c1 = "-";
    if(!tttGames[message.guild.id + message.author.id].c2) tttGames[message.guild.id + message.author.id].c2 = "-";
    if(!tttGames[message.guild.id + message.author.id].c3) tttGames[message.guild.id + message.author.id].c3 = "-";

    fs.writeFile('./Storage/tttGames.json', JSON.stringify(tttGames, null, 4), (err) => {
        if(err) console.error(err);
    });

    tttPlayer(message);   
}

module.exports.config = {
    command: "tictactoe",
    aliases: ["ttt"]
}

async function tttPlayer(message) {
    let tictactoeEmbed = new Discord.RichEmbed()
        .setTitle('Reply with the coordinates you would like to place your X!')
        .setColor(0x965BCA)
        .addField("Board:", '-------1----2----3---- \n----▉ ▉ ▉ ▉ ▉ ▉\nA-- ▉ ' + tttGames[message.guild.id + message.author.id].a1 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a2 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a3 + ' ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nB-- ▉   ' +  tttGames[message.guild.id + message.author.id].b1 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b2 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b3 + '    ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nC-- ▉   ' + tttGames[message.guild.id + message.author.id].c1 + '   ▉    ' + tttGames[message.guild.id + message.author.id].c2 + '    ▉   ' + tttGames[message.guild.id + message.author.id].c3 + "    ▉\n----▉ ▉ ▉ ▉ ▉ ▉")
        .setFooter('Beep boop, I\'m a bot!')
        .setTimestamp()
    let msg = await message.channel.send(tictactoeEmbed) 

    const tttFilter = response => ((response.content.toLowerCase().includes('a1') || response.content.toLowerCase().includes('a2') || response.content.toLowerCase().includes('a3') || response.content.toLowerCase().includes('b1') || response.content.toLowerCase().includes('b2') || response.content.toLowerCase().includes('b3') || response.content.toLowerCase().includes('c1') || response.content.toLowerCase().includes('c2') || response.content.toLowerCase().includes('c3')) && (tttGames[response.guild.id + response.author.id]))

    msg.channel.awaitMessages(tttFilter, { 
        max: 1,
        time: 60000,
        errors: ['time'],

    })
    .then((collected) => {
        var newSender = collected.first().author.id;
        var newGuild = collected.first().guild.id;
        var collectedLower = collected.first().content.toLowerCase();
        if(collectedLower === 'a1') {
            tttGames[message.guild.id + message.author.id].a1 = 'X';
        } else if(collectedLower === 'a2') {
            tttGames[message.guild.id + message.author.id].a2 = 'X';
        } else if(collectedLower === 'a3') {
            tttGames[message.guild.id + message.author.id].a3 = 'X';
        } else if(collectedLower === 'b1') {
            tttGames[message.guild.id + message.author.id].b1 = 'X';
        } else if(collectedLower === 'b2') {
            tttGames[message.guild.id + message.author.id].b2 = 'X';
        } else if(collectedLower === 'b3') {
            tttGames[message.guild.id + message.author.id].b3 = 'X';
        } else if(collectedLower === 'c1') {
            tttGames[message.guild.id + message.author.id].c1 = 'X';
        } else if(collectedLower === 'c2') {
            tttGames[message.guild.id + message.author.id].c2 = 'X';
        } else if(collectedLower === 'c3') {
            tttGames[message.guild.id + message.author.id].c3 = 'X';
        }

        fs.writeFile('./Storage/tttGames.json', JSON.stringify(tttGames, null, 4), (err) => {
            if(err) console.error(err);
        });

        let tictactoeEmbed = new Discord.RichEmbed()
                .setTitle('Reply with the coordinates you would like to place your X!')
                .setColor(0x965BCA)
                .addField("Board:", '-------1----2----3---- \n----▉ ▉ ▉ ▉ ▉ ▉\nA-- ▉ ' + tttGames[message.guild.id + message.author.id].a1 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a2 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a3 + ' ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nB-- ▉   ' +  tttGames[message.guild.id + message.author.id].b1 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b2 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b3 + '    ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nC-- ▉   ' + tttGames[message.guild.id + message.author.id].c1 + '   ▉    ' + tttGames[message.guild.id + message.author.id].c2 + '    ▉   ' + tttGames[message.guild.id + message.author.id].c3 + "    ▉\n----▉ ▉ ▉ ▉ ▉ ▉")
                .setFooter('Beep boop, I\'m a bot!')
                .setTimestamp()
        msg.edit(tictactoeEmbed).then(() => {
            tttAI(msg, message, newSender, newGuild);
        });
    })
    .catch(() => {
        let tictactoeEmbed = new Discord.RichEmbed()
            .setTitle('You ran out of time, now it\'s my turn!')
            .setColor(0x965BCA)
            .addField("Board:", '-------1----2----3---- \n----▉ ▉ ▉ ▉ ▉ ▉\nA-- ▉ ' + tttGames[message.guild.id + message.author.id].a1 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a2 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a3 + ' ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nB-- ▉   ' +  tttGames[message.guild.id + message.author.id].b1 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b2 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b3 + '    ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nC-- ▉   ' + tttGames[message.guild.id + message.author.id].c1 + '   ▉    ' + tttGames[message.guild.id + message.author.id].c2 + '    ▉   ' + tttGames[message.guild.id + message.author.id].c3 + "    ▉\n----▉ ▉ ▉ ▉ ▉ ▉")
            .setFooter('Beep boop, I\'m a bot!')
            .setTimestamp();
        msg.edit(tictactoeEmbed);
        tttAI(msg, message, newSender, newGuild);
    })
}

async function tttAI(msg, message, newSender, newGuild) {
    if((tttGames[newGuild + newSender].a1) + (tttGames[newGuild + newSender].a2) + (tttGames[newGuild + newSender].a3) === "XXX") {
        resetOnPlayerWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].b1) + (tttGames[newGuild + newSender].b2) + (tttGames[newGuild + newSender].b3) === "XXX") {
        resetOnPlayerWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].c1) + (tttGames[newGuild + newSender].c2) + (tttGames[newGuild + newSender].c3) === "XXX") {
        resetOnPlayerWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].a1) + (tttGames[newGuild + newSender].b1) + (tttGames[newGuild + newSender].c1) === "XXX") {
        resetOnPlayerWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].a2) + (tttGames[newGuild + newSender].b2) + (tttGames[newGuild + newSender].c2) === "XXX") {
        resetOnPlayerWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].a3) + (tttGames[newGuild + newSender].b3) + (tttGames[newGuild + newSender].c3) === "XXX") {
        resetOnPlayerWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].a1) + (tttGames[newGuild + newSender].b2) + (tttGames[newGuild + newSender].c3) === "XXX") {
        resetOnPlayerWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].a3) + (tttGames[newGuild + newSender].b2) + (tttGames[newGuild + newSender].c1) === "XXX") {
        resetOnPlayerWin(message, newGuild, newSender);
    } else {
        if(tttGames[newGuild + newSender].a1 + tttGames[newGuild + newSender].a2 == 'XX') {
            tttGames[newGuild + newSender].a3 = 'O';
        } else if(tttGames[newGuild + newSender].a2 + tttGames[newGuild + newSender].a3 == 'XX') {
            tttGames[newGuild + newSender].a1 = 'O';
        } else if(tttGames[newGuild + newSender].a1 + tttGames[newGuild + newSender].a3 == 'XX') {
            tttGames[newGuild + newSender].a2 = 'O';
        } else if(tttGames[newGuild + newSender].a2 + tttGames[newGuild + newSender].b2 == 'XX') {
            tttGames[newGuild + newSender].c2 = 'O';
        } else if(tttGames[newGuild + newSender].b1 + tttGames[newGuild + newSender].b2 == 'XX') {
            tttGames[newGuild + newSender].b3 = 'O';
        } else if(tttGames[newGuild + newSender].b1 + tttGames[newGuild + newSender].b3 == 'XX') {
            tttGames[newGuild + newSender].b2 = 'O';
        } else if(tttGames[newGuild + newSender].b2 + tttGames[newGuild + newSender].b3 == 'XX') {
            tttGames[newGuild + newSender].b1 = 'O';
        } else if(tttGames[newGuild + newSender].c1 + tttGames[newGuild + newSender].c2 == 'XX') {
            tttGames[newGuild + newSender].c3 = 'O';
        } else if(tttGames[newGuild + newSender].c2 + tttGames[newGuild + newSender].c3 == 'XX') {
            tttGames[newGuild + newSender].c1 = 'O';
        } else if(tttGames[newGuild + newSender].c1 + tttGames[newGuild + newSender].c3 == 'XX') {
            tttGames[newGuild + newSender].c2 = 'O';
        } else if(tttGames[newGuild + newSender].a1 + tttGames[newGuild + newSender].b2 == 'XX') {
            tttGames[newGuild + newSender].c3 = 'O';
        } else if(tttGames[newGuild + newSender].b2 + tttGames[newGuild + newSender].c3 == 'XX') {
            tttGames[newGuild + newSender].a1 = 'O';
        } else if(tttGames[newGuild + newSender].a1 + tttGames[newGuild + newSender].c3 == 'XX') {
            tttGames[newGuild + newSender].b2 = 'O';
        } else if(tttGames[newGuild + newSender].a3 + tttGames[newGuild + newSender].b2 == 'XX') {
            tttGames[newGuild + newSender].c1 = 'O';
        } else if(tttGames[newGuild + newSender].b2 + tttGames[newGuild + newSender].c1 == 'XX') {
            tttGames[newGuild + newSender].a3 = 'O';
        } else if(tttGames[newGuild + newSender].c1 + tttGames[newGuild + newSender].a3 == 'XX') {
            tttGames[newGuild + newSender].b2 = 'O';
        } else {
            //
            if(tttGames[newGuild + newSender].b2 == '-') {
                tttGames[newGuild + newSender].b2 = 'O'
            } else if(tttGames[newGuild + newSender].a1 == '-') {
                tttGames[newGuild + newSender].a1 = 'O'
            } else if(tttGames[newGuild + newSender].a3 == '-') {
                tttGames[newGuild + newSender].a3 = 'O'
            } else if(tttGames[newGuild + newSender].c1 == '-') {
                tttGames[newGuild + newSender].c1 = 'O'
            } else if(tttGames[newGuild + newSender].c3 == '-') {
                tttGames[newGuild + newSender].c3 = 'O'
            } else if(tttGames[newGuild + newSender].b1 == '-') {
                tttGames[newGuild + newSender].c1 = 'O'
            } else if(tttGames[newGuild + newSender].b3 == '-') {
                tttGames[newGuild + newSender].b3 = 'O'
            } else if(tttGames[newGuild + newSender].a2 == '-') {
                tttGames[newGuild + newSender].a2 = 'O'
            } else if(tttGames[newGuild + newSender].c2 == '-') {
                tttGames[newGuild + newSender].c2 = 'O'
            }  
        }
        fs.writeFile('./Storage/tttGames.json', JSON.stringify(tttGames, null, 4), (err) => {
            if(err) console.error(err);
        });
        let tictactoeEmbed = new Discord.RichEmbed()
            .setTitle('Reply with the coordinates you would like to place your X!')
            .setColor(0x965BCA)
            .addField("Board:", '-------1----2----3---- \n----▉ ▉ ▉ ▉ ▉ ▉\nA-- ▉ ' + tttGames[message.guild.id + message.author.id].a1 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a2 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a3 + ' ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nB-- ▉   ' +  tttGames[message.guild.id + message.author.id].b1 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b2 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b3 + '    ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nC-- ▉   ' + tttGames[message.guild.id + message.author.id].c1 + '   ▉    ' + tttGames[message.guild.id + message.author.id].c2 + '    ▉   ' + tttGames[message.guild.id + message.author.id].c3 + "    ▉\n----▉ ▉ ▉ ▉ ▉ ▉")
            .setFooter('Beep boop, I\'m a bot!')
            .setTimestamp()
        msg.edit(tictactoeEmbed).then(() => {
            tttPlayer2(msg, message, newSender, newGuild);
        });
    }
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*                                                                                                                                                                 -
*                                                                  Secondary Player Function                                                                      -
*                                                                            1.3                                                                                  -
*                                                                                                                                                                 -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

async function tttPlayer2(msg, message, newSender, newGuild) {

    ///
    if((tttGames[newGuild + newSender].a1) + (tttGames[newGuild + newSender].a2) + (tttGames[newGuild + newSender].a3) === "OOO") {
        resetOnAIWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].b1) + (tttGames[newGuild + newSender].b2) + (tttGames[newGuild + newSender].b3) === "OOO") {
        resetOnAIWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].c1) + (tttGames[newGuild + newSender].c2) + (tttGames[newGuild + newSender].c3) === "OOO") {
        resetOnAIWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].a1) + (tttGames[newGuild + newSender].b1) + (tttGames[newGuild + newSender].c1) === "OOO") {
        resetOnAIWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].a2) + (tttGames[newGuild + newSender].b2) + (tttGames[newGuild + newSender].c2) === "OOO") {
        resetOnAIWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].a3) + (tttGames[newGuild + newSender].b3) + (tttGames[newGuild + newSender].c3) === "OOO") {
        resetOnAIWin(message)
    } else if((tttGames[newGuild + newSender].a3) + (tttGames[newGuild + newSender].b2) + (tttGames[newGuild + newSender].c1) === "OOO") {
        resetOnAIWin(message, newGuild, newSender);
    } else if((tttGames[newGuild + newSender].a1) + (tttGames[newGuild + newSender].b2) + (tttGames[newGuild + newSender].c3) === "OOO") {
        resetOnAIWin(message, newGuild, newSender);
    }

    const tttFilter = response => ((response.content.toLowerCase().includes('a1') || response.content.toLowerCase().includes('a2') || response.content.toLowerCase().includes('a3') || response.content.toLowerCase().includes('b1') || response.content.toLowerCase().includes('b2') || response.content.toLowerCase().includes('b3') || response.content.toLowerCase().includes('c1') || response.content.toLowerCase().includes('c2') || response.content.toLowerCase().includes('c3')) && (tttGames[response.guild.id + response.author.id]))

    msg.channel.awaitMessages(tttFilter, { 
        max: 1,
        time: 60000,
        errors: ['time'],

    })
    .then((collected) => {
        var newSender = collected.first().author.id;
        var newGuild = collected.first().guild.id;

        if(tttGames[message.guild.id + message.author.id].collectedContent != '-' ) {
            let tictactoeEmbed = new Discord.RichEmbed()
                .setTitle('Hmmm, that space is already taken...')
                .setColor(0x965BCA)
                .addField("Board:", '-------1----2----3---- \n----▉ ▉ ▉ ▉ ▉ ▉\nA-- ▉ ' + tttGames[message.guild.id + message.author.id].a1 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a2 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a3 + ' ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nB-- ▉   ' +  tttGames[message.guild.id + message.author.id].b1 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b2 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b3 + '    ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nC-- ▉   ' + tttGames[message.guild.id + message.author.id].c1 + '   ▉    ' + tttGames[message.guild.id + message.author.id].c2 + '    ▉   ' + tttGames[message.guild.id + message.author.id].c3 + "    ▉\n----▉ ▉ ▉ ▉ ▉ ▉")
                .setFooter('Beep boop, I\'m a bot!')
                .setTimestamp()
            msg.edit(tictactoeEmbed);
            tttPlayer2(msg, message, newSender, newGuild)
        }
        
        if(collected.first().content === 'A1' || collected.first().content === 'a1') {
            tttGames[message.guild.id + message.author.id].a1 = 'X';
        } else if(collected.first().content === 'A2' || collected.first().content === 'a2') {
            tttGames[message.guild.id + message.author.id].a2 = 'X';
        } else if(collected.first().content === 'A3' || collected.first().content === 'a3') {
            tttGames[message.guild.id + message.author.id].a3 = 'X';
        } else if(collected.first().content === 'B1' || collected.first().content === 'b1') {
            tttGames[message.guild.id + message.author.id].b1 = 'X';
        } else if(collected.first().content === 'B2' || collected.first().content === 'b2') {
            tttGames[message.guild.id + message.author.id].b2 = 'X';
        } else if(collected.first().content === 'B3' || collected.first().content === 'b3') {
            tttGames[message.guild.id + message.author.id].b3 = 'X';
        } else if(collected.first().content === 'C1' || collected.first().content === 'c1') {
            tttGames[message.guild.id + message.author.id].c1 = 'X';
        } else if(collected.first().content === 'C2' || collected.first().content === 'c2') {
            tttGames[message.guild.id + message.author.id].c2 = 'X';
        } else if(collected.first().content === 'C3' || collected.first().content === 'c3') {
            tttGames[message.guild.id + message.author.id].c3 = 'X';
        }

        fs.writeFile('./Storage/tttGames.json', JSON.stringify(tttGames, null, 4), (err) => {
            if(err) console.error(err);
        });

        let tictactoeEmbed = new Discord.RichEmbed()
                .setTitle('Reply with the coordinates you would like to place your X!')
                .setColor(0x965BCA)
                .addField("Board:", '-------1----2----3---- \n----▉ ▉ ▉ ▉ ▉ ▉\nA-- ▉ ' + tttGames[message.guild.id + message.author.id].a1 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a2 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a3 + ' ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nB-- ▉   ' +  tttGames[message.guild.id + message.author.id].b1 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b2 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b3 + '    ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nC-- ▉   ' + tttGames[message.guild.id + message.author.id].c1 + '   ▉    ' + tttGames[message.guild.id + message.author.id].c2 + '    ▉   ' + tttGames[message.guild.id + message.author.id].c3 + "    ▉\n----▉ ▉ ▉ ▉ ▉ ▉")
                .setFooter('Beep boop, I\'m a bot!')
                .setTimestamp()
        msg.edit(tictactoeEmbed).then(() => {
            tttAI(msg, message, newSender, newGuild);
        });
    })
    .catch(() => {
        let tictactoeEmbed = new Discord.RichEmbed()
            .setTitle('You ran out of time, now it\'s my turn!')
            .setColor(0x965BCA)
            .addField("Board:", '-------1----2----3---- \n----▉ ▉ ▉ ▉ ▉ ▉\nA-- ▉ ' + tttGames[message.guild.id + message.author.id].a1 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a2 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a3 + ' ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nB-- ▉   ' +  tttGames[message.guild.id + message.author.id].b1 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b2 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b3 + '    ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nC-- ▉   ' + tttGames[message.guild.id + message.author.id].c1 + '   ▉    ' + tttGames[message.guild.id + message.author.id].c2 + '    ▉   ' + tttGames[message.guild.id + message.author.id].c3 + "    ▉\n----▉ ▉ ▉ ▉ ▉ ▉")
            .setFooter('Beep boop, I\'m a bot!')
            .setTimestamp();
        msg.edit(tictactoeEmbed);
        tttAI(msg, message, newSender, newGuild);
    });
}

async function resetOnPlayerWin(message) {
    tttGames[newGuild + newSender].a1 = "-";
    tttGames[newGuild + newSender].a2 = "-";
    tttGames[newGuild + newSender].a3 = "-";
    tttGames[newGuild + newSender].b1 = "-";
    tttGames[newGuild + newSender].b2 = "-";
    tttGames[newGuild + newSender].b3 = "-";
    tttGames[newGuild + newSender].c1 = "-";
    tttGames[newGuild + newSender].c2 = "-";
    tttGames[newGuild + newSender].c3 = "-";
    let tictactoeEmbed = new Discord.RichEmbed()
        .setTitle(`${message.author.username} won their TicTacToe Game!`)
        .setColor(0x965BCA)
        .addField("Board:", '-------1----2----3---- \n----▉ ▉ ▉ ▉ ▉ ▉\nA-- ▉ ' + tttGames[message.guild.id + message.author.id].a1 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a2 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a3 + ' ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nB-- ▉   ' +  tttGames[message.guild.id + message.author.id].b1 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b2 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b3 + '    ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nC-- ▉   ' + tttGames[message.guild.id + message.author.id].c1 + '   ▉    ' + tttGames[message.guild.id + message.author.id].c2 + '    ▉   ' + tttGames[message.guild.id + message.author.id].c3 + "    ▉\n----▉ ▉ ▉ ▉ ▉ ▉")
        .setFooter('Beep boop, I\'m a bot!')
        .setTimestamp()
    return msg.edit(tictactoeEmbed);
}

async function resetOnAIWin(message) {
    tttGames[newGuild + newSender].a1 = "-";
    tttGames[newGuild + newSender].a2 = "-";
    tttGames[newGuild + newSender].a3 = "-";
    tttGames[newGuild + newSender].b1 = "-";
    tttGames[newGuild + newSender].b2 = "-";
    tttGames[newGuild + newSender].b3 = "-";
    tttGames[newGuild + newSender].c1 = "-";
    tttGames[newGuild + newSender].c2 = "-";
    tttGames[newGuild + newSender].c3 = "-";
    let tictactoeEmbed = new Discord.RichEmbed()
        .setTitle(`${message.author.username} has lost their game to the AI :(`)
        .setColor(0x965BCA)
        .addField("Board:", '-------1----2----3---- \n----▉ ▉ ▉ ▉ ▉ ▉\nA-- ▉ ' + tttGames[message.guild.id + message.author.id].a1 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a2 + ' ▉ ' +  tttGames[message.guild.id + message.author.id].a3 + ' ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nB-- ▉   ' +  tttGames[message.guild.id + message.author.id].b1 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b2 + '    ▉   ' +  tttGames[message.guild.id + message.author.id].b3 + '    ▉\n----▉ ▉ ▉ ▉ ▉ ▉\nC-- ▉   ' + tttGames[message.guild.id + message.author.id].c1 + '   ▉    ' + tttGames[message.guild.id + message.author.id].c2 + '    ▉   ' + tttGames[message.guild.id + message.author.id].c3 + "    ▉\n----▉ ▉ ▉ ▉ ▉ ▉")
        .setFooter('Beep boop, I\'m a bot!')
        .setTimestamp()
    return msg.edit(tictactoeEmbed);

}