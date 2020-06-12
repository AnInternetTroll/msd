const Discord = require('discord.js')
const client = new Discord.Client()
const config = require("./config.json")
const request = require('request');
const moment = require('moment');
const prefix = config.prefix

//when the bot comes online
client.on('ready', () => {
    UpdateActivity();

    console.log("Connected as " + client.user.tag);
    console.log("Connecting to " + client.guilds.size + " server(s)");
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name);
        guild.channels.forEach((channel) => {
            console.log("  - " + channel.name);
        })
    })
})

//when a message is recieved
client.on('message', (msg) => {
    if (msg.author == client.user) {
        return;
    }
    if (msg.author.bot) {
        return;
	}
	
    if (msg.content.startsWith(prefix)){
        processCommand(msg);
    }
})

function UpdateActivity(){
    client.user.setActivity(prefix + "help");
    console.log("updated activity");
}

function processCommand(msg){
    let fullCommand = msg.content.substr(prefix.length);
    let splitCommand = fullCommand.split(",");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);

    for(i = 0; i < arguments.length; i++){
        arguments[i] = arguments[i].trim();
	}
	
    if (primaryCommand == "help"){
        Help(arguments, msg);
	}
	else if (primaryCommand == "commands"){
        Comamnds(arguments, msg);
    }
    else if (primaryCommand == "wr"){
        WR(arguments, msg);
    }
    else if(primaryCommand == "avatar"){
        Avatar(arguments, msg);
    }
    else if(primaryCommand == "ping"){
        Ping(arguments, msg);
    }
    else if(primaryCommand == "uptime"){
        Uptime(arguments, msg);
    }
}

//help
function Help(arguments, msg){
    msg.channel.send("**this bot was made by Skycloud!**\nSource code is available at *github url*\nuse `" + prefix + "commands` to list all commands");
}

//commands
function Commands(arguments, msg){
    msg.channel.send("**List of commands**\n" + prefix + "wr\n" + prefix + "avatar\n" + prefix + "ping\n" + prefix + "uptime\n");
}

//wr
function WR(arguments, msg){
    if (arguments.length == 2) {

        myUrl = "https://speedrun.com/api/v1/leaderboards/" + arguments[0] + "/category/" + arguments[1] + "?top=1";

        var options = {
            url: myUrl,
            headers: {
                'User-Agent': 'discord bot with a command that fetches world records from speedrun.com'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var jsonParsed = JSON.parse(body);
                msg.channel.send(jsonParsed.data.runs[0].run.weblink + "\n" + jsonParsed.data.runs[0].run.videos.links[0].uri);
            }
            else {
                console.log(error + " : " + response.statusCode);
                msg.channel.send("error " + response.statusCode + "\n" + error);
            }
        }

        request(options, callback);
    }
    else {
        msg.channel.send("you need 2 arguments: [game] [category]");
        return;
    }
}

//avatar
function Avatar(arguments, msg){
    msg.channel.send(msg.author.tag + ": " + msg.author.avatarURL);
}

//ping
function Ping(arguments, msg){
    msg.channel.send("Pong! " + Math.round(client.ping) + "ms");
}

//uptime
function Uptime(arguments, msg){
   var diff = new moment.duration(client.uptime);
   let seconds = diff.seconds();
   let minutes = diff.minutes();
   let hours = diff.hours();
   let days = diff.days();
   let months = diff.months();
   let uptime = `${months} months, ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
   msg.channel.send(uptime);
}

client.login(config.token)
