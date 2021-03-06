/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*                                                                                                                                                                 -
*                                                                     HappyDragon Bot                                                                             -
*                                                                                                                                                                 -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *                     Universal Variables and Modules                -
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

const Discord = require('discord.js');
const { YouTube } = require('popyt');
const ytdl = require('ytdl-core');
const fs = require('fs');
const moment = require('moment');
const client = new Discord.Client();
const { prefix, discord_token, youtube_token } = require('./auth.json');

const queue = new Map();

const youtube = new YouTube(youtube_token);
let userData = JSON.parse(fs.readFileSync('./Storage/userData.json', 'utf8'));
let items = JSON.parse(fs.readFileSync('./Storage/items.json', 'utf8'));
const reactRoleMessages = JSON.parse(fs.readFileSync('./Storage/reactRoleMessages.json', 'utf8'));

client.aliases = new Discord.Collection();
client.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
	if (err) console.log(err);

	var jsfiles = files.filter(f => f.split('.').pop() === 'js');

	if (jsfiles.length <= 0) {
		return console.log('No JavaScript command files found');
	} else console.log(jsfiles.length + ' commands found.');

	jsfiles.forEach((f, i) => {
		var cmds = require(`./commands/${f}`);
		console.log(`Command #${i + 1}: ${f} loading...`);

		client.commands.set(cmds.config.command, cmds);
		cmds.config.aliases.forEach(alias => {
			client.aliases.set(alias, cmds.config.command);
		});
	});
});

const talkedRecently = new Set();
const generalCollected = new Set();
var nonoWords = ['fag', 'fags', ' fag', 'negro', 'nig', 'nibba', 'nibber', 'nibbar', 'nigga', 'niger', 'niba', 'niga'];
let chance = 10;
volumeLevel = 5;
modRole = 'ADMINISTRATOR';
global.servers = {};

