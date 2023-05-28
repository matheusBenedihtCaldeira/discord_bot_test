// Require the necessary discord.js classes
require('dotenv').config();
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Comandos
const fs = require('node:fs');
const path = require('path');

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
client.commands = new Collection;
//Puxa os comandos dentro da pasta commands
for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command)
    }else(
        console.log(`Esse comando em ${filePath} esta sem 'data' ou 'execute'`)
    )
}

//bot login
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.login(process.env.TOKEN);

//Listener de interações
client.on(Events.InteractionCreate, async i => {
    if(!i.isChatInputCommand()) return
    const command = i.client.commands.get(i.commandName);
    if(!command){
        console.error('Comando não encontrado!')
        return;
    }
    try{
        await command.execute(i)
    }catch(err){
        await i.reply("Erro ao executar esse comando!")
    }
})