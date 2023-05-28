require('dotenv').config();
const {REST, Routes} = require('discord.js')

const fs = require('node:fs');
const path = require('path');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for(const file of commandFiles){
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON());
}

//instancia REST
const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

//deploy

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();