function sleep() {
	n = 3;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *                       Universal Server Embeds                      -                                                                                         -
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const waitEmbed = new Discord.RichEmbed()
	.setColor('#965BCA')
	.setTitle('Wait before sending that again!')
	.setTimestamp()
	.setFooter("Beep boop, I'm a bot!");

const helpEmbed = new Discord.RichEmbed()
	.setColor('#965BCA')
	.setTitle('Help:')
	.addField('Prefix:', '>')
	.addField('Lottery:', '>lottery')
	.addField('Chance of Lotter:', '>lotterychance') //look what im working on its in the fun section
	.addField('I Ban Bad words!', "(they'll get deleted)")
	.addField('Reaction Polls:', '>reactionpoll (title) {body}')
	.addField('Play music:', '>play -name or url-')
	.addField('Skip or stop music:', '>skip and >stop')
	.addField('Random picture:', '>randomimage')
	.addField('Role give on Reaction:', '>reactionrole (emoji) (role)')
	.addField('Economy:', '>daily, (or >addmoney/>removemoney for admins)')
	.setTimestamp()
	.setFooter("Beep boop, I'm a bot!");

const youWon = new Discord.RichEmbed()
	.setColor('#965BCA')
	.setTitle('You Won!!')
	.addField('Notify an admin for your reward')
	.setTimestamp()
	.setFooter("Beep boop, I'm a bot!");
const youLost = new Discord.RichEmbed()
	.setColor('#965BCA')
	.setTitle('You lost :(', 'Chance up!')
	.setTimestamp()
	.setFooter("Beep boop, I'm a bot!");

const nonoWordEmbed = new Discord.RichEmbed()
	.setColor('#965BCA')
	.setTitle('Deleted, thats a nono word.')
	.setTimestamp()
	.setFooter("Beep boop, I'm a bot!");

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *                               Ready!                               -                                                                                         -
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
client.once('ready', () => {
	console.log('Online!');
	client.user.setPresence({
		status: 'online',
		game: {
			name: 'prefix: >',
			type: 'WATCHING'
		}
	});
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*                                                                                                                                                                 -
*                                                                     Moderation Section                                                                          -
*                                                                            1.0                                                                                  -
*                                                                                                                                                                 -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

client.on('guildMemberAdd', guildMember => {
	client.channels
		.get('403311163825324045')
		.send('Hello' + guildMember.toString())
		.then(console.log('Added member'))
		.catch(console.log('Member had an error while joining'));
	guildMember.addRole(guildMember.guild.roles.find(role => role.name === '[REDACTED]'));
	guildMember.addRole(guildMember.guild.roles.find(role => role.name === 'DJ'));
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	var cont = message.content.slice(prefix.length).split(' ');
	const command = cont.shift().toLowerCase();
	var cmd = client.commands.get(command);
	console.log(command);

	var commandName = client.commands.get(client.aliases.get(command)) || client.commands.get(command);

	if (commandName) commandName.run(client, message, cont);

	if (command === 'help') {
		message.channel.send(helpEmbed);
	}

	try {
		for (i = 0; i < nonoWords.length; i++) {
			firstStepMsg = message.toString();
			secondStepMsg = firstStepMsg.toLowerCase();
			if (secondStepMsg.includes(nonoWords[i])) {
				message
					.delete()
					.then(message => console.log(`Deleted message from ${message.author.username}`))
					.catch(console.error('Error With Message Deletion, (check permissions)'));
				message.channel.send(nonoWordEmbed);
			}
		}
	} catch {
		console.error();
	}
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*                                                                                                                                                                 -
*                                                                     Reaction Section                                                                            -
*                                                                              1.1                                                                                -
*                                                                                                                                                                 -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

client.on('raw', raw => {
	if (raw.t == 'MESSAGE_REACTION_ADD') {
		emojiNameNew = raw.d.emoji.name;
		messageID = raw.d.message_id;
		guildID = raw.d.guild_id;
		userID = raw.d.user_id;
		if (reactRoleMessages[messageID]) {
			if (reactRoleMessages[messageID].emojiReact == emojiNameNew) {
				const channel = client.channels.get(raw.d.channel_id);
				channel.fetchMessage(raw.d.message_id).then(message => {
					var messageGuild = client.guilds.get(raw.d.guild_id);
					messageGuild
						.fetchMember(raw.d.user_id)
						.then(member => member.addRole(messageGuild.roles.find(role => role.name == reactRoleMessages[messageID].roleName)))
						.catch(console.error);
				});
			}
		}
	}
	if (raw.t == 'MESSAGE_DELETE') {
		//raw.d.id
		//raw.d.guild_id
	}
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*                                                                                                                                                                 -
*                                                                     Music Bot Section                                                                           -
*                                                                           1.2                                                                                   -
*                                                                                                                                                                 -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}play`)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message, serverQueue);
		return;
	} /*else if(message.content.startsWith(`${prefix}queue`)) {
        queueList(message, serverQueue);
        return;
    }*/
});

async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel)
		return message.channel.send({
			embed: {
				title: 'You need to be in a voice channel to play music!',
				color: 0x965bca
			}
		});
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send({
			embed: {
				title: 'I need the permissions to join and speak in your voice channel!',
				color: 0x965bca
			}
		});
	}

	if (args[1].includes('/watch?v=d')) {
		const songInfo = await ytdl.getInfo(args[1]);

		const song = {
			title: video.title,
			url: video.url
		};
		song.title = video.title;
		song.url = video.url;

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true
			};

			queue.set(message.guild.id, queueContruct);

			queueContruct.songs.push(song);
			message.channel.send({
				embed: {
					title: `${song.title} is now playing.`,
					color: 0x965bca
				}
			});

			try {
				var connection = await voiceChannel.join();
				queueContruct.connection = connection;
				play(message.guild, queueContruct.songs[0]);
			} catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		} else {
			serverQueue.songs.push(song);
			return message.channel.send({
				embed: {
					title: `${song.title} has been added to the queue!`,
					color: 0x965bca
				}
			});
		}
	} else if (!args[1].includes('/watch?v=d')) {
		const video = await youtube.getVideo(args.join(' '));
		const song = {
			title: video.title,
			url: video.url
		};

		song.title = video.title;
		song.url = video.url;

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true
			};

			queue.set(message.guild.id, queueContruct);
			queueContruct.songs.push(song);
			message.channel.send({
				embed: {
					title: `${song.title} is now playing.`,
					color: 0x965bca
				}
			});

			try {
				var connection = await voiceChannel.join();
				queueContruct.connection = connection;
				play(message.guild, queueContruct.songs[0]);
			} catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		} else {
			serverQueue.songs.push(song);
			return message.channel.send({
				embed: {
					title: `${song.title} has been added to the queue!`,
					color: 0x965bca
				}
			});
		}
	}
}

function skip(message, serverQueue) {
	if (!message.member.roles.find(r => r.name === 'DJ'))
		return message.channel.send({
			embed: {
				title: 'You must have the role "DJ" to run that command.',
				color: 0x965bca
			}
		});
	if (!message.member.voiceChannel)
		return message.channel.send({
			embed: {
				title: 'You have to be in a voice channel to stop the music.',
				color: 0x965bca
			}
		});
	if (!serverQueue)
		return message.channel.send({
			embed: {
				title: 'There are no songs left to skip!',
				color: 0x965bca
			}
		});
	const skippedEmbed = new Discord.RichEmbed()
		.setColor('#965BCA')
		.setTitle(`Skipped!`)
		.setTimestamp()
		.setFooter("Beep boop, I'm a bot!");
	message.channel.send(skippedEmbed);
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.roles.find(r => r.name === 'DJ'))
		return message.channel.send({
			embed: {
				title: 'You must have the role "DJ" to run that command.',
				color: 0x965bca
			}
		});
	if (!message.member.voiceChannel)
		return message.channel.send({
			embed: {
				title: 'You have to be in a voice channel to stop the music.',
				color: 0x965bca
			}
		});
	serverQueue.songs = [];

	const stopEmbed = new Discord.RichEmbed()
		.setColor('#965BCA')
		.setTitle('Music has been stopped, and queue cleared')
		.setTimestamp()
		.setFooter("Beep boop, I'm a bot!");
	message.channel.send(stopEmbed);
	serverQueue.connection.dispatcher.end();
}

/*function queueList(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to show the queue');
    if(queueVisual[0] = '' || queueVisual[0] === undefined) return message.channel.send('The queue is empty');
    var queueEmbed = new Discord.RichEmbed()
        .setTitle('Queue (list after next song!):')
        .setColor('#965BCA')
        .setTimestamp()
        .setFooter('Beep Boop, I\'m a Bot!')
    for(e = 0; e < queueVisual.length; e++) {
        queueEmbed.addField(e+1 + ": ", queueVisual[e])
    }
    message.channel.send(queueEmbed);

}*/

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection
		.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*                                                                                                                                                                 -
*                                                                     Economy Section                                                                             -
*                                                                           1.4                                                                                   -
*                                                                                                                                                                 -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
client.on('message', message => {
	let sender = message.author;
	if (message.author.bot || !message.content.startsWith(prefix)) return;
	var args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();
	if (client.user.id === message.author.id) return;
	categories = [];

	if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {};
	if (!userData[sender.id + message.guild.id].money) userData[sender.id + message.guild.id].money = 100;
	if (!userData[sender.id + message.guild.id].lastDaily) userData[sender.id + message.guild.id].lastDaily = 'not';
	if (!userData[sender.id + message.guild.id].lotteryChance) userData[sender.id + message.guild.id].lotteryChance = chance;

	if (command === 'money' || command === 'balance' || command === 'bal') {
		newSender = message.author.id.toString();
		message.channel.send({
			embed: {
				title: 'Bank',
				color: 0x965bca,

				fields: [
					{
						name: 'Account Holder',
						value: message.author.username,
						inline: true
					},
					{
						name: 'Account Balance',
						value: userData[newSender + message.guild.id].money,
						inline: true
					}
				]
			}
		});
	}

	if (command === 'daily') {
		if (userData[sender.id + message.guild.id].lastDaily != moment().format('L')) {
			userData[sender.id + message.guild.id].lastDaily = moment().format('L');
			userData[sender.id + message.guild.id].money += parseInt(500);
			message.channel.send({
				embed: {
					title: 'Daily Income',
					description: 'You got $500 dollars of daily income!',
					color: 0x965bca
				}
			});
		} else {
			message.channel.send({
				embed: {
					title: 'Daily Income',
					description:
						'You already collected your daily reward! next ' +
						moment()
							.endOf('day')
							.fromNow() +
						'.',
					color: 0x965bca
				}
			});
		}
		fs.writeFile('./Storage/userData.json', JSON.stringify(userData, null, 4), err => {
			if (err) console.error(err);
		});
	}

	if (command === 'lottery') {
		userData[sender.id + message.guild.id].money -= parseInt(100);

		if (talkedRecently.has(message.author.id)) {
			message.channel.send(waitEmbed);
		} else {
			var random = Math.floor(Math.random() * 100) + userData[sender.id + message.guild.id].lotteryChance;
			if (random >= 100) {
				userData[sender.id + message.guild.id].money += parseInt(1000);
				message.channel.send(youWon);
				userData[sender.id + message.guild.id].lotteryChance = 10;
			} else {
				message.channel.send(youLost);
				++userData[sender.id + message.guild.id].lotteryChance;
				userData[sender.id + message.guild.id].lotteryChance += parseInt(2);
			}
			talkedRecently.add(message.author.id);
			setTimeout(() => {
				talkedRecently.delete(message.author.id);
			}, 60000);
		}
		fs.writeFile('./Storage/userData.json', JSON.stringify(userData, null, 4), err => {
			if (err) console.error(err);
		});
	}

	if (command === 'lotterychance' || command === 'lotchance') {
		const chanceEmbed = new Discord.RichEmbed()
			.setColor('#965BCA')
			.addField(`Chance for ${sender.username}`, userData[sender.id + message.guild.id].lotteryChance + '%')
			.setTimestamp()
			.setFooter("Beep boop, I'm a bot!");

		message.channel.send(chanceEmbed);
	}

	if (command == 'store' || command === 'shop') {
		{
			for (var i in items) {
				if (!categories.includes(items[i].type)) {
					categories.push(items[i].type);
				}
			}

			const embed = new Discord.RichEmbed().setDescription(`Available Items`).setColor(0xd4af37);

			for (var i = 0; i < categories.length; i++) {
				var tempDesc = '';

				for (var c in items) {
					if (categories[i] === items[c].type) {
						tempDesc += `${items[c].name} - $${items[c].price} - ${items[c].desc}\n`;
					}
				}

				embed.addField(categories[i], tempDesc);
			}

			return message.channel.send({
				embed
			});
		}
	}

	if (command == 'buy') {
		let categories = [];
		if (!args.join(' ')) {
			for (var i in items) {
				if (!categories.includes(items[i].type)) {
					categories.push(items[i].type);
				}
			}

			const embed = new Discord.RichEmbed().setDescription(`Available Items`).setColor(0xd4af37);

			for (var i = 0; i < categories.length; i++) {
				var tempDesc = '';

				for (var c in items) {
					if (categories[i] === items[c].type) {
						tempDesc += `${items[c].name} - $${items[c].price} - ${items[c].desc}\n`;
					}
				}

				embed.addField(categories[i], tempDesc);
			}

			return message.channel.send({
				embed
			});
		}

		let itemName = '';
		let itemPrice = 0;
		let itemDesc = '';

		for (var i in items) {
			if (
				args
					.join(' ')
					.trim()
					.toUpperCase() === items[i].name.toUpperCase()
			) {
				itemName = items[i].name;
				itemPrice = items[i].price;
				itemDesc = items[i].desc;
			}
		}

		if (itemName === '') {
			return message.channel.send(`**Item ${args.join(' ').trim()} not found.**`);
		}
		if (userData[sender.id + message.guild.id].money < itemPrice) {
			return message.channel.send(`**You don't have enough money for this item.**`);
		} else {
			userData[sender.id + message.guild.id].money -= parseInt(itemPrice);
			message.channel.send('**You bought ' + itemName + '!**');
			if (itemName === 'DJ Role') {
				message.guild.members.get(message.author.id).addRole(message.guild.roles.find('name', 'DJ'));
			}
		}
		fs.writeFile('./Storage/userData.json', JSON.stringify(userData, null, 4), err => {
			if (err) console.error(err);
		});
	}

	if (command === 'addmoney') {
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			message.channel.send('**You need the role `' + modRole + '` to use this command...**');
			return;
		}

		if (!args[0]) {
			message.channel.send(`**You need to define an amount. Usage: ${prefix}addmoney <amount> <user>**`);
			return;
		}

		if (isNaN(args[0])) {
			message.channel.send(`**The amount has to be a number. Usage: ${prefix}addmoney <amount> <user>**`);
			return;
		}

		if (args[0] < 0) {
			message.channel.send(`**You can't add negative money...**`);
			return;
		}
		let defineduser = '';
		if (!args[1]) {
			defineduser = message.author.id;
		} else if (!args[1].includes('@')) {
			message.channel.send(`**You need to mentions a user. Usage: ${prefix}ranbal <amount> <user>**`);
		} else {
			defineduser = message.mentions.users.first().id;
		}

		let name = args[1];
		if (!args[1]) {
			message.channel.send(`You had ${args[0]} added to your account.**`);
			userData[defineduser + message.guild.id].money += Math.floor(parseInt(args[0]));
		} else {
			message.channel.send(`**User ${name} had ${args[0]} added to their account.**`);
			userData[defineduser + message.guild.id].money += Math.floor(parseInt(args[0]));
		}
		fs.writeFile('./Storage/userData.json', JSON.stringify(userData, null, 4), err => {
			if (err) console.error(err);
		});
	}

	if (command === 'removemoney' || command === 'remmoney') {
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			message.channel.send('**You need the role `' + modRole + '` to use this command...**');
			return;
		}

		if (!args[0]) {
			message.channel.send(`**You need to define an amount. Usage: ${prefix}addmoney <amount> <user>**`);
			return;
		}

		if (isNaN(args[0])) {
			message.channel.send(`**The amount has to be a number. Usage: ${prefix}addmoney <amount> <user>**`);
			return;
		}

		if (args[0] < 0) {
			message.channel.send(`**You can't remove negative money...**`);
			return;
		}

		let defineduser = '';
		if (!args[1]) {
			defineduser = message.author.id;
		} else if (!args[1].includes('@')) {
			message.channel.send(`**You need to mentions a user. Usage: ${prefix}BALSET <amount> <user>**`);
		} else {
			let firstMentioned = message.mentions.users.first();
			defineduser = firstMentioned.id;
		}
		let name = args[1];
		if (!args[1]) {
			message.channel.send(`You had ${args[0]} removed from your account.**`);
			userData[defineduser + message.guild.id].money -= Math.floor(parseInt(args[0]));
		} else {
			message.channel.send(`**User ${name} had ${args[0]} reomoved from their account.**`);
			userData[defineduser + message.guild.id].money -= Math.floor(parseInt(args[0]));
		}
		fs.writeFile('./Storage/userData.json', JSON.stringify(userData, null, 4), err => {
			if (err) console.error(err);
		});
	}

	if (command === 'randombalance' || command === 'ranbal' || command === 'randombal' || command === 'ranbalance') {
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			message.channel.send('**You need the role `' + modRole + '` to use this command...**');
			return;
		}

		if (!args[0]) {
			message.channel.send(`**You need to define a range. Usage: ${prefix}ranbal <range> <user>**`);
			return;
		}

		if (isNaN(args[0])) {
			message.channel.send(`**The range has to be a number. Usage: ${prefix}ranbal <range> <user>**`);
			return;
		}

		if (args[0] < 0) {
			message.channel.send(`**You can't make a balance negative...**`);
			return;
		}

		let defineduser = '';
		if (!args[1]) {
			defineduser = message.author.id;
		} else if (!args[1].includes('@')) {
			message.channel.send(`**You need to mentions a user. Usage: ${prefix}ranbal <range> <user>**`);
		} else {
			let firstMentioned = message.mentions.users.first();
			defineduser = firstMentioned.id;
		}
		let name = args[1];

		var balanceSet = Math.floor(Math.random() * parseInt(args[0])) + 1;

		if (!args[1]) {
			message.channel.send(`Your account balance was randomly set.**`);
			userData[defineduser + message.guild.id].money = Math.floor(parseInt(balanceSet));
		} else {
			message.channel.send(`**User ${name} had their balance randomly set. Check balance with >bal.**`);
			userData[defineduser + message.guild.id].money = Math.floor(parseInt(balanceSet));
		}
		fs.writeFile('./Storage/userData.json', JSON.stringify(userData, null, 4), err => {
			if (err) console.error(err);
		});
	}

	if (generalCollected.has(message.author.id)) {
	} else {
		userData[message.author.id + message.guild.id].money += Math.floor(parseInt(5));
		talkedRecently.add(message.author.id);
		setTimeout(() => {
			talkedRecently.delete(message.author.id);
		}, 60000);
	}
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*                                                                                                                                                                 -
*                                                                       Setup Section                                                                             -
*                                                                            1.4                                                                                  -
*                                                                                                                                                                 -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    var args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if(command === 'setup') {
        message.channel.send('Coming soon.');
    }
});*/

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*                                                                                                                                                                 -
*                                                                        Fun! Section                                                                             -
*                                                                            1.5                                                                                  -
*                                                                                                                                                                 -
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

let isPlaying = false;

client.on('message', async message => {
	let sender = message.author.id;
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	var args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();
	var mentioned = message.mentions.users.first();
	guildID = message.guild.id;

	if (command === 'duel' && isPlaying === false) {
		if (args.length < 1) return message.channel.send('There are too little arguments.  Use: >duel (opponent)');
		if (args.length > 1) return message.channel.send('That message contains too many arguments. Use: >duel (opponent)');
		if (!args[0].includes('@')) return message.channel.send('You need to @ someone to challenge them!');
		if (!message.mentions.users.first()) return message.channel.send("I can't find that member!");
		if (mentioned.id === sender) return message.channel.send("You can't challange yourself!");

		message.channel
			.send(`You challenged ${mentioned.username} to a duel!! ${mentioned} needs to type >duelaccept in the next 30 seconds to accept!`)

			.then(() => {
				isPlaying = true;
				message.channel
					.awaitMessages(response => response.author.id == mentioned.id || response.author.id == sender, {
						max: 1,
						time: 30000,
						errors: ['time']
					})
					.then(collected => {
						if (collected.first().content == '>duelcancel' && (message.author.id == sender || message.author.id == mentioned.id)) {
							console.log('hey');
							isPlaying = false;
							return message.channel.send('The duel has been called off.');
						} else if (collected.first().content == '>duelaccept' && message.author.id == mentioned.id) {
							message.channel.send('Alright gentlemen, in a bit, a word will appear. The first person to type it correctly wins.').then(() => {
								sleep(Math.floor(Math.random() * 10000) + 1000);
								wordyWords = [
									'Eustachian',
									'University',
									'Comprehension',
									'Chocolate',
									'Phonograph',
									'Electricity',
									'Unbraided',
									'Provisions',
									'Audacity',
									'Gnarled',
									'Apostrophe',
									'Inconceivable',
									'Defrosting',
									'Homogenous',
									'Antiestablishmentarian',
									'Intrinsic',
									'Frolicing',
									'Crutches',
									'Typewriter',
									'Radiowave',
									'Rejection',
									'Turquoise',
									'Fellowship',
									'Foreclosure'
								];
								let randomizer = Math.floor(Math.random() * 23) + 1;
								message.channel.send(wordyWords[randomizer]).then(() => {
									message.channel
										.awaitMessages(
											response => (message.author.id == sender || message.author.id == mentioned.id) && response.content === wordyWords[randomizer],
											{
												max: 1,
												time: 10000,
												errors: ['time']
											}
										)
										.then(collected => {
											if (
												collected.first().content.toLowerCase() === wordyWords[randomizer].toLowerCase() &&
												(message.author.id === mentioned.id || message.author.id === sender)
											) {
												message.channel.send(message.author.username + ' has won!');
												isPlaying = false;
												return;
											} else {
												console.log(collected.first().content);
												message.channel.send('Nobody has won!');
												isPlaying = false;
												return;
											}
										})
										.catch(() => {
											isPlaying = false;
											return message.channel.send('There was no collected message that passed the filter within the time limit!');
										});
								});
							});
						} else {
							return (isPlaying = false);
						}
					})
					.catch(() => {
						isPlaying = false;
						return message.channel.send('There was no collected message that passed the filter within the time limit!');
					});
			});
	}
});

/* - - - - - - - - - - - - - - - -
*         Login Token: 1.01      -
 - - - - - - - - - - - - - - - - */
client.login(discord_token);

/* - - - - - - - - - - - - - - - -
*               WIPS:            -
 - - - - - - - - - - - - - - - - */
